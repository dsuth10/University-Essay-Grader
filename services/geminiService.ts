import { GoogleGenAI, Type } from "@google/genai";
import { GradingResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const gradeEssay = async (essayText: string, assignmentPrompt?: string): Promise<GradingResult> => {
  const model = "gemini-3-pro-preview"; // Using Pro for complex reasoning required in university grading

  const userPrompt = `
    Please grade the following university-level essay. 
    ${assignmentPrompt ? `The assignment prompt was: "${assignmentPrompt}"` : ""}
    
    Essay Content:
    "${essayText}"
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: userPrompt,
    config: {
      systemInstruction: `You are a strict, tenured university professor known for providing constructive but rigorous feedback. 
      Analyze the essay based on academic standards including: Argument/Thesis, Evidence/Analysis, Structure/Flow, Style/Tone, and Grammar/Mechanics.
      
      Additionally, perform a deep-dive analysis of the writing style and tone, specifically evaluating:
      1. Sentence Structure Variety (rhythm, complexity, length variation)
      2. Word Choice (precision, academic vocabulary, avoidance of repetition)
      3. Formality (academic distance, objectivity, appropriate register)
      4. Clarity & Conciseness (avoidance of wordiness, clear expression of ideas)
      
      Return the result in strictly structured JSON format.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.INTEGER, description: "Score out of 100" },
          letterGrade: { type: Type.STRING, description: "University letter grade (A, A-, B+, etc.)" },
          summary: { type: Type.STRING, description: "A paragraph summarizing the overall impression." },
          criteria: {
            type: Type.ARRAY,
            description: "Breakdown of scores by category",
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "e.g., 'Argument & Thesis', 'Structure'" },
                score: { type: Type.INTEGER, description: "Score out of 100 for this specific criterion" },
                feedback: { type: Type.STRING, description: "Specific feedback for this criterion" },
              },
              required: ["name", "score", "feedback"]
            }
          },
          styleAnalysis: {
            type: Type.OBJECT,
            description: "Detailed analysis of writing style and tone",
            properties: {
              tone: { type: Type.STRING, description: "One or two words describing the overall tone (e.g., 'Formal & Academic', 'Casual', 'Persuasive')" },
              metrics: {
                type: Type.ARRAY,
                description: "Assessments of specific style factors",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING, description: "e.g., 'Sentence Variety', 'Word Choice', 'Formality', 'Clarity'" },
                    rating: { type: Type.STRING, description: "Qualitative rating: 'Excellent', 'Good', 'Fair', 'Poor'" },
                    feedback: { type: Type.STRING, description: "Specific analysis for this category" }
                  },
                  required: ["category", "rating", "feedback"]
                }
              },
              suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Specific tips to improve style and tone"
              }
            },
            required: ["tone", "metrics", "suggestions"]
          },
          strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 3-5 specific strengths"
          },
          improvements: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 3-5 specific actionable improvements"
          }
        },
        required: ["overallScore", "letterGrade", "summary", "criteria", "styleAnalysis", "strengths", "improvements"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(text) as GradingResult;
};
