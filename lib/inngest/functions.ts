import { db } from "@/lib/db";
import { chapterNotesTable, materialsTable } from "@/lib/db/schema";
import { generateChapterNotes } from "@/lib/google-ai";
import { eq } from "drizzle-orm";
import { inngest } from "./client";

export const generateNotes = inngest.createFunction(
  { id: "generate-notes" },
  { event: "notes.generate" },
  async ({ event, step }) => {
    const { courseId, chapters } = event.data;

    try {
      // Get the course material
      const material = await step.run("fetch-material", async () => {
        const result = await db
          .select()
          .from(materialsTable)
          .where(eq(materialsTable.courseId, courseId));

        if (!result.length) {
          throw new Error(`Material not found for courseId: ${courseId}`);
        }

        return result[0];
      });

      // Set status to generating
      await step.run("update-status-generating", async () => {
        await db
          .update(materialsTable)
          .set({ status: "Generating Notes" })
          .where(eq(materialsTable.courseId, courseId));
      });

      // Generate notes for each chapter
      for (const chapter of chapters) {
        await step.run(`generate-notes-${chapter.id}`, async () => {
          try {
            const notes = await generateChapterNotes({
              topic: material.topic,
              courseType: material.courseType,
              difficultyLevel: material.difficultyLevel,
              chapterTitle: chapter.title,
              chapterSummary: chapter.summary,
            });

            // Store the notes in the database
            await db.insert(chapterNotesTable).values({
              courseId,
              chapterId: chapter.id,
              notes,
            });

            return { success: true, chapterId: chapter.id };
          } catch (error) {
            console.error(
              `Failed to generate notes for chapter ${chapter.id}:`,
              error
            );
            // Update status to error for this specific chapter
            await db
              .update(materialsTable)
              .set({
                status: `Error: Failed to generate notes for chapter ${chapter.title}`,
              })
              .where(eq(materialsTable.courseId, courseId));
            throw error;
          }
        });
      }

      // Update final status
      return await step.run("update-status-complete", async () => {
        await db
          .update(materialsTable)
          .set({ status: "Completed" })
          .where(eq(materialsTable.courseId, courseId));

        return {
          success: true,
          message: "Successfully generated notes for all chapters",
          courseId,
        };
      });
    } catch (error) {
      // Update status to error
      await db
        .update(materialsTable)
        .set({
          status:
            error instanceof Error
              ? `Error: ${error.message}`
              : "Error: Failed to generate notes",
        })
        .where(eq(materialsTable.courseId, courseId));

      console.error("Notes generation error:", {
        courseId,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw error;
    }
  }
);
