import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  safetySettings,
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
});

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

Return ONLY a valid JSON object with this exact structure:

{
  "key_concepts": ["concept1", "concept2", "concept3", "concept4", "concept5"],
  "explanations": {
    "concept1": "explanation1",
    "concept2": "explanation2",
    "concept3": "explanation3",
    "concept4": "explanation4",
    "concept5": "explanation5"
  },
  "examples": [
    {
      "title": "Example 1",
      "description": "description1",
      "code": "code1"
    }
  ],
  "practice_questions": [
    {
      "question": "question1",
      "answer": "answer1"
    }
  ],
  "additional_resources": [
    {
      "title": "resource1",
      "type": "type1",
      "description": "description1"
    }
  ]
}

Important:
- Return ONLY the JSON object, no additional text or formatting
- Ensure all string values are properly escaped
- Do not use line breaks within string values
- Avoid special characters that might break JSON parsing`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and validate the JSON
    const cleanedText = text
      .replace(/```json\n|\n```/g, "") // Remove code blocks
      .replace(/[\u0000-\u001F]+/g, " ") // Remove control characters
      .replace(/\n/g, " ") // Replace newlines with spaces
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();

    try {
      const parsed = JSON.parse(cleanedText);

      // Validate content structure
      const isValid =
        Array.isArray(parsed.key_concepts) &&
        parsed.key_concepts.length >= 3 &&
        typeof parsed.explanations === "object" &&
        Object.keys(parsed.explanations).length >= 3 &&
        Array.isArray(parsed.examples) &&
        parsed.examples.length >= 1 &&
        Array.isArray(parsed.practice_questions) &&
        parsed.practice_questions.length >= 2 &&
        Array.isArray(parsed.additional_resources) &&
        parsed.additional_resources.length >= 1;

      if (!isValid && retryCount < 3) {
        console.log(
          `Retry ${retryCount + 1} for chapter: ${
            params.chapterTitle
          } due to invalid content structure`
        );
        await delay(1000);
        return generateChapterNotes(params, retryCount + 1);
      }

      if (!isValid) {
        throw new Error("Generated content does not meet minimum requirements");
      }

      return parsed;
    } catch (parseError) {
      console.error("JSON Parse Error:", {
        error: parseError,
        text: cleanedText.substring(0, 200) + "...", // Log first 200 chars for debugging
      });

      if (retryCount < 3) {
        console.log(
          `Retry ${retryCount + 1} for chapter: ${
            params.chapterTitle
          } due to parse error`
        );
        await delay(1000);
        return generateChapterNotes(params, retryCount + 1);
      }
      throw new Error(
        `Failed to parse AI response after ${retryCount} retries`
      );
    }
  } catch (error) {
    if (retryCount < 3) {
      console.log(
        `Retry ${retryCount + 1} for chapter: ${
          params.chapterTitle
        } due to generation error`
      );
      await delay(1000);
      return generateChapterNotes(params, retryCount + 1);
    }
    throw error;
  }
}
