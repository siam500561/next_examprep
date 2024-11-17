"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface ChapterHeaderProps {
  courseId: string;
  title: string;
  courseTitle: string;
  chapterNumber: number;
  totalChapters: number;
  hasNextChapter: boolean;
  hasPrevChapter: boolean;
}

export function ChapterHeader({
  courseId,
  title,
  courseTitle,
  chapterNumber,
  totalChapters,
  hasNextChapter,
  hasPrevChapter,
}: ChapterHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const goToChapter = (offset: number) => {
    const newChapterNumber = chapterNumber + offset;
    const basePath = pathname.split("/").slice(0, -1).join("/");
    router.push(`${basePath}/${newChapterNumber}`);
  };

  return (
    <div className="sticky top-0 z-50 bg-background border-b">
      <div className="container flex items-center h-16 gap-4">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href={`/dashboard/materials/${courseId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold leading-none">{title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{courseTitle}</span>
              <span>•</span>
              <span>
                Chapter {chapterNumber} of {totalChapters}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              disabled={!hasPrevChapter}
              onClick={() => goToChapter(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={!hasNextChapter}
              onClick={() => goToChapter(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
