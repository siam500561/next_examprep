import { db } from "@/lib/db";
import { usersTable } from "@/lib/db/schema";
import { WebhookEvent } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Webhook } from "svix";

// Webhook secret key from Clerk Dashboard
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || "";

async function validateRequest(request: Request) {
  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  return evt;
}

export async function POST(request: Request) {
  const evt = await validateRequest(request);

  if (evt instanceof Response) {
    return evt;
  }

  const eventType = evt.type;

  // Handle the webhook
  try {
    switch (eventType) {
      case "user.created": {
        const { email_addresses, username } = evt.data;
        const primaryEmail = email_addresses?.[0]?.email_address;

        if (!primaryEmail) {
          return new Response("No email found", { status: 400 });
        }

        await db.insert(usersTable).values({
          username: username || primaryEmail.split("@")[0],
          email: primaryEmail,
          clerkId: evt.data.id,
        });
        break;
      }

      case "user.updated": {
        const { email_addresses, username } = evt.data;
        const primaryEmail = email_addresses?.[0]?.email_address;

        if (!primaryEmail) {
          return new Response("No email found", { status: 400 });
        }

        await db
          .update(usersTable)
          .set({
            username: username || "user",
            email: primaryEmail,
          })
          .where(eq(usersTable.clerkId, evt.data.id!));
        break;
      }

      case "user.deleted": {
        await db.delete(usersTable).where(eq(usersTable.clerkId, evt.data.id!));
        break;
      }
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
}
