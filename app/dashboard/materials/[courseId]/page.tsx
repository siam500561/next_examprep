import { db } from "@/lib/db";
import { materialsTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ChapterList } from "../_components/chapter-list";
import { StudyMaterialHeader } from "../_components/study-material-header";
import { StudyTools } from "../_components/study-tools";

type StudyMaterialPageProps = {
  params: Promise<{
    courseId: string;
    chapterId: string;
  }>;
};

async function getMaterial(courseId: string) {
  const material = await db
    .select()
    .from(materialsTable)
    .where(eq(materialsTable.courseId, courseId))
    .then((res) => res[0]);

  if (!material) {
    notFound();
  }

  return material;
}

export default async function StudyMaterialPage({
  params,
}: StudyMaterialPageProps) {
  const material = await getMaterial((await params).courseId);
  const courseLayout = material.courseLayout as any;

  return (
    <div className="flex-1 h-full">
      <StudyMaterialHeader
        title={courseLayout?.data?.course_title || material.topic}
        description={courseLayout?.data?.summary}
        courseType={material.courseType}
        difficultyLevel={material.difficultyLevel}
      />

      <div className="px-6 py-8 md:px-8 lg:px-12 space-y-8">
        <StudyTools courseId={material.courseId} />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Chapters</h2>
          <ChapterList
            chapters={courseLayout?.data?.chapters || []}
            courseId={material.courseId}
          />
        </div>
      </div>
    </div>
  );
}
