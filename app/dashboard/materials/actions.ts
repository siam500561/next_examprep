"use server";

import { db } from "@/lib/db";
import { materialsTable } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function getMaterialStatus(courseId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const material = await db
      .select({
        status: materialsTable.status,
      })
      .from(materialsTable)
      .where(eq(materialsTable.courseId, courseId))
      .then((res) => res[0]);

    if (!material) {
      throw new Error("Material not found");
    }

    return material;
  } catch (error) {
    console.error("[GET_MATERIAL_STATUS]", error);
    throw error;
  }
}
