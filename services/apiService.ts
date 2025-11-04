import { type MatchPrediction, type LiveMatchPrediction, ConfidenceTier, Momentum, type BankrollState, RiskLevel, type AIDecisionFlowStep, type UserBet, type TicketSelection, type TicketVariation } from '../types';

// In a real application, this state would live on a server database.
let bankrollDB: BankrollState = {
    initial: 1000,
    current: 1000,
    totalWagered: 0,
    totalReturned: 0,
};

let userBetsDB: UserBet[] = [];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date(today);
dayAfter.setDate(dayAfter.getDate() + 2);
const threeDaysOut = new Date(today);
threeDaysOut.setDate(threeDaysOut.getDate() + 3);
const fourDaysOut = new Date(today);
fourDaysOut.setDate(fourDaysOut.getDate() + 4);
const fiveDaysOut = new Date(today);
fiveDaysOut.setDate(fiveDaysOut.getDate() + 5);
const sixDaysOut = new Date(today);
sixDaysOut.setDate(sixDaysOut.getDate() + 6);


const formatDate = (date: Date) => date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// NEW MOCK DATA: Inspired by Flashscore.com for more realism and variety.
// The first two entries are used for the "Live" simulation.
const mockPredictions: MatchPrediction[] = [
    { 
        teamA: "Manchester United", 
        teamB: "Liverpool", 
        league: "Premier League", 
        matchDate: formatDate(today),
        prediction: "Over 2.5 Goals", 
        confidence: ConfidenceTier.High, 
        odds: 1.72, 
        reasoning: "Both teams have high offensive outputs and recent matches have consistently seen high scores.",
        aiAnalysis: {
            keyPositives: ["High xG (Expected Goals) for both teams", "Key offensive players in form", "H2H history favors goals", "Liverpool's high defensive line"],
            keyNegatives: ["Man United's inconsistent home form", "Potential for key midfielder injury for Liverpool"],
            confidenceBreakdown: [
                { model: 'XGBoost', weight: 45, color: 'bg-green-500'},
                { model: 'LSTM Network', weight: 30, color: 'bg-sky-500'},
                { model: 'Graph Network', weight: 15, color: 'bg-purple-500'},
                { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500'},
            ],
            expectedValue: 15.5, // %
            kellyStakePercentage: 4.2,
            marketInsights: {
                sharpMoneyAlignment: true,
                publicBettingPercentage: 78,
                significantOddsMovement: false,
            },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'All player and team stats are recent.' },
                { step: 'Model Agreement', status: 'pass', reason: 'All 4 models show high consensus.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'Calculated EV is 15.5%, exceeding threshold.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ]
        }
    },
    { 
        teamA: "Carlos Alcaraz", 
        teamB: "Jannik Sinner", 
        league: "ATP Miami - Final", 
        matchDate: formatDate(today),
        prediction: "Alcaraz to Win", 
        confidence: ConfidenceTier.Medium, 
        odds: 1.90, 
        reasoning: "Alcaraz's superior court coverage and recent form on hard courts give him a slight edge in this matchup.",
        aiAnalysis: {
            keyPositives: ["Excellent return of serve stats", "Higher win percentage in long rallies", "Proven performance in finals", "Better H2H on hard courts"],
            keyNegatives: ["Sinner's powerful groundstrokes", "Alcaraz prone to unforced errors under pressure", "High public betting on Alcaraz"],
            confidenceBreakdown: [
                { model: 'XGBoost', weight: 35, color: 'bg-green-500'},
                { model: 'LSTM Network', weight: 30, color: 'bg-sky-500'},
                { model: 'Graph Network', weight: 25, color: 'bg-purple-500'},
                { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500'},
            ],
            expectedValue: 7.8, // %
            kellyStakePercentage: 2.3,
            marketInsights: {
                sharpMoneyAlignment: false,
                publicBettingPercentage: 65,
                significantOddsMovement: true,
            },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'Full player stats available.' },
                { step: 'Model Agreement', status: 'neutral', reason: 'Bayesian Net shows wider probability distribution.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 7.8%, exceeding threshold.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ]
        }
    },
    { 
        teamA: "Real Madrid", 
        teamB: "FC Barcelona", 
        league: "La Liga", 
        matchDate: formatDate(tomorrow),
        prediction: "Both Teams to Score", 
        confidence: ConfidenceTier.High, 
        odds: 1.66, 
        reasoning: "El Clásico is famously an open, attacking game. Both teams are in top scoring form and rarely keep clean sheets against each other.",
        aiAnalysis: {
            keyPositives: ["Both teams average >2.0 goals per game", "9 of last 10 H2H saw both score", "Key strikers available for both", "Attacking tactical styles"],
            keyNegatives: ["Potential for a cautious, tactical first half", "Real Madrid's strong home defense record this season"],
            confidenceBreakdown: [
                { model: 'XGBoost', weight: 50, color: 'bg-green-500'}, { model: 'LSTM Network', weight: 25, color: 'bg-sky-500'}, { model: 'Graph Network', weight: 15, color: 'bg-purple-500'}, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500'},
            ],
            expectedValue: 13.2,
            kellyStakePercentage: 3.9,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 85, significantOddsMovement: false },
            riskLevel: RiskLevel.Conservative,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'All data points fresh.' },
                { step: 'Model Agreement', status: 'pass', reason: 'High consensus across all models.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 13.2%, exceeding threshold.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ]
        }
    },
    { 
        teamA: "Boston Celtics", 
        teamB: "Milwaukee Bucks", 
        league: "NBA", 
        matchDate: formatDate(tomorrow),
        prediction: "Celtics -5.5", 
        confidence: ConfidenceTier.High, 
        odds: 1.91, 
        reasoning: "Boston's top-ranked defensive efficiency and home-court advantage are significant factors against a Bucks team on a road trip.",
        aiAnalysis: {
            keyPositives: ["#1 Defensive Rating in NBA", "Strong home record (25-3)", "Key player health advantage", "Bucks struggle against elite perimeter defense"],
            keyNegatives: ["Giannis's ability to dominate paint", "Bucks' potent 3-point shooting"],
            confidenceBreakdown: [
                { model: 'XGBoost', weight: 40, color: 'bg-green-500'}, { model: 'LSTM Network', weight: 30, color: 'bg-sky-500'}, { model: 'Graph Network', weight: 20, color: 'bg-purple-500'}, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500'},
            ],
            expectedValue: 10.5,
            kellyStakePercentage: 3.1,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 72, significantOddsMovement: false },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'All data points available.' },
                { step: 'Model Agreement', status: 'pass', reason: 'All models favor Celtics covering the spread.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 10.5%, exceeding threshold.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ]
        }
    },
    { 
        teamA: "Inter", 
        teamB: "AC Milan", 
        league: "Serie A", 
        matchDate: formatDate(dayAfter),
        prediction: "Inter Moneyline", 
        confidence: ConfidenceTier.Medium, 
        odds: 2.05, 
        reasoning: "Inter's dominant league form and tactical discipline under Inzaghi gives them the edge over a less consistent AC Milan.",
        aiAnalysis: {
            keyPositives: ["League-best defensive record", "Top scorer in excellent form", "Recent H2H dominance", "Tactical flexibility"],
            keyNegatives: ["AC Milan's strong counter-attack", "Derby matches are often unpredictable"],
            confidenceBreakdown: [
                { model: 'XGBoost', weight: 40, color: 'bg-green-500'}, { model: 'LSTM Network', weight: 25, color: 'bg-sky-500'}, { model: 'Graph Network', weight: 25, color: 'bg-purple-500'}, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500'},
            ],
            expectedValue: 9.1,
            kellyStakePercentage: 2.5,
            marketInsights: { sharpMoneyAlignment: false, publicBettingPercentage: 60, significantOddsMovement: false },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'All API data points available.' },
                { step: 'Model Agreement', status: 'pass', reason: 'Consensus on Inter win probability.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 9.1%, exceeding threshold.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ]
        }
    },
    { 
        teamA: "Golden State Warriors", 
        teamB: "Los Angeles Lakers", 
        league: "NBA", 
        matchDate: formatDate(dayAfter),
        prediction: "Over 235.5 Points", 
        confidence: ConfidenceTier.High, 
        odds: 1.88, 
        reasoning: "Both teams play at a high pace and possess elite offensive talent, with defenses that have been susceptible to high scores.",
        aiAnalysis: {
            keyPositives: ["Both teams in Top 10 for Pace", "Multiple elite scorers on both sides", "Recent H2H games have been high-scoring", "Weak transition defense for both"],
            keyNegatives: ["Potential for key players to rest", "Game could be a defensive focus due to playoff implications"],
            confidenceBreakdown: [
                { model: 'XGBoost', weight: 40, color: 'bg-green-500'}, { model: 'LSTM Network', weight: 25, color: 'bg-sky-500'}, { model: 'Graph Network', weight: 20, color: 'bg-purple-500'}, { model: 'Bayesian Net', weight: 15, color: 'bg-amber-500'},
            ],
            expectedValue: 12.8,
            kellyStakePercentage: 3.6,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 68, significantOddsMovement: false },
            riskLevel: RiskLevel.Conservative,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'All statistical categories are populated.' },
                { step: 'Model Agreement', status: 'pass', reason: 'High consensus.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 12.8%, exceeding threshold.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ]
        }
    },
    {
        teamA: "Colorado Avalanche",
        teamB: "Edmonton Oilers",
        league: "NHL",
        matchDate: formatDate(threeDaysOut),
        prediction: "Over 6.5 Goals",
        confidence: ConfidenceTier.High,
        odds: 1.85,
        reasoning: "Two of the league's most potent offenses, led by MacKinnon and McDavid, often result in high-scoring affairs.",
        aiAnalysis: {
            keyPositives: ["Both teams Top 5 in Goals For/Game", "Elite Power Play units (>25%)", "Superstar offensive talent", "Recent H2H games averaged 7.2 goals"],
            keyNegatives: ["Goaltending can be inconsistent for both", "Potential for tighter defensive play in a key matchup"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 50, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 25, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 15, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 11.2,
            kellyStakePercentage: 3.5,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 80, significantOddsMovement: false },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'Complete player and team data available.' },
                { step: 'Model Agreement', status: 'pass', reason: 'High consensus on a high-scoring game.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 11.2%, good value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ]
        }
    },
    {
        teamA: "Kansas City Chiefs",
        teamB: "Baltimore Ravens",
        league: "NFL",
        matchDate: formatDate(fourDaysOut),
        prediction: "Chiefs -3.5",
        confidence: ConfidenceTier.Medium,
        odds: 1.91,
        reasoning: "Mahomes' playoff experience and the Chiefs' offensive firepower are expected to overcome the Ravens' formidable defense in a tight contest.",
        aiAnalysis: {
            keyPositives: ["Patrick Mahomes' elite QB play", "Strong offensive line performance", "Experience in high-stakes games", "Good record against top defenses"],
            keyNegatives: ["Ravens' #1 ranked defense", "Lamar Jackson's dual-threat ability", "Chiefs' occasional turnover issues"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 35, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 30, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 25, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 6.8,
            kellyStakePercentage: 2.1,
            marketInsights: { sharpMoneyAlignment: false, publicBettingPercentage: 55, significantOddsMovement: true },
            riskLevel: RiskLevel.Aggressive,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'Full team and player stats used.' },
                { step: 'Model Agreement', status: 'neutral', reason: 'Models show slight edge to Chiefs, but with variance.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 6.8%, exceeds threshold.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ]
        }
    },
    {
        teamA: "Gen.G",
        teamB: "T1",
        league: "LCK Finals (Esports)",
        matchDate: formatDate(fourDaysOut),
        prediction: "Gen.G to Win",
        confidence: ConfidenceTier.High,
        odds: 1.65,
        reasoning: "Gen.G's consistent macro play and superior dragon control have been key to their recent dominance in the LCK.",
        aiAnalysis: {
            keyPositives: ["Higher First Dragon % (75%)", "Better Baron control rate", "Stronger early game gold differential", "Wider champion pool for mid-laner"],
            keyNegatives: ["T1's proven clutch performance in finals", "Faker's unpredictable champion picks"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 55, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 20, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 15, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 14.5,
            kellyStakePercentage: 4.1,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 65, significantOddsMovement: false },
            riskLevel: RiskLevel.Conservative,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'All game data from current split analyzed.' },
                { step: 'Model Agreement', status: 'pass', reason: 'Strong consensus for Gen.G.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 14.5%, excellent value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ]
        }
    },
    {
        teamA: "Charles Leclerc",
        teamB: "Italian GP",
        league: "Formula 1",
        matchDate: formatDate(fiveDaysOut),
        prediction: "Leclerc Pole Position",
        confidence: ConfidenceTier.Medium,
        odds: 3.50,
        reasoning: "The Ferrari power unit is historically strong at Monza, and Leclerc has a proven track record of excellent qualifying laps here.",
        aiAnalysis: {
            keyPositives: ["Car's high straight-line speed", "Driver's excellent qualifying record at Monza", "Team's home track advantage", "Strong performance in recent high-speed circuits"],
            keyNegatives: ["High competition from Red Bull", "Reliability concerns under pressure", "Weather unpredictability"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 40, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 25, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 20, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 15, color: 'bg-amber-500' }],
            expectedValue: 18.2,
            kellyStakePercentage: 2.8,
            marketInsights: { sharpMoneyAlignment: false, publicBettingPercentage: 40, significantOddsMovement: false },
            riskLevel: RiskLevel.Aggressive,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'All telemetry and historical data processed.' },
                { step: 'Model Agreement', status: 'pass', reason: 'Models agree on high probability.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 18.2% due to high odds.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ]
        }
    },
    {
        teamA: "Bayern Munich",
        teamB: "Borussia Dortmund",
        league: "Bundesliga",
        matchDate: formatDate(fiveDaysOut),
        prediction: "Bayern Munich -1.5",
        confidence: ConfidenceTier.High,
        odds: 2.10,
        reasoning: "Bayern's overwhelming home record against Dortmund and their clinical finishing are likely to result in a multi-goal victory.",
        aiAnalysis: {
            keyPositives: ["Won last 8 home games vs Dortmund", "Highest xG in the league", "Harry Kane's elite form", "Dortmund's defensive frailties on the road"],
            keyNegatives: ["'Der Klassiker' can be unpredictable", "Dortmund's potent counter-attack"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 60, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 20, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 10, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 16.1,
            kellyStakePercentage: 4.5,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 70, significantOddsMovement: false },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'Complete H2H and current form data.' },
                { step: 'Model Agreement', status: 'pass', reason: 'Very strong consensus for a comfortable Bayern win.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 16.1%, high value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ]
        }
    },
    {
        teamA: "Islam Makhachev",
        teamB: "Arman Tsarukyan",
        league: "UFC",
        matchDate: formatDate(sixDaysOut),
        prediction: "Makhachev by Submission",
        confidence: ConfidenceTier.Medium,
        odds: 2.75,
        reasoning: "Makhachev's elite grappling and suffocating top control are likely to overwhelm Tsarukyan, leading to a submission victory.",
        aiAnalysis: {
            keyPositives: ["Superior takedown accuracy (65%)", "High submission attempts per 15 mins", "Excellent positional control on the ground", "Proven 5-round cardio"],
            keyNegatives: ["Tsarukyan's own strong wrestling background", "Tsarukyan's improved striking", "Risk of a decision if Tsarukyan can defend takedowns"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 45, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 25, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 20, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 22.5,
            kellyStakePercentage: 3.3,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 58, significantOddsMovement: false },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'Full fight history and stats for both fighters.' },
                { step: 'Model Agreement', status: 'pass', reason: 'Models agree on submission as most likely win method.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 22.5% due to favorable odds on method of victory.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ]
        }
    }
];


