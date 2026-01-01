import { GoogleGenAI, Type } from "@google/genai";
import { CareerRoadmap, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateRoadmap(profile: UserProfile): Promise<CareerRoadmap> {
  const modelId = "gemini-2.0-flash"; // Using a fast, capable model

  // Prepare resume part
  const parts: any[] = [];
  
  if (profile.resumeBase64 && profile.resumeMimeType) {
    parts.push({
      inlineData: {
        data: profile.resumeBase64,
        mimeType: profile.resumeMimeType,
      },
    });
  }

  const prompt = `
    You are an expert tech career coach with a flair for dramatic, comic-book style storytelling.
    
    User Context:
    - Name: ${profile.name}
    - Target Role: ${profile.targetRole}
    - Location context: ${profile.targetLocation}
    - GitHub: ${profile.githubLink}
    - Portfolio: ${profile.portfolioLink}
    - A core problem they want to solve (Passion): "${profile.passionProblem}"

    Task:
    Analyze the provided resume (if any) and the context above.
    Create a detailed, step-by-step career roadmap to get them to the Target Role.
    
    Specific Requirements:
    1. "Super Weapon Project": Design a unique, high-impact project idea that solves their "Passion" problem using tech relevant to the Target Role. This should be the centerpiece of their portfolio.
    2. "Local Context Tip": Give advice specific to their location (${profile.targetLocation}) regarding the tech scene, hubs, or cultural expectations if known (e.g. if London, mention fintech; if SF, mention AI startups).
    3. "The Villain": Identify the main skill gaps or obstacles they face.
    4. "Phases": Break the journey into 3-4 distinct phases (e.g., Training, Building, Networking, Applying).

    Return ONLY raw JSON complying with the specified schema.
  `;

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: modelId,
    contents: {
      parts: parts
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          heroOrigin: { type: Type.STRING, description: "A punchy summary of where the user is starting from." },
          missionObjective: { type: Type.STRING, description: "A description of what it takes to be the Target Role." },
          theVillain: { type: Type.STRING, description: "The main gaps, weaknesses, or obstacles to overcome." },
          localContextTip: { type: Type.STRING, description: "Specific advice based on their city/region." },
          superWeaponProject: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
              impact: { type: Type.STRING, description: "Why this project matters." }
            }
          },
          phases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Comic book style phase title (e.g. 'The Awakening')" },
                duration: { type: Type.STRING },
                description: { type: Type.STRING },
                actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                skillFocus: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text) as CareerRoadmap;
}
