"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createStudyMaterialPrompt } from "@/lib/prompts/study-material";
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createMaterial, generateMaterial } from "../actions";
import { Category } from "./create-onboarding";

interface CreateFormProps {
  category: Category;
  onBack: () => void;
}

export function CreateForm({ category, onBack }: CreateFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const { userId } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !difficultyLevel || !userId) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const { prompt, isValid, error } = createStudyMaterialPrompt(
        topic,
        category.title,
        difficultyLevel
      );

      if (!isValid) {
        toast.error(error);
        return;
      }

      // Generate unique courseId
      const courseId = `${category.id}-${Date.now()}`;

      // Create material
      const createResult = await createMaterial({
        courseId,
        courseType: category.title,
        topic,
        difficultyLevel,
      });

      if (createResult.error) {
        toast.error(createResult.error);
        return;
      }

      // Generate content
      const generateResult = await generateMaterial(prompt, courseId);

      if (generateResult.error) {
        toast.error(generateResult.error);
        return;
      }

      toast.success("Study material created successfully!");
      router.replace("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center gap-2">
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{category.icon}</span>
          <h2 className="text-lg font-medium">{category.title}</h2>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Enter topic or paste the content for which you want to generate
            study material
          </label>
          <Textarea
            placeholder="Start writing here"
            className="min-h-[150px] resize-none"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Select the difficulty Level
          </label>
          <Select
            value={difficultyLevel}
            onValueChange={setDifficultyLevel}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Difficulty Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
              <SelectItem value="Expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" disabled={isLoading} type="submit">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
    </form>
  );
}
