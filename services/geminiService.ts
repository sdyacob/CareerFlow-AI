import { GoogleGenAI, Type } from "@google/genai";
import { Profile, ExperienceLevel } from '../types';

// Helper to initialize AI client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key missing");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const parseResumeText = async (text: string): Promise<Partial<Profile>> => {
  const ai = getAiClient();
  
  const prompt = `
    Analyze the following resume text and extract the candidate's profile information.
    Return the result in strict JSON format.
    
    Resume Text:
    ${text}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING, description: "Full name of the candidate" },
            email: { type: Type.STRING, description: "Email address" },
            skills: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of technical and soft skills found"
            },
            experienceLevel: { 
              type: Type.STRING, 
              enum: ["Junior", "Mid-Level", "Senior", "Lead", "Executive"],
              description: "Estimated experience level based on years and roles"
            },
            summary: { type: Type.STRING, description: "A brief professional summary generated from the resume" }
          },
          required: ["fullName", "skills", "experienceLevel", "summary"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error parsing resume:", error);
    throw error;
  }
};
