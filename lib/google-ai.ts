import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error("Missing GOOGLE_AI_API_KEY");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function generateCourseContent(prompt: string) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);

    if (!jsonMatch || !jsonMatch[1]) {
      throw new Error("Invalid response format");
    }

    try {
      // Parse the extracted JSON
      const jsonContent = JSON.parse(jsonMatch[1].trim());
      return jsonContent;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      throw new Error("Failed to parse JSON content");
    }
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate course content");
  }
}

interface GenerateNotesParams {
  topic: string;
  courseType: string;
  difficultyLevel: string;
  chapterTitle: string;
  chapterSummary: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateChapterNotes(
  params: GenerateNotesParams,
  retryCount = 0
) {
  try {
    const prompt = `Generate comprehensive study notes for this specific chapter:

Topic: ${params.topic}
Course Type: ${params.courseType}
Difficulty Level: ${params.difficultyLevel}
Chapter Title: ${params.chapterTitle}
Chapter Summary: ${params.chapterSummary}

Create a detailed study guide that includes at least:
- 5 key concepts
- Detailed explanations for each concept
- 2-3 practical examples
- 3-5 practice questions with answers
- 2-3 additional learning resources

Return as a JSON object with this structure:

{
  "key_concepts": [
    "First important concept",
    "Second important concept",
    "Third important concept",
    "Fourth important concept",
    "Fifth important concept"
  ],
  "explanations": {
    "First important concept": "Detailed explanation here...",
    "Second important concept": "Detailed explanation here...",
    "Third important concept": "Detailed explanation here...",
    "Fourth important concept": "Detailed explanation here...",
    "Fifth important concept": "Detailed explanation here..."
  },
  "examples": [
    {
      "title": "Example 1",
      "description": "Detailed example description",
      "code": "Example code or steps here"
    },
    {
      "title": "Example 2",
      "description": "Detailed example description",
      "code": "Example code or steps here"
    }
  ],
  "practice_questions": [
    {
      "question": "First practice question?",
      "answer": "Detailed answer here"
    },
    {
      "question": "Second practice question?",
      "answer": "Detailed answer here"
    },
    {
      "question": "Third practice question?",
      "answer": "Detailed answer here"
    }
  ],
  "additional_resources": [
    {
      "title": "Resource 1",
      "type": "article/video/book",
      "description": "Why this resource is helpful"
    },
    {
      "title": "Resource 2",
      "type": "article/video/book",
      "description": "Why this resource is helpful"
    }
  ]
}

Important:
- Ensure all sections have content
- Make explanations detailed and clear
- Include practical, relevant examples
- Create challenging practice questions
- Recommend specific, relevant resources`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const parsed = JSON.parse(text.replace(/```json\n|\n```/g, "").trim());

      // Validate content
      const isValid =
        parsed.key_concepts.length >= 3 &&
        Object.keys(parsed.explanations).length >= 3 &&
        parsed.examples.length >= 1 &&
        parsed.practice_questions.length >= 2 &&
        parsed.additional_resources.length >= 1;

      if (!isValid && retryCount < 3) {
        console.log(
          `Retry ${retryCount + 1} for chapter: ${
            params.chapterTitle
          } due to insufficient content`
        );
        await delay(1000); // Wait 1 second before retry
        return generateChapterNotes(params, retryCount + 1);
      }

      if (!isValid) {
        throw new Error("Generated content does not meet minimum requirements");
      }

      return parsed;
    } catch (parseError) {
      if (retryCount < 3) {
        console.log(
          `Retry ${retryCount + 1} for chapter: ${
            params.chapterTitle
          } due to parse error`
        );
        await delay(1000);
        return generateChapterNotes(params, retryCount + 1);
      }
      throw parseError;
    }
  } catch (error) {
    console.error("AI Generation Error for chapter:", {
      chapterTitle: params.chapterTitle,
      error: error instanceof Error ? error.message : "Unknown error",
      attempt: retryCount + 1,
    });
    throw error;
  }
}
