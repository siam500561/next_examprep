import { db } from "@/lib/db";
import { chapterNotesTable, materialsTable } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ChapterContent } from "../../../_components/chapter-content";
import { ChapterNavigation } from "../../../_components/chapter-navigation";

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

  const courseLayout = material.courseLayout as {
    data: {
      chapters: Array<{
        title: string;
        summary: string;
      }>;
    };
  };

  const chapterIndex = parseInt(chapterId) - 1;
  const chapter = courseLayout?.data?.chapters[chapterIndex];

  if (!chapter) {
    notFound();
  }

  const notes = await db
    .select()
    .from(chapterNotesTable)
    .where(
      and(
        eq(chapterNotesTable.courseId, courseId),
        eq(chapterNotesTable.chapterId, chapterIndex + 1)
      )
    )
    .then((res) => res[0]?.notes || null);

  return {
    material,
    chapter,
    notes,
    totalChapters: courseLayout.data.chapters.length,
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { material, chapter, notes, totalChapters } = await getChapterData(
    params.courseId,
    params.chapterId
  );

  const chapterNumber = parseInt(params.chapterId);

  return (
    <div className="min-h-full flex flex-col">
      <ChapterNavigation
        courseId={params.courseId}
        title={chapter.title}
        courseTitle={material.topic}
        chapterNumber={chapterNumber}
        totalChapters={totalChapters}
      />
      <ChapterContent notes={notes} />
    </div>
  );
}
