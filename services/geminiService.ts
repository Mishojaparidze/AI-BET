import { GoogleGenAI } from "@google/genai";
import { type MatchPrediction } from '../types';

// IMPORTANT: This service assumes that the API_KEY is provided via environment variables.
// In a real-world scenario, this key should be handled securely and never exposed on the client-side.
// For this project, we rely on the execution environment to provide `process.env.API_KEY`.
let ai: GoogleGenAI | null = null;
try {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
} catch (error)
{
  console.error("Failed to initialize GoogleGenAI. API_KEY might be missing.", error);
}


/**
 * Queries the Gemini API with a user prompt and a set of match predictions as context.
 * @param userPrompt The user's question for the AI.
 * @param context A list of match predictions to ground the AI's response.
 * @returns The AI's generated text response.
 */
export const getAiChatResponse = async (userPrompt: string, context: MatchPrediction[]): Promise<string> => {
  if (!ai) {
    return "The AI Analyst is currently unavailable. Please ensure the API key is configured correctly.";
  }

  const model = 'gemini-2.5-flash';
  
  const systemInstruction = `You are BetGenius AI, a world-class sports betting analyst.
- Your knowledge is strictly limited to the JSON data provided below containing sports match predictions. Do not use any external knowledge or make up information.
- Your task is to analyze this data to answer the user's question in a clear, confident, and helpful tone.
- If the user asks a question that cannot be answered by the provided data, politely state that you do not have the information.
- Format your answers using clear headings, lists, and bold text for readability. Do not use Markdown tables.
- Refer to Expected Value as "EV".
- When asked to find matches, list the teams, the AI prediction, the odds, and a brief justification based on the data provided.
- Do not invent new data or predictions.`;

  // OPTIMIZATION: Create a simplified version of the context to reduce token count and improve performance.
  const simplifiedContext = context.map(p => ({
    id: p.id,
    teamA: p.teamA,
    teamB: p.teamB,
    league: p.league,
    prediction: p.prediction,
    odds: p.odds,
    confidence: p.confidence,
    expectedValue: p.aiAnalysis.expectedValue,
  }));

  const stringifiedContext = JSON.stringify(simplifiedContext, null, 2);

  const fullPrompt = `${systemInstruction}

Here is the data for the available matches:
\`\`\`json
${stringifiedContext}
\`\`\`

---

User Question: "${userPrompt}"

Your Analysis:
`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
    });
    
    return response.text;

  } catch (error) {
    console.error("Error fetching response from Gemini API:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       return "The AI Analyst could not be reached. The provided API key is invalid. Please check your configuration.";
    }
    return "Sorry, I encountered an error while analyzing the data. Please try again later.";
  }
};