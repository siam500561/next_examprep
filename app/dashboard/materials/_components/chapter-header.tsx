"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ChapterHeaderProps {
  courseId: string;
  title: string;
  courseTitle: string;
  chapterNumber: number;
}

export function ChapterHeader({
  courseId,
  title,
  courseTitle,
  chapterNumber,
}: ChapterHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-background">
      <div className="container flex items-center h-16 gap-4">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href={`/dashboard/materials/${courseId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex flex-col space-y-1">
          <h1 className="text-lg font-semibold leading-none">{title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{courseTitle}</span>
            <span>•</span>
            <span>Chapter {chapterNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
