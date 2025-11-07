import { type LiveMatchPrediction, type MatchPrediction, Momentum } from '../types';

type UpdateCallback = (prediction: MatchPrediction | LiveMatchPrediction) => void;

const listeners: Record<string, UpdateCallback[]> = {};
let matchDataStore: Record<string, MatchPrediction | LiveMatchPrediction> = {};
let intervalId: number | null = null;

const isLiveMatch = (p: MatchPrediction | LiveMatchPrediction): p is LiveMatchPrediction => {
    return 'liveOdds' in p;
};

export const initializeFeed = (initialPredictions: (MatchPrediction | LiveMatchPrediction)[]) => {
    if (intervalId) {
        clearInterval(intervalId);
    }

    matchDataStore = {};
    initialPredictions.forEach(p => {
        matchDataStore[p.id] = p;
    });

    const matchIds = Object.keys(matchDataStore);
    if (matchIds.length === 0) return;

    intervalId = setInterval(() => {
        // Update a few random matches
        for (let i = 0; i < 5; i++) { 
            const randomId = matchIds[Math.floor(Math.random() * matchIds.length)];
            let match = matchDataStore[randomId];
            
            if (!match) continue;

            if (isLiveMatch(match)) {
                const newMatchTime = match.matchTime + 2;
                let newScoreA = match.scoreA;
                let newScoreB = match.scoreB;
                let newMomentum = match.momentum;
                
                if (Math.random() > 0.98 && newMatchTime < 90) {
                     if (Math.random() > 0.5) { newScoreA++; newMomentum = Momentum.TeamA; } else { newScoreB++; newMomentum = Momentum.TeamB; }
                } else if (Math.random() > 0.8) {
                    newMomentum = Momentum.Neutral;
                }

                const liveOddsChange = (Math.random() - 0.45) * 0.15;
                const newLiveOdds = Math.max(1.01, match.liveOdds + liveOddsChange);
                const shouldRecommendCashOut = newLiveOdds < match.odds / 2 && Math.random() > 0.7;

                match = {
                    ...match,
                    matchTime: newMatchTime > 90 ? 90 : newMatchTime,
                    scoreA: newScoreA, scoreB: newScoreB, momentum: newMomentum,
                    liveOdds: parseFloat(newLiveOdds.toFixed(2)),
                    hasValueAlert: newLiveOdds > match.odds * 1.5,
                    cashOutRecommendation: {
                         isRecommended: shouldRecommendCashOut,
                         value: shouldRecommendCashOut ? parseFloat((10 * newLiveOdds * 0.9).toFixed(2)) : null,
                         reason: shouldRecommendCashOut ? `Odds have dropped significantly. Securing profit is advised.` : null
                    }
                };
            } else {
                const oddsChange = (Math.random() - 0.5) * 0.05;
                const newOdds = Math.max(1.01, match.odds + oddsChange);
                match = { ...match, odds: parseFloat(newOdds.toFixed(2)) };
            }

            matchDataStore[randomId] = match;

            if (listeners[randomId]) {
                listeners[randomId].forEach(cb => cb(match));
            }
        }
    }, 2000);
};

export const subscribe = (matchId: string, callback: UpdateCallback) => {
    if (!listeners[matchId]) {
        listeners[matchId] = [];
    }
    listeners[matchId].push(callback);
    
    if (matchDataStore[matchId]) {
        callback(matchDataStore[matchId]);
    }
};

export const unsubscribe = (matchId: string, callback: UpdateCallback) => {
    if (listeners[matchId]) {
        listeners[matchId] = listeners[matchId].filter(cb => cb !== callback);
    }
};
