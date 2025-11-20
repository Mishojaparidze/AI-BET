
import { type LiveMatchPrediction, type MatchPrediction, Momentum } from '../types';

type UpdateCallback = (prediction: MatchPrediction | LiveMatchPrediction) => void;

const listeners: Record<string, UpdateCallback[]> = {};
let matchDataStore: Record<string, MatchPrediction | LiveMatchPrediction> = {};
let intervalId: number | null = null;

const isLiveMatch = (p: MatchPrediction | LiveMatchPrediction): p is LiveMatchPrediction => {
    return 'liveOdds' in p;
};

// Mock commentary database
const commentaryDB: Record<string, string[]> = {
    'Soccer': [
        "Midfield possession changing hands rapidly.",
        "Dangerous cross into the box! Cleared away.",
        "Corner kick awarded. The crowd is on its feet.",
        "Referee waves play on after a tackle.",
        "Shot from distance! Just wide of the post.",
        "Defensive line pushing up to catch them offside.",
        "Great through ball, but the keeper rushes out to collect.",
        "Slow build-up play from the back.",
    ],
    'Basketball': [
        "Driving to the lane... blocked!",
        "Deep 3-pointer... BANG!",
        "Timeout called to stop the momentum.",
        "Fast break opportunity! Dunk!",
        "Foul drawn on the shot. Heading to the line.",
        "Rebound secured by the defense.",
        "Ball movement is crisp on this possession.",
        " turnover! Steal and a layup on the other end.",
    ],
    'Tennis': [
        "Ace down the T!",
        "Long rally from the baseline...",
        "Unforced error into the net.",
        "Great volley at the net!",
        "Break point opportunity.",
        "Serve and volley execution is perfect.",
        "Challenging the call... ball was OUT.",
    ],
    'Default': [
        "Intensity is picking up.",
        "Crowd sensing a shift in momentum.",
        "Key tactical adjustment observed.",
        "Close call there!",
        "Athletes looking tired, substitutions might be incoming.",
    ]
};

const getCommentary = (sport: string, scoreChanged: boolean): string => {
    if (scoreChanged) return "GOAL! The scoreline changes dramatically!";
    
    const phrases = commentaryDB[sport] || commentaryDB['Default'];
    return phrases[Math.floor(Math.random() * phrases.length)];
};


export const initializeFeed = (initialPredictions: (MatchPrediction | LiveMatchPrediction)[]) => {
    if (intervalId) {
        window.clearInterval(intervalId);
    }

    matchDataStore = {};
    initialPredictions.forEach(p => {
        matchDataStore[p.id] = p;
    });

    const matchIds = Object.keys(matchDataStore);
    if (matchIds.length === 0) return;

    intervalId = window.setInterval(() => {
        // Update a few random matches
        for (let i = 0; i < 5; i++) { 
            const randomId = matchIds[Math.floor(Math.random() * matchIds.length)];
            let match = matchDataStore[randomId];
            
            if (!match) continue;

            if (isLiveMatch(match)) {
                const newMatchTime = match.matchTime + 1;
                let newScoreA = match.scoreA;
                let newScoreB = match.scoreB;
                let newMomentum = match.momentum;
                let scoreChanged = false;
                
                // Simulate score change (low probability)
                if (Math.random() > 0.98 && newMatchTime < 90) {
                     if (Math.random() > 0.5) { newScoreA++; newMomentum = Momentum.TeamA; } else { newScoreB++; newMomentum = Momentum.TeamB; }
                     scoreChanged = true;
                } else if (Math.random() > 0.8) {
                    newMomentum = Momentum.Neutral;
                }

                const liveOddsChange = (Math.random() - 0.45) * 0.15;
                const newLiveOdds = Math.max(1.01, match.liveOdds + liveOddsChange);
                const shouldRecommendCashOut = newLiveOdds < match.odds / 2 && Math.random() > 0.7;
                
                // Update commentary every few ticks or on score change
                let newCommentary = match.liveCommentary;
                if (scoreChanged || Math.random() > 0.7) {
                    newCommentary = getCommentary(match.sport, scoreChanged);
                }

                match = {
                    ...match,
                    matchTime: newMatchTime > 90 ? 90 : newMatchTime,
                    scoreA: newScoreA, scoreB: newScoreB, momentum: newMomentum,
                    liveOdds: parseFloat(newLiveOdds.toFixed(2)),
                    hasValueAlert: newLiveOdds > match.odds * 1.5,
                    liveCommentary: newCommentary,
                    cashOutRecommendation: {
                         isRecommended: shouldRecommendCashOut,
                         value: shouldRecommendCashOut ? parseFloat((10 * newLiveOdds * 0.9).toFixed(2)) : null,
                         reason: shouldRecommendCashOut ? `Odds have dropped significantly. Securing profit is advised.` : null
                    }
                };
            } else {
                // Pre-match odds drifting
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
