"use server";

import { db } from "@/lib/db";
import { materialsTable } from "@/lib/db/schema";
import { generateCourseContent } from "@/lib/google-ai";
import { inngest } from "@/lib/inngest/client";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createMaterialSchema = z.object({
  courseId: z.string(),
  courseType: z.string(),
  topic: z.string(),
  difficultyLevel: z.string(),
});

export async function createMaterial(
  values: z.infer<typeof createMaterialSchema>
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const validatedFields = createMaterialSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        error: "Invalid fields",
      };
    }

    const material = await db
      .insert(materialsTable)
      .values({
        ...validatedFields.data,
        createdBy: userId,
      })
      .returning();

    revalidatePath("/dashboard");
    return { success: true, data: material[0] };
  } catch (error) {
    console.error("[CREATE_MATERIAL]", error);
    return {
      error: "Something went wrong",
    };
  }
}

export async function generateMaterial(prompt: string, courseId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const content = await generateCourseContent(prompt);

    await db
      .update(materialsTable)
      .set({
        courseLayout: content,
        status: "Generating Notes",
      })
      .where(eq(materialsTable.courseId, courseId));

    await inngest.send({
      name: "notes.generate",
      data: {
        courseId,
        chapters: content.data.chapters.map(
          (chapter: { title: string; summary: string }, index: number) => ({
            id: index + 1,
            title: chapter.title,
            summary: chapter.summary,
          })
        ),
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("[GENERATE_MATERIAL]", error);
    return {
      error: "Failed to generate content",
    };
  }
}
