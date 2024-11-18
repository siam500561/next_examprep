import { db } from "@/lib/db";
import { chapterNotesTable, materialsTable } from "@/lib/db/schema";
import { generateChapterNotes } from "@/lib/google-ai";
import { eq } from "drizzle-orm";
import { inngest } from "./client";

// Initial function to start the process
export const generateNotes = inngest.createFunction(
  { id: "generate-notes" },
  { event: "notes.generate" },
  async ({ event, step }) => {
    const { courseId, chapters } = event.data;

    // Initialize the process
    await step.run("initialize", async () => {
      await db
        .update(materialsTable)
        .set({ status: "Generating (0%)" })
        .where(eq(materialsTable.courseId, courseId));
    });

    // Trigger individual chapter processing
    await step.sendEvent("start.chapter.processing", {
      name: "notes.process.chapter",
      data: {
        courseId,
        chapters,
        currentIndex: 0,
        totalChapters: chapters.length,
      },
    });

    return { success: true };
  }
);

// Function to process individual chapters
export const processChapter = inngest.createFunction(
  { id: "process-chapter" },
  { event: "notes.process.chapter" },
  async ({ event, step }) => {
    const { courseId, chapters, currentIndex, totalChapters } = event.data;

    // Get material info
    const material = await step.run("fetch-material", async () => {
      const result = await db
        .select()
        .from(materialsTable)
        .where(eq(materialsTable.courseId, courseId));
      return result[0];
    });

    if (currentIndex < totalChapters) {
      const chapter = chapters[currentIndex];

      try {
        // Generate notes for current chapter
        const notes = await step.run("generate-chapter-notes", async () => {
          return await generateChapterNotes({
            topic: material.topic,
            courseType: material.courseType,
            difficultyLevel: material.difficultyLevel,
            chapterTitle: chapter.title,
            chapterSummary: chapter.summary,
          });
        });

        // Save notes for current chapter
        await step.run("save-chapter-notes", async () => {
          await db.insert(chapterNotesTable).values({
            courseId,
            chapterId: currentIndex + 1,
            notes,
          });
        });

        // Update progress
        const progress = Math.round(((currentIndex + 1) / totalChapters) * 100);
        await step.run("update-progress", async () => {
          await db
            .update(materialsTable)
            .set({ status: `Generating (${progress}%)` })
            .where(eq(materialsTable.courseId, courseId));
        });

        // Schedule next chapter processing
        if (currentIndex + 1 < totalChapters) {
          await step.sendEvent("process.next.chapter", {
            name: "notes.process.chapter",
            data: {
              courseId,
              chapters,
              currentIndex: currentIndex + 1,
              totalChapters,
            },
          });
        } else {
          // All chapters completed
          await step.run("complete-process", async () => {
            await db
              .update(materialsTable)
              .set({ status: "Completed" })
              .where(eq(materialsTable.courseId, courseId));
          });
        }
      } catch (error) {
        // Handle errors
        await step.run("handle-error", async () => {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          await db
            .update(materialsTable)
            .set({ status: `Error: ${errorMessage}` })
            .where(eq(materialsTable.courseId, courseId));

          // Retry the same chapter after a delay if it's a recoverable error
          if (
            error instanceof Error &&
            (error.message?.includes("429") || error.message?.includes("quota"))
          ) {
            await step.sleep("retry.delay", "30s");
            await step.sendEvent("retry.chapter.processing", {
              name: "notes.process.chapter",
              data: { courseId, chapters, currentIndex, totalChapters },
            });
          }
        });
        throw error;
      }
    }

    return { success: true };
  }
);
