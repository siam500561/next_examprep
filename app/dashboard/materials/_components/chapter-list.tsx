"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ChapterListProps {
  chapters: Array<{
    title: string;
    summary: string;
  }>;
  courseId: string;
}

export function ChapterList({ chapters, courseId }: ChapterListProps) {
  return (
    <div className="grid gap-3">
      {chapters.map((chapter, index) => (
        <motion.div
          key={chapter.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link href={`/dashboard/materials/${courseId}/chapters/${index + 1}`}>
            <Card className="group hover:shadow-md transition-all border-l-4 border-l-primary/0 hover:border-l-primary">
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 group-hover:bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary/70" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Chapter {index + 1}
                        </p>
                        <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                          {chapter.title}
                        </h3>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
