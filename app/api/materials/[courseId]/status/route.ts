import { db } from "@/lib/db";
import { materialsTable } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const material = await db
      .select({
        status: materialsTable.status,
      })
      .from(materialsTable)
      .where(eq(materialsTable.courseId, params.courseId))
      .then((res) => res[0]);

    if (!material) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(material);
  } catch (error) {
    console.error("[MATERIAL_STATUS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
