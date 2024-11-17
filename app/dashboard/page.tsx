import { db } from "@/lib/db";
import { materialsTable } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { Suspense } from "react";
import Header from "./_components/header";
import { RefreshButton } from "./_components/refresh-button";
import { StudyMaterialCard } from "./_components/study-material-card";
import { StudyMaterialSkeleton } from "./_components/study-material-skeleton";

async function getStudyMaterials() {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const materials = await db
    .select()
    .from(materialsTable)
    .where(eq(materialsTable.createdBy, userId))
    .orderBy(desc(materialsTable.createdAt));

  return materials;
}

export default async function DashboardPage() {
  const materials = await getStudyMaterials();

  return (
    <div className="w-full p-4">
      <Header />
      <div className="flex-1 pt-4 space-y-4">
        <div className="flex items-center justify-between mt-3">
          <h2 className="text-xl font-bold">Your Study Material</h2>
          <RefreshButton />
        </div>

        <Suspense fallback={<StudyMaterialsLoading />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <StudyMaterialCard key={material.id} material={material} />
            ))}
            {materials.length === 0 && (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium text-muted-foreground">
                  No study materials yet
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first study material to get started
                </p>
              </div>
            )}
          </div>
        </Suspense>
      </div>
    </div>
  );
}

function StudyMaterialsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <StudyMaterialSkeleton key={i} />
      ))}
    </div>
  );
}
