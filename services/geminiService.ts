
import { GoogleGenAI, Type } from "@google/genai";
import { type MatchPrediction, type LiveMatchPrediction, type UserBet, type BankrollState, type AIAnalysis, RiskLevel, Sentiment, type CoachInsight } from '../types';

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface AnalysisContext {
    predictions: MatchPrediction[];
    liveMatches: LiveMatchPrediction[];
    bankroll: BankrollState | null;
    userBets: UserBet[];
}

/**
 * Formats match data and user state into a rich context string.
 */
const formatContext = (ctx: AnalysisContext): string => {
    let contextString = "CURRENT MARKET DATA:\n";
    
    // 1. Live Matches
    if (ctx.liveMatches.length > 0) {
        contextString += "--- LIVE MATCHES (In-Play) ---\n";
        ctx.liveMatches.forEach(m => {
            contextString += `- ${m.teamA} ${m.scoreA} - ${m.scoreB} ${m.teamB} (${m.matchTime}'). Momentum: ${m.momentum}. Live Odds: ${m.liveOdds}.\n`;
        });
    }

    // 2. Top Upcoming Predictions
    contextString += "\n--- UPCOMING OPPORTUNITIES ---\n";
    ctx.predictions.slice(0, 8).forEach(p => {
        contextString += `- ${p.teamA} vs ${p.teamB}: AI picks "${p.prediction}" @ ${p.odds}. EV: ${p.aiAnalysis.expectedValue}%. Confidence: ${p.confidence}.\n`;
    });

    // 3. User Financial Context (Crucial for personalized advice)
    if (ctx.bankroll) {
        const profit = ctx.bankroll.current - ctx.bankroll.initial;
        contextString += `\n--- USER SITUATION ---\n`;
        contextString += `- Current Balance: $${ctx.bankroll.current.toFixed(2)}\n`;
        contextString += `- Lifetime P/L: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}\n`;
        contextString += `- Daily Wagered: $${ctx.bankroll.dailyWagered.toFixed(2)}\n`;
    }

    // 4. Active Bets
    const activeBets = ctx.userBets.filter(b => b.status === 'pending');
    if (activeBets.length > 0) {
        contextString += `\n--- USER'S ACTIVE BETS ---\n`;
        activeBets.forEach(b => {
            contextString += `- Pending: ${b.match.prediction} ($${b.stake}) @ ${b.odds}\n`;
        });
    }

    return contextString;
};

/**
 * Streams a response from Gemini 2.5 Flash with specific persona and context.
 */
export const streamAiChatResponse = async function* (userPrompt: string, contextData: AnalysisContext) {
  const contextString = formatContext(contextData);
  
  const systemInstruction = `
    You are 'BetGenius', a ruthless, professional Head Oddsmaker and Sports Risk Analyst.
    
    YOUR PERSONA:
    - You operate on math, Expected Value (EV+), and Closing Line Value (CLV).
    - You despise "gut feelings" and "locks". 
    - You speak like a sharp bettor: concise, authoritative, using terms like 'variance', 'unit sizing', 'steam moves', 'public fade'.
    - If the user is losing money, be harsh but constructive about their bankroll management.
    
    DATA CONTEXT:
    ${contextString}
    
    INSTRUCTIONS:
    - Analyze the user's query against the provided market data.
    - If they ask for a pick, justify it with data (form, EV, momentum) from the context.
    - Format output in Markdown. Use **bold** for key numbers and insights.
  `;

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessageStream({ message: userPrompt });

    for await (const chunk of result) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    yield "I'm currently analyzing heavy market volume and cannot process your request. Please check your connection.";
  }
};

/**
 * Generates a "Devil's Advocate" argument.
 */