/**
 * Simulates fetching all the initial data the app needs.
 */
export const fetchInitialData = async (): Promise<{
    predictions: MatchPrediction[];
    liveMatches: LiveMatchPrediction[];
    bankroll: BankrollState;
    userBets: UserBet[];
}> => {
    console.log("API: Fetching initial data...");
    await new Promise(res => setTimeout(res, 1200)); // Simulate network latency

    const preMatch = mockPredictions.slice(2);
    const liveMatches = mockPredictions.slice(0, 2).map((p, index) => ({
        ...p,
        id: index,
        scoreA: index === 0 ? 1 : 0, // Man U 1-0 Liverpool
        scoreB: 0,
        matchTime: index === 0 ? 48 : 25, // Soccer match time vs Tennis game time (simulated)
        momentum: index === 0 ? Momentum.TeamA : Momentum.Neutral,
        liveOdds: p.odds * (index === 0 ? 0.9 : 1.1), // Odds adjust based on score
        cashOutRecommendation: { isRecommended: false, value: null, reason: null },
        hasValueAlert: false,
    }));

    return {
        predictions: preMatch,
        liveMatches: liveMatches,
        bankroll: { ...bankrollDB },
        userBets: [...userBetsDB],
    };
};

/**
 * Simulates placing a bet and adding it to the user's history.
 */
