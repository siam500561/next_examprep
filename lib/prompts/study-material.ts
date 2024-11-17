import { z } from "zod";

// Validation schema for user input
const inputSchema = z.object({
  topic: z.string().min(3).max(200),
  courseType: z.enum([
    "Exam",
    "Job Interview",
    "Practice",
    "Coding Prep",
    "Other",
  ]),
  difficultyLevel: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
});

// Type for the expected response format
export type StudyMaterialResponse = {
  success: boolean;
  error?: string;
  data?: {
    course_title: string;
    chapters: Array<{
      title: string;
      summary: string;
      topics: string[];
    }>;
  };
};

export function createStudyMaterialPrompt(
  topic: string,
  courseType: string,
  difficultyLevel: string
): { prompt: string; isValid: boolean; error?: string } {
  try {
    // Validate user input
    const validated = inputSchema.parse({
      topic,
      courseType,
      difficultyLevel,
    });

    // Create a sanitized, structured prompt
    const prompt = `You are a professional study material creator. Create a comprehensive study material with the following specifications:

Topic: ${validated.topic}
Course Type: ${validated.courseType}
Difficulty Level: ${validated.difficultyLevel}

Provide your response in the following format:

\`\`\`json
{
  "success": true,
  "data": {
    "course_title": "course overview (This sould be maximum 10 10)",
    "chapters": [
      {
        "title": "chapter title",
        "summary": "chapter summary",
        "topics": ["topic 1", "topic 2", "topic 3"]
      }
    ]
  }
}
\`\`\`

Important guidelines:
- Keep responses focused and relevant to the topic
- Maintain appropriate difficulty level throughout
- Ensure logical progression between chapters
- Include practical examples where applicable
- Focus on key concepts and learning objectives
- Ensure the response is wrapped in \`\`\`json code blocks
- The JSON must be properly formatted and valid

Do not include any additional text or explanations outside the JSON code block.`;

    return { prompt, isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        prompt: "",
        isValid: false,
        error:
          "Invalid input parameters. Please check your input and try again.",
      };
    }
    return {
      prompt: "",
      isValid: false,
      error: "An unexpected error occurred while creating the prompt.",
    };
  }
}

// Validate AI response
export function validateStudyMaterialResponse(
  response: unknown
): StudyMaterialResponse {
  try {
    // Define response schema
    const responseSchema = z.object({
      success: z.boolean(),
      data: z.object({
        course_title: z.string().min(50).max(1000),
        chapters: z
          .array(
            z.object({
              title: z.string().min(3).max(100),
              summary: z.string().min(50).max(500),
              topics: z.array(z.string().min(3).max(100)).min(1).max(10),
            })
          )
          .min(1)
          .max(20),
      }),
    });

    // Validate and return the response
    const validatedResponse = responseSchema.parse(response);
    return {
      success: true,
      data: validatedResponse.data,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: "Invalid response format or content",
    };
  }
}
