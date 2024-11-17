import { Badge } from "@/components/ui/badge";
import { COURSE_TYPE_EMOJI, DIFFICULTY_COLORS } from "@/lib/constants";

interface StudyMaterialHeaderProps {
  title: string;
  description?: string;
  courseType: string;
  difficultyLevel: string;
}

export function StudyMaterialHeader({
  title,
  description,
  courseType,
  difficultyLevel,
}: StudyMaterialHeaderProps) {
  const emoji =
    COURSE_TYPE_EMOJI[courseType as keyof typeof COURSE_TYPE_EMOJI] || "📚";
  const difficultyColor =
    DIFFICULTY_COLORS[difficultyLevel as keyof typeof DIFFICULTY_COLORS];

  return (
    <div className="border-b">
      <div className="px-6 py-8 md:px-8 lg:px-12 max-w-4xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">{emoji}</span>
          <Badge variant="outline" className={difficultyColor}>
            {difficultyLevel}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="mt-2 text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
