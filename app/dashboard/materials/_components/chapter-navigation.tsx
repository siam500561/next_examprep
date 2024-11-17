"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ChapterNavigationProps {
  courseId: string;
  title: string;
  courseTitle: string;
  chapterNumber: number;
  totalChapters: number;
}

export function ChapterNavigation({
  courseId,
  title,
  courseTitle,
  chapterNumber,
  totalChapters,
}: ChapterNavigationProps) {
  const router = useRouter();

  const goToChapter = (offset: number) => {
    const newChapterNumber = chapterNumber + offset;
    router.push(
      `/dashboard/materials/${courseId}/chapters/${newChapterNumber}`
    );
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b">
      <div className="container flex items-center justify-between h-16 gap-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/dashboard/materials/${courseId}`}>
              <ChevronLeft className="h-4 w-4" />
              Back to Chapters
            </Link>
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold">{title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{courseTitle}</span>
              <span>•</span>
              <span>
                Chapter {chapterNumber} of {totalChapters}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToChapter(-1)}
            disabled={chapterNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToChapter(1)}
            disabled={chapterNumber >= totalChapters}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
