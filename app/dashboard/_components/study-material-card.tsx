"use client";

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
import { useEffect, useRef, useState } from "react";

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
  Beginner: "bg-green-500/10 text-green-700",
  Intermediate: "bg-blue-500/10 text-blue-700",
  Advanced: "bg-orange-500/10 text-orange-700",
  Expert: "bg-red-500/10 text-red-700",
} as const;

export function StudyMaterialCard({
  material: initialMaterial,
}: StudyMaterialCardProps) {
  const [material, setMaterial] = useState(initialMaterial);
  const pollingRef = useRef<NodeJS.Timeout>();
  const router = useRouter();

  const courseLayout = material.courseLayout as CourseLayout;
  const emoji =
    COURSE_TYPE_EMOJI[material.courseType as keyof typeof COURSE_TYPE_EMOJI] ||
    "📚";
  const difficultyColor =
    DIFFICULTY_COLORS[
      material.difficultyLevel as keyof typeof DIFFICULTY_COLORS
    ] || "bg-gray-500/10 text-gray-700";

  useEffect(() => {
    // Clear existing interval if any
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    // Only start polling if status is not completed
    if (material.status !== "Completed") {
      pollingRef.current = setInterval(async () => {
        try {
          const response = await fetch(
            `/api/materials/${material.courseId}/status`
          );
          if (!response.ok) throw new Error("Failed to fetch status");

          const data = await response.json();

          if (data.status !== material.status) {
            setMaterial((prev) => ({
              ...prev,
              status: data.status,
            }));

            if (data.status === "Completed") {
              if (pollingRef.current) {
                clearInterval(pollingRef.current);
              }
              router.refresh();
            }
          }
        } catch (error) {
          console.error("Failed to fetch status:", error);
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
          }
        }
      }, 3000);
    }

    // Cleanup function
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [material.courseId, material.status]); // Only depend on courseId, not the entire material object

  return (
    <Card className="group hover:shadow-md transition-all">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{emoji}</span>
            <Badge variant="outline" className={difficultyColor}>
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
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge variant="secondary">{material.courseType}</Badge>
        {material.status === "Completed" ? (
          <Button asChild size="sm" className="group/button">
            <Link href={`/dashboard/materials/${material.courseId}`}>
              View Material
              <ArrowRight className="w-4 h-4 ml-2 group-hover/button:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        ) : (
          <Button size="sm" disabled variant="secondary">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {material.status || "Generating..."}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
