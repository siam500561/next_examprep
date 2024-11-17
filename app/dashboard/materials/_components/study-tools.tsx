"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BookCopy, BookOpen, HelpCircle, PenTool } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface StudyToolsProps {
  courseId: string;
}

const tools = [
  {
    label: "Notes/Chapters",
    description: "Read chapter by chapter",
    icon: BookOpen,
    href: (courseId: string) => `/dashboard/materials/${courseId}`,
    status: "ready",
  },
  {
    label: "Flashcard",
    description: "Quick concept review",
    icon: BookCopy,
    href: (courseId: string) => `/dashboard/materials/${courseId}/flashcards`,
    status: "generate",
  },
  {
    label: "Quiz",
    description: "Test your knowledge",
    icon: PenTool,
    href: (courseId: string) => `/dashboard/materials/${courseId}/quiz`,
    status: "generate",
  },
  {
    label: "Question/Answer",
    description: "Practice problems",
    icon: HelpCircle,
    href: (courseId: string) => `/dashboard/materials/${courseId}/qa`,
    status: "generate",
  },
] as const;

export function StudyTools({ courseId }: StudyToolsProps) {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tools.map((tool) => {
        const href = tool.href(courseId);
        const isActive = pathname === href;

        return (
          <Card
            key={tool.label}
            className={cn(
              "group relative overflow-hidden transition-all hover:shadow-md",
              isActive && "border-primary/50 bg-primary/5"
            )}
          >
            <Link href={href}>
              <div className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <tool.icon className="h-8 w-8 text-primary/80" />
                    <Badge
                      variant={
                        tool.status === "ready" ? "default" : "secondary"
                      }
                      className={cn(
                        "px-2 py-0.5 text-xs font-medium",
                        tool.status === "ready"
                          ? "bg-green-500/10 text-green-700 hover:bg-green-500/20"
                          : "hover:bg-secondary/80"
                      )}
                    >
                      {tool.status === "ready" ? "Ready" : "Generate"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {tool.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