export const placeBet = async (prediction: MatchPrediction, stake: number, selections?: MatchPrediction[]): Promise<{ updatedBankroll: BankrollState, newBet: UserBet }> => {
    console.log(`API: Placing bet of $${stake} on ${prediction.prediction}`);
    await new Promise(res => setTimeout(res, 500)); 

    bankrollDB.current -= stake;
    bankrollDB.totalWagered += stake;

    const newBet: UserBet = {
        id: crypto.randomUUID(),
        match: prediction,
        stake,
        odds: prediction.odds,
        status: 'pending',
        payout: null,
        placedAt: new Date(),
        selections: selections
    };

    userBetsDB.unshift(newBet);
    
    return { updatedBankroll: { ...bankrollDB }, newBet };
};

/**
 * Simulates a bet settling after a match is "finished".
 */
export const settleBet = async (betId: string): Promise<{ updatedBankroll: BankrollState, settledBet: UserBet }> => {
    console.log(`API: Settling bet ${betId}`);
    await new Promise(res => setTimeout(res, 400)); // Simulate latency

    const betIndex = userBetsDB.findIndex(b => b.id === betId);
    if (betIndex === -1) {
        throw new Error("Bet not found to settle");
    }

    const bet = userBetsDB[betIndex];
    const isWin = Math.random() < 0.58; // Simulate a 58% win rate for the AI

    let settledBet: UserBet;

    if (isWin) {
        const winnings = bet.stake * bet.odds;
        bankrollDB.current += winnings;
        bankrollDB.totalReturned += winnings;
        settledBet = { ...bet, status: 'won', payout: winnings };
        console.log(`API: Bet won! Returned $${winnings}`);
    } else {
        settledBet = { ...bet, status: 'lost', payout: 0 };
        console.log("API: Bet lost.");
    }
    
    userBetsDB[betIndex] = settledBet;
    return { updatedBankroll: { ...bankrollDB }, settledBet };
};

