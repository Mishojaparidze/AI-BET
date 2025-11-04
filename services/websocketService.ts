import { type LiveMatchPrediction, Momentum } from '../types';

type UpdateCallback = (prediction: LiveMatchPrediction) => void;

// In a real app, this would be a WebSocket connection manager.
// Here, we simulate it with intervals.
// FIX: Changed NodeJS.Timeout to number, as setInterval in the browser returns a number.
const matchUpdaters: Record<number, number> = {};
const listeners: Record<number, UpdateCallback> = {};

/**
 * Simulates connecting to a WebSocket endpoint for a specific match.
 * @param matchId The ID of the match to subscribe to.
 * @param initialPrediction The starting state of the match data.
 * @param onUpdate The callback function to call with updated data.
 */
export const connectToMatch = (
    matchId: number, 
    initialPrediction: LiveMatchPrediction, 
    onUpdate: UpdateCallback
) => {
    console.log(`[WebSocket] Connecting to match ${matchId}...`);
    listeners[matchId] = onUpdate;

    let currentPrediction = { ...initialPrediction };

    // Start a simulation interval for this match
    matchUpdaters[matchId] = setInterval(() => {
        // Simulate a new update from the server
        const newMatchTime = currentPrediction.matchTime + 3;
        let newScoreA = currentPrediction.scoreA;
        let newScoreB = currentPrediction.scoreB;
        let newMomentum = currentPrediction.momentum;
        let newLiveOdds = currentPrediction.liveOdds;
        
        // Simulate a goal scoring event
        if (Math.random() > 0.95 && newMatchTime < 90) {
             if (Math.random() > 0.5) {
                newScoreA++;
                newMomentum = Momentum.TeamA;
                newLiveOdds *= 0.8;
             } else {
                newScoreB++;
                newMomentum = Momentum.TeamB;
                newLiveOdds *= 1.2;
             }
        } else if (Math.random() > 0.8) {
            newMomentum = Momentum.Neutral;
        }

        const shouldRecommendCashOut = newLiveOdds < currentPrediction.odds / 2 && Math.random() > 0.7;

        currentPrediction = {
            ...currentPrediction,
            matchTime: newMatchTime > 90 ? 90 : newMatchTime,
            scoreA: newScoreA,
            scoreB: newScoreB,
            momentum: newMomentum,
            liveOdds: parseFloat(newLiveOdds.toFixed(2)),
            hasValueAlert: newLiveOdds > currentPrediction.odds * 1.5,
            cashOutRecommendation: {
                isRecommended: shouldRecommendCashOut,
                value: shouldRecommendCashOut ? parseFloat((10 * newLiveOdds * 0.9).toFixed(2)) : null,
                reason: shouldRecommendCashOut ? `Odds have dropped significantly. Securing profit is advised.` : null
            }
        };

        // Push the update to the listener
        if (listeners[matchId]) {
            listeners[matchId](currentPrediction);
        }
        
    }, 3000);
};

/**
 * Simulates disconnecting from the WebSocket for a match.
 * @param matchId The ID of the match to unsubscribe from.
 */
export const disconnectFromMatch = (matchId: number) => {
    console.log(`[WebSocket] Disconnecting from match ${matchId}...`);
    if (matchUpdaters[matchId]) {
        clearInterval(matchUpdaters[matchId]);
        delete matchUpdaters[matchId];
    }
    if (listeners[matchId]) {
        delete listeners[matchId];
    }
};
