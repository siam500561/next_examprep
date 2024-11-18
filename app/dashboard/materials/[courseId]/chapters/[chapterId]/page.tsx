import { db } from "@/lib/db";
import { chapterNotesTable, materialsTable } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ChapterContent } from "../../../_components/chapter-content";
import { ChapterHeader } from "../../../_components/chapter-header";

interface ChapterPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

async function getChapterData(courseId: string, chapterId: string) {
  const material = await db
    .select()
    .from(materialsTable)
    .where(eq(materialsTable.courseId, courseId))
    .then((res) => res[0]);

  if (!material) {
    notFound();
  }

  const notes = await db
    .select()
    .from(chapterNotesTable)
    .where(
      and(
        eq(chapterNotesTable.courseId, courseId),
        eq(chapterNotesTable.chapterId, parseInt(chapterId))
      )
    )
    .then((res) => res[0]);

  const courseLayout = material.courseLayout as {
    data: {
      chapters: Array<{
        title: string;
        summary: string;
      }>;
    };
  };

  const chapter = courseLayout?.data?.chapters[parseInt(chapterId) - 1];

  if (!chapter) {
    notFound();
  }

  return {
    material,
    chapter,
    notes: notes?.notes,
    totalChapters: courseLayout.data.chapters.length,
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { material, chapter, notes, totalChapters } = await getChapterData(
    params.courseId,
    params.chapterId
  );

  const currentChapter = parseInt(params.chapterId);
  const prevChapterId =
    currentChapter > 1 ? (currentChapter - 1).toString() : undefined;
  const nextChapterId =
    currentChapter < totalChapters
      ? (currentChapter + 1).toString()
      : undefined;

  return (
    <div className="min-h-full flex flex-col w-full">
      <ChapterHeader
        courseId={params.courseId}
        title={chapter.title}
        courseTitle={material.topic}
        chapterNumber={currentChapter}
        prevChapterId={prevChapterId}
        nextChapterId={nextChapterId}
      />
      <ChapterContent chapter={chapter} notes={notes as any} />
    </div>
  );
}
