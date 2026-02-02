
import { GoogleGenAI, Type } from "@google/genai";
import { Profile, AttributeWeights, Hotspot, InsightReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateProfiles = async (count: number): Promise<Profile[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate ${count} diverse and realistic female profile objects. 
    Each profile MUST have: name, ethnicity, ageGroup, bodyType, eyeColor, hairColor, hairType, style, and a short 1-sentence bio.
    Avoid stereotypes. Use high-quality descriptive values.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            ethnicity: { type: Type.STRING },
            ageGroup: { type: Type.STRING },
            bodyType: { type: Type.STRING },
            eyeColor: { type: Type.STRING },
            hairColor: { type: Type.STRING },
            hairType: { type: Type.STRING },
            style: { type: Type.STRING },
            bio: { type: Type.STRING }
          },
          required: ["id", "name", "ethnicity", "ageGroup", "bodyType", "eyeColor", "hairColor", "hairType", "style", "bio"]
        }
      }
    }
  });

  const raw = JSON.parse(response.text || '[]');
  return raw.map((p: any) => ({
    ...p,
    imageUrl: `https://picsum.photos/seed/${p.id}/600/800`
  }));
};

export const getRefiningQuestion = async (weights: AttributeWeights): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as an aesthetic researcher. Analyze these user preference weights: ${JSON.stringify(weights)}. 
    Identify the top 2 correlated attributes (e.g., long hair and tall stature). 
    Generate a short, insightful 'Refining Question' to help the user distinguish between correlation and causation. 
    Example: "I notice you like dark hair, but do you prefer it long or short?" 
    Keep it professional and supportive.`,
  });
  return response.text?.trim() || "What specific detail about your recent likes stands out most to you?";
};

export const getHotspots = async (weights: AttributeWeights): Promise<Hotspot[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on these aesthetic preference weights: ${JSON.stringify(weights)}, 
    recommend 3 real-world global cities or regions where these phenotypes/styles are statistically more common. 
    Return as JSON array.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            city: { type: Type.STRING },
            country: { type: Type.STRING },
            reason: { type: Type.STRING },
            matchScore: { type: Type.NUMBER }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const getInsightReport = async (weights: AttributeWeights): Promise<InsightReport> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a psychological aesthetic profile based on these weights: ${JSON.stringify(weights)}. 
    Explain the underlying patterns in the user's taste.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          dominantTraits: { type: Type.ARRAY, items: { type: Type.STRING } },
          psychologicalProfile: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};
