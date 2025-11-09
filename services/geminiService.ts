import { type MatchPrediction, type LiveMatchPrediction } from '../types';
import { API_BASE_URL } from './config';

/**
 * A helper function to securely POST data to the application's backend.
 * This abstracts away the direct fetch call and standardizes error handling.
 * @param endpoint The API endpoint to call (e.g., '/ai/chat').
 * @param body The JSON payload to send.
 * @returns The JSON response from the backend.
 */
const postToApi = async <T>(endpoint: string, body: object): Promise<T> => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            // Try to parse a structured error message from the backend, otherwise fall back.
            const errorData = await response.json().catch(() => ({ message: 'An unknown API error occurred.' }));
            throw new Error(errorData.message || `API request failed: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`[API Error] Failed to POST to ${endpoint}:`, error);
        // Re-throw the error to be handled by the calling function's catch block.
        throw error;
    }
};

/**
 * Queries the backend service to get a response from the Gemini API.
 * The backend is responsible for securely managing the API key and context.
 * @param userPrompt The user's question for the AI.
 * @param context A list of match predictions to ground the AI's response.
 * @returns The AI's generated text response.
 */
export const getAiChatResponse = async (userPrompt: string, context: MatchPrediction[]): Promise<string> => {
  // OPTIMIZATION: Create a simplified version of the context to reduce payload size.
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

  try {
    const response = await postToApi<{text: string}>('/ai/chat', {
        prompt: userPrompt,
        context: simplifiedContext,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching chat response from backend:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       return "The AI Analyst could not be reached. The provided API key is invalid. Please check your configuration.";
    }
    return "Sorry, I encountered an error while analyzing the data. Please try again later.";
  }
};

/**
 * Queries the backend service to generate a critical counter-argument for a given prediction.
 * @param prediction The match prediction to be challenged.
 * @returns The AI's generated counter-argument as a text response.
 */
export const getAiChallengeResponse = async (prediction: MatchPrediction | LiveMatchPrediction): Promise<string> => {
  // Create a detailed context from the prediction object to send to the backend.
  const context = {
    match: `${prediction.teamA} vs ${prediction.teamB}`,
    league: prediction.league,
    originalPrediction: prediction.prediction,
    odds: prediction.odds,
    confidence: prediction.confidence,
    reasoning: prediction.reasoning,
    analysis: prediction.aiAnalysis
  };

  try {
    const response = await postToApi<{text: string}>('/ai/challenge', {
        prediction: context,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching challenge response from backend:", error);
     if (error instanceof Error && error.message.includes('API key not valid')) {
       return "The AI Analyst could not be reached. The provided API key is invalid. Please check your configuration.";
    }
    return "Sorry, I encountered an error while generating a counter-argument. Please try again later.";
  }
};