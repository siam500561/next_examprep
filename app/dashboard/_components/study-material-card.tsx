"use client";

import { getMaterialStatus } from "@/app/dashboard/materials/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Material } from "@/lib/db/schema";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface StudyMaterialCardProps {
  material: Material;
}

interface CourseLayout {
  data: {
    course_title?: string;
    chapters: Array<{
      summary: string;
    }>;
  };
}

const COURSE_TYPE_EMOJI = {
  Exam: "👨‍🎓",
  "Job Interview": "💼",
  Practice: "📝",
  "Coding Prep": "👨‍💻",
  Other: "📚",
} as const;

const DIFFICULTY_COLORS = {
  Beginner: {
    badge: "bg-green-500/10 text-green-700",
    progress: {
      gradient: `
        linear-gradient(
          to top,
          rgba(34, 197, 94, 0.15),
          rgba(34, 197, 94, 0.15),
          rgba(34, 197, 94, 0.15)
        )
      `,
      glow: {
        line: "rgba(34, 197, 94, 0.8)",
        shadow:
          "rgba(34, 197, 94, 0.5), rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.2)",
      },
    },
  },
  Intermediate: {
    badge: "bg-blue-500/10 text-blue-700",
    progress: {
      gradient: `
        linear-gradient(
          to top,
          rgba(59, 130, 246, 0.15),
          rgba(59, 130, 246, 0.15),
          rgba(59, 130, 246, 0.15)
        )
      `,
      glow: {
        line: "rgba(59, 130, 246, 0.8)",
        shadow:
          "rgba(59, 130, 246, 0.5), rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.2)",
      },
    },
  },
  Advanced: {
    badge: "bg-orange-500/10 text-orange-700",
    progress: {
      gradient: `
        linear-gradient(
          to top,
          rgba(249, 115, 22, 0.15),
          rgba(249, 115, 22, 0.15),
          rgba(249, 115, 22, 0.15)
        )
      `,
      glow: {
        line: "rgba(249, 115, 22, 0.8)",
        shadow:
          "rgba(249, 115, 22, 0.5), rgba(249, 115, 22, 0.3), rgba(249, 115, 22, 0.2)",
      },
    },
  },
  Expert: {
    badge: "bg-red-500/10 text-red-700",
    progress: {
      gradient: `
        linear-gradient(
          to top,
          rgba(239, 68, 68, 0.15),
          rgba(239, 68, 68, 0.15),
          rgba(239, 68, 68, 0.15)
        )
      `,
      glow: {
        line: "rgba(239, 68, 68, 0.8)",
        shadow:
          "rgba(239, 68, 68, 0.5), rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.2)",
      },
    },
  },
} as const;

export function StudyMaterialCard({ material }: StudyMaterialCardProps) {
  const [status, setStatus] = useState(material.status);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const courseLayout = material.courseLayout as CourseLayout;
  const emoji =
    COURSE_TYPE_EMOJI[material.courseType as keyof typeof COURSE_TYPE_EMOJI] ||
    "📚";
  const difficultyTheme =
    DIFFICULTY_COLORS[
      material.difficultyLevel as keyof typeof DIFFICULTY_COLORS
    ] || DIFFICULTY_COLORS.Beginner;

  useEffect(() => {
    if (material.status?.startsWith("Generating")) {
      const progressMatch = material.status.match(/\((\d+)%\)/);
      if (progressMatch) {
        setProgress(parseInt(progressMatch[1]));
      }

      const interval = setInterval(async () => {
        try {
          const data = await getMaterialStatus(material.courseId);
          setStatus(data.status);

          const newProgressMatch = data.status?.match(/\((\d+)%\)/);
          if (newProgressMatch) {
            setProgress(parseInt(newProgressMatch[1]));
          }

          if (data.status === "Completed") {
            clearInterval(interval);
            router.refresh();
          }
        } catch (error) {
          console.error("Failed to fetch status:", error);
          setStatus("Error: Failed to generate");
          clearInterval(interval);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [material.courseId, material.status, router]);

  const isGenerating = status?.startsWith("Generating");
  const isCompleted = status === "Completed";
  const hasError = status?.startsWith("Error");

  return (
    <Card className="group hover:shadow-md transition-all relative overflow-hidden">
      {isGenerating && (
        <>
          <div
            className="absolute inset-0 transition-all duration-1000 ease-out"
            style={{
              clipPath: `inset(${100 - progress}% 0 0 0)`,
              background: difficultyTheme.progress.gradient,
              backdropFilter: "blur(8px)",
            }}
          />

          <div
            className="absolute inset-x-0 h-[2px] transition-all duration-1000"
            style={{
              top: `${100 - progress}%`,
              background: `linear-gradient(90deg, transparent, ${difficultyTheme.progress.glow.line}, transparent)`,
              boxShadow: `0 0 20px ${
                difficultyTheme.progress.glow.shadow.split(", ")[0]
              }, 0 0 40px ${
                difficultyTheme.progress.glow.shadow.split(", ")[1]
              }, 0 0 80px ${
                difficultyTheme.progress.glow.shadow.split(", ")[2]
              }`,
              animation: "moveGlow 2s linear infinite",
            }}
          />
        </>
      )}

      <div className="relative z-10">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{emoji}</span>
              <Badge variant="outline" className={difficultyTheme.badge}>
                {material.difficultyLevel}
              </Badge>
            </div>
            <Badge variant="secondary" className="font-normal">
              {formatDate(material.createdAt)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {courseLayout?.data?.course_title || material.topic}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {courseLayout?.data?.chapters[0]?.summary || "Loading summary..."}
          </p>

          {hasError && (
            <div className="text-sm text-red-500">
              Failed to generate notes. Please try again.
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Badge variant="secondary">{material.courseType}</Badge>
          {isCompleted ? (
            <Button asChild size="sm" className="group/button">
              <Link href={`/dashboard/materials/${material.courseId}`}>
                View Material
                <ArrowRight className="w-4 h-4 ml-2 group-hover/button:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          ) : (
            <Button size="sm" disabled variant="secondary">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}
