import { db } from "@/lib/db";
import { chapterNotesTable, materialsTable } from "@/lib/db/schema";
import { generateChapterNotes } from "@/lib/google-ai";
import { eq } from "drizzle-orm";
import { inngest } from "./client";

// Exponential backoff helper
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const backoff = async (retries: number) => {
  const backoffTime = Math.min(1000 * Math.pow(2, retries), 10000); // Max 10 seconds
  await wait(backoffTime);
};

export const generateNotes = inngest.createFunction(
  { id: "generate-notes" },
  { event: "notes.generate" },
  async ({ event, step }) => {
    const { courseId, chapters } = event.data;
    const totalChapters = chapters.length;

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

      // Set initial status
      await step.run("update-status-generating", async () => {
        await db
          .update(materialsTable)
          .set({ status: "Generating (0%)" })
          .where(eq(materialsTable.courseId, courseId));
      });

      // Generate notes for all chapters with rate limiting
      const chapterResults = await step.run("generate-all-notes", async () => {
        const batchSize = 1; // Reduced batch size to 1
        const results = [];
        let completedChapters = 0;
        let retryCount = 0;

        for (let i = 0; i < chapters.length; i += batchSize) {
          const batch = chapters.slice(i, i + batchSize);

          try {
            const batchPromises = batch.map(async (chapter: any) => {
              try {
                const notes = await generateChapterNotes({
                  topic: material.topic,
                  courseType: material.courseType,
                  difficultyLevel: material.difficultyLevel,
                  chapterTitle: chapter.title,
                  chapterSummary: chapter.summary,
                });

                completedChapters++;
                const progress = Math.round(
                  (completedChapters / totalChapters) * 100
                );

                // Update progress
                await db
                  .update(materialsTable)
                  .set({ status: `Generating (${progress}%)` })
                  .where(eq(materialsTable.courseId, courseId));

                return {
                  chapterId: chapter.id,
                  notes,
                };
              } catch (error: unknown) {
                if (
                  error instanceof Error &&
                  (error.message?.includes("429") ||
                    error.message?.includes("quota"))
                ) {
                  retryCount++;
                  await backoff(retryCount);
                  // Retry this chapter
                  i -= batchSize;
                  return null;
                }
                throw error;
              }
            });

            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults.filter(Boolean));

            // Add a small delay between batches
            await wait(1000);

            // Reset retry count on successful batch
            retryCount = 0;
          } catch (error) {
            console.error(`Batch error at index ${i}:`, error);
            throw error;
          }
        }

        return results;
      });

      // Store all generated notes in the database
      await step.run("save-all-notes", async () => {
        const insertPromises = chapterResults.map(({ chapterId, notes }) =>
          db.insert(chapterNotesTable).values({
            courseId,
            chapterId,
            notes,
          })
        );

        await Promise.all(insertPromises);
      });

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