export const getAiChallengeResponse = async (prediction: MatchPrediction | LiveMatchPrediction): Promise<string> => {
  const prompt = `
    I am considering this bet: ${prediction.teamA} vs ${prediction.teamB} -> ${prediction.prediction} @ ${prediction.odds}.
    
    Act as a skeptic betting syndicate leader. Why is this a TRAP line?
    1. What is the biggest risk?
    2. Why might the odds be bait?
    
    Keep it under 100 words. Be harsh.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: prompt,
      config: {
        temperature: 1, // Higher creativity for the "skeptic" persona
      }
    });
    
    return response.text || "Analysis unavailable.";
  } catch (error) {
    console.error("Gemini Challenge Error:", error);
    return "Unable to generate counter-argument.";
  }
};

/**
 * Performs a Deep Dive AI Analysis for a specific match using JSON Schema.
 */
export const generateMatchInsight = async (match: MatchPrediction): Promise<Partial<AIAnalysis>> => {
    const prompt = `
        Analyze the sports matchup between ${match.teamA} and ${match.teamB} (${match.sport}, ${match.league}).
        The current market line is: ${match.prediction} @ ${match.odds}.
        
        Provide a professional sports betting analysis.
        - Assume the role of a sharp handicapper.
        - Generate realistic, specific reasons based on the teams/players real-world identities.
        - Estimate the win probability and expected value.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        bettingAngle: { type: Type.STRING, description: "The main thesis for the bet." },
                        keyPositives: { type: Type.ARRAY, items: { type: Type.STRING } },
                        keyNegatives: { type: Type.ARRAY, items: { type: Type.STRING } },
                        estimatedWinProbability: { type: Type.NUMBER, description: "Probability between 0 and 1" },
                        expectedValue: { type: Type.NUMBER, description: "EV percentage" },
                        riskLevel: { type: Type.STRING, enum: ["Conservative", "Moderate", "Aggressive"] },
                        confidenceBreakdown: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    model: { type: Type.STRING },
                                    weight: { type: Type.NUMBER },
                                    color: { type: Type.STRING }
                                }
                            }
                        },
                         marketInsights: {
                            type: Type.OBJECT,
                            properties: {
                                sharpMoneyAlignment: { type: Type.BOOLEAN },
                                publicBettingPercentage: { type: Type.NUMBER },
                                significantOddsMovement: { type: Type.BOOLEAN },
                            }
                        },
                        decisionFlow: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    step: { type: Type.STRING },
                                    status: { type: Type.STRING, enum: ["pass", "fail", "neutral"] },
                                    reason: { type: Type.STRING }
                                }
                            }
                        }
                    },
                    required: ["bettingAngle", "keyPositives", "keyNegatives", "estimatedWinProbability", "riskLevel"]
                }
            }
        });

        const jsonText = response.text;
        if (!jsonText) throw new Error("No data returned from AI");
        const data = JSON.parse(jsonText);
        return { ...data, riskLevel: data.riskLevel as RiskLevel };

    } catch (error) {
        console.error("Deep Dive Analysis Failed:", error);
        return {}; 
    }
};

/**
 * Generates a personalized performance review based on user betting history.
 */
export const generatePerformanceReport = async (bets: UserBet[]): Promise<CoachInsight> => {
    const betHistoryString = bets.slice(0, 50).map(b => 
        `${b.match.sport} - ${b.match.marketType}: ${b.status} (Odds: ${b.odds}, Stake: ${b.stake})`
    ).join('\n');

    const prompt = `
        Analyze this user's recent betting history and act as a professional Betting Coach.
        
        HISTORY:
        ${betHistoryString}
        
        Identify:
        1. A summary of their performance style (e.g., "High risk chaser", " disciplined grinder").
        2. Key Strengths (what they are doing right).
        3. Key Weaknesses (leaks in their game).
        4. One concrete, actionable tip to improve ROI immediately.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                        actionableTip: { type: Type.STRING }
                    },
                    required: ["summary", "strengths", "weaknesses", "actionableTip"]
                }
            }
        });
        
        const jsonText = response.text;
        if (!jsonText) throw new Error("AI returned empty analysis");
        return JSON.parse(jsonText) as CoachInsight;

    } catch (error) {
        console.error("Coach Analysis Failed", error);
        return {
            summary: "Insufficient data for a full report.",
            strengths: ["Account active"],
            weaknesses: ["Need more bet history"],
            actionableTip: "Place more bets to unlock AI coaching."
        };
    }
};