/**
 * Simulates updating the initial bankroll and clearing bet history.
 */
export const updateInitialBankroll = async (newInitial: number): Promise<{ updatedBankroll: BankrollState, clearedBets: UserBet[] }> => {
    console.log(`API: Setting new initial bankroll to $${newInitial}`);
    await new Promise(res => setTimeout(res, 300));

    bankrollDB = {
        initial: newInitial,
        current: newInitial,
        totalWagered: 0,
        totalReturned: 0,
    };
    userBetsDB = []; // Clear history on bankroll reset

    return { updatedBankroll: { ...bankrollDB }, clearedBets: [] };
};

/**
 * Simulates the AI ticket generation engine.
 */
export const generateTickets = async (selections: TicketSelection[], totalStake: number, riskProfile: 'Conservative' | 'Balanced' | 'Aggressive'): Promise<TicketVariation[]> => {
    console.log(`API: Generating tickets for ${selections.length} selections with $${totalStake} stake and ${riskProfile} profile.`);
    await new Promise(res => setTimeout(res, 1500)); // Simulate AI thinking

    if (selections.length === 0) return [];
    
    const variations: TicketVariation[] = [];
    const totalEV = selections.reduce((acc, s) => acc + s.aiAnalysis.expectedValue, 0) / selections.length;

    // 1. Conservative Strategy: Singles
    if (riskProfile === 'Conservative' && selections.length > 1) {
        const stakePerBet = totalStake / selections.length;
        variations.push({
            title: 'Conservative Singles',
            description: 'Spreads risk by placing an equal stake on each individual prediction.',
            bets: selections.map(s => ({ prediction: s, stake: stakePerBet })),
            totalStake: totalStake,
            potentialReturn: selections.reduce((acc, s) => acc + (s.odds * stakePerBet), 0),
            winProbability: 65, // Higher chance to win at least something
            totalEV: totalEV,
        });
    }

    // 2. Balanced Strategy: Main + Small Parlay
    if (riskProfile === 'Balanced' && selections.length > 1) {
        const sortedSelections = [...selections].sort((a, b) => b.confidence === 'High' ? 1 : -1);
        const mainBet = sortedSelections[0];
        const parlayBets = sortedSelections.slice(0, 2);
        const parlayOdds = parlayBets.reduce((acc, s) => acc * s.odds, 1);
        
        variations.push({
            title: 'Balanced Approach',
            description: 'Focuses stake on the highest confidence pick, with a smaller 2-leg parlay for upside.',
            bets: [
                { prediction: mainBet, stake: totalStake * 0.7 },
                { prediction: { ...parlayBets[0], prediction: `${parlayBets.length}-Leg Parlay`, odds: parlayOdds, teamA: 'Parlay', teamB: 'Ticket' }, stake: totalStake * 0.3 }
            ],
            totalStake: totalStake,
            potentialReturn: (mainBet.odds * totalStake * 0.7) + (parlayOdds * totalStake * 0.3),
            winProbability: 50,
            totalEV: totalEV,
        });
    }
    
    // 3. Aggressive Strategy: Full Parlay
    const parlayOdds = selections.reduce((acc, s) => acc * s.odds, 1);
    variations.push({
        title: `${selections.length}-Leg Parlay`,
        description: 'Combines all selections into a single high-risk, high-reward bet.',
        bets: [{ prediction: { ...selections[0], prediction: `${selections.length}-Leg Parlay`, odds: parlayOdds, teamA: 'Parlay', teamB: 'Ticket' }, stake: totalStake }],
        totalStake: totalStake,
        potentialReturn: totalStake * parlayOdds,
        winProbability: 25, // Lower chance but higher payout
        totalEV: (Math.pow(1 + (totalEV/100), selections.length) -1) * 100, // Compound EV
    });

    return variations;
};