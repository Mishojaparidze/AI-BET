import { type MatchPrediction, type LiveMatchPrediction, ConfidenceTier, Momentum, type BankrollState, RiskLevel, type AIDecisionFlowStep, type UserBet, type TicketSelection, type TicketVariation, Sentiment, DataSourceStatus, type UserSettings, type HeadToHeadFixture, type OddsHistoryPoint } from '../types';
import { API_BASE_URL } from './config';

// --- MOCK SERVICE IMPLEMENTATION (Encapsulates all original logic for fallback) ---
const createMockService = () => {
    let bankrollDB: BankrollState = {
        initial: 1000,
        current: 1000,
        totalWagered: 0,
        totalReturned: 0,
        dailyWagered: 0,
    };
    let userSettingsDB: UserSettings = { maxStakePerBet: 500, maxDailyStake: 2000 };
    let userBetsDB: UserBet[] = [];

    // --- Statistical Engine (from original file) ---
    interface HistoricalMatch { date: Date; homeTeam: string; awayTeam: string; homeGoals: number; awayGoals: number; result: 'HOME' | 'AWAY' | 'DRAW'; }
    const generateHistoricalData = (teams: string[], numMatches: number): HistoricalMatch[] => {
      const matches: HistoricalMatch[] = [];
      for (let i = 0; i < numMatches; i++) {
        const homeTeam = teams[Math.floor(Math.random() * teams.length)];
        let awayTeam = teams[Math.floor(Math.random() * teams.length)];
        while (awayTeam === homeTeam) awayTeam = teams[Math.floor(Math.random() * teams.length)];
        const homeGoals = Math.floor(Math.random() * 4);
        const awayGoals = Math.floor(Math.random() * 4);
        matches.push({ date: new Date(Date.now() - (numMatches - i) * 3 * 24 * 60 * 60 * 1000), homeTeam, awayTeam, homeGoals, awayGoals, result: homeGoals > awayGoals ? 'HOME' : awayGoals > homeGoals ? 'AWAY' : 'DRAW'});
      }
      return matches;
    };
    const calculateEWMA = (results: number[], decay = 0.95): number => {
      let ewma = 0, weight = 1, totalWeight = 0;
      for (let i = results.length - 1; i >= 0; i--) { ewma += results[i] * weight; totalWeight += weight; weight *= decay; }
      return totalWeight > 0 ? ewma / totalWeight : 0;
    };
    const calculateTeamStats = (matches: HistoricalMatch[], teamName: string) => {
      const teamMatches = matches.filter(m => m.homeTeam === teamName || m.awayTeam === teamName).slice(-10);
      let wins = 0, draws = 0, losses = 0, goalsScored = 0, goalsConceded = 0, cleanSheets = 0;
      const recentFormPoints: number[] = [], recentFormString: string[] = [];
      teamMatches.forEach(match => {
        const isHome = match.homeTeam === teamName;
        const scored = isHome ? match.homeGoals : match.awayGoals;
        const conceded = isHome ? match.awayGoals : match.homeGoals;
        if (conceded === 0) cleanSheets++;
        goalsScored += scored;
        goalsConceded += conceded;
        if (match.result === (isHome ? 'HOME' : 'AWAY')) { wins++; recentFormPoints.push(3); recentFormString.push('W'); }
        else if (match.result === 'DRAW') { draws++; recentFormPoints.push(1); recentFormString.push('D'); }
        else { losses++; recentFormPoints.push(0); recentFormString.push('L'); }
      });
      const totalMatches = teamMatches.length;
      return { wins, draws, losses, avgGoalsScored: totalMatches > 0 ? goalsScored / totalMatches : 0, avgGoalsConceded: totalMatches > 0 ? goalsConceded / totalMatches : 0, formEWMA: calculateEWMA(recentFormPoints), points: wins * 3 + draws, formString: recentFormString.slice(-5).join(''), winRate: totalMatches > 0 ? wins / totalMatches : 0, cleanSheetRate: totalMatches > 0 ? cleanSheets / totalMatches : 0, recentPoints: recentFormPoints.slice(-5).reduce((a, b) => a + b, 0)};
    };
    const calculateH2H = (matches: HistoricalMatch[], team1: string, team2: string) => {
      const h2hMatches = matches.filter(m => (m.homeTeam === team1 && m.awayTeam === team2) || (m.homeTeam === team2 && m.awayTeam === team1)).slice(-5);
      let team1Wins = 0;
      h2hMatches.forEach(match => { if ((match.homeTeam === team1 && match.result === 'HOME') || (match.awayTeam === team1 && match.result === 'AWAY')) team1Wins++; });
      return { matches: h2hMatches.length, team1WinRate: h2hMatches.length > 0 ? team1Wins / h2hMatches.length : 0 };
    };
    const predictMatch = (homeTeam: string, awayTeam: string, matches: HistoricalMatch[]) => {
      const homeStats = calculateTeamStats(matches, homeTeam);
      const awayStats = calculateTeamStats(matches, awayTeam);
      const h2h = calculateH2H(matches, homeTeam, awayTeam);
      const W = { FORM: 0.25, GOALS_S: 0.2, GOALS_C: 0.15, WIN_R: 0.15, CLEAN_S: 0.05, RECENT_P: 0.1, H2H: 0.1 };
      const HOME_ADV = 0.1;
      const homeScore = (homeStats.formEWMA * W.FORM) + (homeStats.avgGoalsScored * W.GOALS_S) - (homeStats.avgGoalsConceded * W.GOALS_C) + (homeStats.winRate * W.WIN_R) + (homeStats.cleanSheetRate * W.CLEAN_S) + ((homeStats.recentPoints / 15) * W.RECENT_P) + (h2h.team1WinRate * W.H2H) + HOME_ADV;
      const awayScore = (awayStats.formEWMA * W.FORM) + (awayStats.avgGoalsScored * W.GOALS_S) - (awayStats.avgGoalsConceded * W.GOALS_C) + (awayStats.winRate * W.WIN_R) + (awayStats.cleanSheetRate * W.CLEAN_S) + ((awayStats.recentPoints / 15) * W.RECENT_P) + ((1 - h2h.team1WinRate) * W.H2H);
      const drawFactor = 0.3 - (Math.abs(homeScore - awayScore) * 0.1);
      const total = Math.max(0.01, homeScore) + Math.max(0.01, awayScore) + Math.max(0.05, drawFactor);
      const homeP = Math.max(0.01, homeScore) / total, awayP = Math.max(0.01, awayScore) / total, drawP = Math.max(0.05, drawFactor) / total;
      const sum = homeP + drawP + awayP;
      return { homeProbability: homeP / sum, drawProbability: drawP / sum, awayProbability: awayP / sum, homeStats, awayStats };
    };
    const calculateEV = (p: number, o: number) => (p * (o - 1)) - (1 - p);
    const calculateKellyStake = (p: number, o: number, f = 0.25) => { if (o <= 1) return 0; const k = ( (o-1) * p - (1-p) ) / (o-1); return Math.min(Math.max(0, k * f) * 100, 10); };
    
    // --- Data Generation (from original file) ---
    const teamData: Record<string, { name: string; id: number; league: string; }[]> = { "Soccer": [ { name: 'Arsenal', id: 42, league: 'Premier League' }, { name: 'Tottenham Hotspur', id: 47, league: 'Premier League' }, { name: 'Real Madrid', id: 541, league: 'La Liga' }, { name: 'Barcelona', id: 529, league: 'La Liga' }, { name: 'Borussia Dortmund', id: 165, league: 'Bundesliga' }, { name: 'Bayern Munich', id: 157, league: 'Bundesliga' }, { name: 'LAFC', id: 601, league: 'MLS' }, { name: 'LA Galaxy', id: 602, league: 'MLS' }, { name: 'Inter Milan', id: 505, league: 'Serie A' }, { name: 'AC Milan', id: 489, league: 'Serie A' }, { name: 'PSG', id: 85, league: 'Ligue 1' }, { name: 'Marseille', id: 81, league: 'Ligue 1' }, ], "Basketball": [ { name: 'Denver Nuggets', id: 10, league: 'NBA Playoffs' }, { name: 'Minnesota Timberwolves', id: 11, league: 'NBA Playoffs' }, { name: 'Olympiacos', id: 1101, league: 'EuroLeague' }, { name: 'Panathinaikos', id: 1102, league: 'EuroLeague' }, ], "American Football": [ { name: 'Green Bay Packers', id: 201, league: 'NFL' }, { name: 'Chicago Bears', id: 202, league: 'NFL' }, { name: 'Alabama', id: 2001, league: 'NCAA Football' }, { name: 'Georgia', id: 2002, league: 'NCAA Football' }, ], "Hockey": [ { name: 'Toronto Maple Leafs', id: 301, league: 'NHL Playoffs' }, { name: 'Boston Bruins', id: 302, league: 'NHL Playoffs' }, ] };
    const allTeams = Object.values(teamData).flat().map(t => t.name);
    const historicalMatches = generateHistoricalData(allTeams, 500);

    const generateAllPredictions = (): MatchPrediction[] => {
        const predictions: MatchPrediction[] = [];
        let dayOffset = 0;
        for (const sport in teamData) {
            const teams = teamData[sport];
            for (let i = 0; i < teams.length; i += 2) {
                if (i + 1 >= teams.length) continue;
                const homeTeam = teams[i], awayTeam = teams[i+1];
                const matchDate = new Date(); matchDate.setDate(matchDate.getDate() + dayOffset);
                const { homeProbability, drawProbability, awayProbability, homeStats, awayStats } = predictMatch(homeTeam.name, awayTeam.name, historicalMatches);
                let predictionString = '', marketType = "Match Winner", predictionProb = 0, odds = 2.0;
                if (homeProbability > awayProbability && homeProbability > drawProbability) { predictionString = `${homeTeam.name} to Win`; predictionProb = homeProbability; odds = parseFloat((1 / (homeProbability - 0.05) + Math.random() * 0.2).toFixed(2)); } 
                else if (awayProbability > homeProbability && awayProbability > drawProbability) { predictionString = `${awayTeam.name} to Win`; predictionProb = awayProbability; odds = parseFloat((1 / (awayProbability - 0.05) + Math.random() * 0.2).toFixed(2)); } 
                else { predictionString = 'Draw'; predictionProb = drawProbability; odds = parseFloat((1 / (drawProbability - 0.05) + Math.random() * 0.2).toFixed(2)); }
                const expectedValue = calculateEV(predictionProb, odds) * 100, kellyStakePercentage = calculateKellyStake(predictionProb, odds);
                let confidence: ConfidenceTier;
                if (predictionProb > 0.60) confidence = ConfidenceTier.High; else if (predictionProb > 0.45) confidence = ConfidenceTier.Medium; else confidence = ConfidenceTier.Low;
                predictions.push({ id: `${homeTeam.league.slice(0, 3)}-${homeTeam.name.slice(0, 3)}-${awayTeam.name.slice(0, 3)}`.toLowerCase(), sport, teamA: homeTeam.name, teamAId: homeTeam.id, teamB: awayTeam.name, teamBId: awayTeam.id, league: homeTeam.league, matchDate: matchDate.toISOString(), prediction: predictionString, marketType, confidence, odds, reasoning: "AI analysis highlights a statistical edge based on recent form and historical matchups.", aiAnalysis: { keyPositives: ["Strong offensive metrics", "Favorable historical trend in this matchup"], keyNegatives: ["Opponent has a solid defensive record", "Key player is questionable"], confidenceBreakdown: [ { model: 'XGBoost', weight: 40, color: 'bg-green-500'}, { model: 'LSTM Network', weight: 30, color: 'bg-sky-500'}, { model: 'Ensemble', weight: 30, color: 'bg-purple-500'}], expectedValue: parseFloat(expectedValue.toFixed(1)), estimatedWinProbability: predictionProb, kellyStakePercentage: parseFloat(kellyStakePercentage.toFixed(1)), marketInsights: { sharpMoneyAlignment: Math.random() > 0.4, publicBettingPercentage: Math.floor(Math.random() * 40) + 50, significantOddsMovement: Math.random() > 0.7 }, riskLevel: kellyStakePercentage > 4 ? RiskLevel.Aggressive : kellyStakePercentage > 2 ? RiskLevel.Moderate : RiskLevel.Conservative, decisionFlow: [ { step: 'Data Quality', status: 'pass', reason: 'Recent stats available.' }, { step: 'Model Agreement', status: 'pass', reason: 'High consensus for outcome.' }, { step: 'Value Check (EV > 5%)', status: expectedValue > 5 ? 'pass' : 'fail', reason: `Calculated EV is ${expectedValue.toFixed(1)}%` }, { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' } ], sentimentAnalysis: { overallSentiment: Sentiment.Neutral, newsSummary: "Pundits are expecting a close game, but note the home team's recent strong performances.", socialMediaKeywords: ["#sports", "#betting", "#analysis"] }, dataSources: [ { category: "Team & Player Stats", provider: "Sportradar", status: DataSourceStatus.PreMatch, metrics: [{name: "Avg. Score For", value: `${homeStats.avgGoalsScored.toFixed(1)} - ${awayStats.avgGoalsScored.toFixed(1)}`}] }, { category: "Live Odds & Market", provider: "Betfair", status: DataSourceStatus.PreMatch, metrics: [{name: "Implied Probability", value: `${(1/odds*100).toFixed(1)}%`}] } ], formAnalysis: { teamA: homeStats.formString, teamB: awayStats.formString }, playerAnalysis: [{ name: 'Key Players', team: 'A', impact: 'Star performers will be crucial to the outcome.' }], bettingAngle: "The model identifies an edge based on recent performance metrics that the market seems to have overlooked.", gameScenario: { narrative: "A competitive match is expected, with the home team likely controlling the pace early on.", keyEvents: [ { eventType: 'Key Score', likelihood: 'High', description: 'The first score will be critical in setting the match tempo.' }, ] }, statisticalProfile: { teamA: { avgGoalsScored: homeStats.avgGoalsScored, avgGoalsConceded: homeStats.avgGoalsConceded, daysSinceLastMatch: 7 }, teamB: { avgGoalsScored: awayStats.avgGoalsScored, avgGoalsConceded: awayStats.avgGoalsConceded, daysSinceLastMatch: 7 }, } }});
                dayOffset++;
            }
        }
        return predictions.sort((a,b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());
    };
    let mockPredictions: MatchPrediction[] = generateAllPredictions();

    return {
        fetchInitialData: async (): Promise<{ predictions: MatchPrediction[]; liveMatches: LiveMatchPrediction[]; bankroll: BankrollState; userBets: UserBet[]; userSettings: UserSettings; }> => {
            await new Promise(res => setTimeout(res, 1200));
            const preMatch = mockPredictions.slice(2);
            const liveMatches: LiveMatchPrediction[] = mockPredictions.slice(0, 2).map((p, index) => ({ ...p, scoreA: index === 0 ? 1 : 48, scoreB: index === 0 ? 0 : 45, matchTime: index === 0 ? 35 : 24, momentum: index === 0 ? Momentum.TeamA : Momentum.Neutral, liveOdds: p.odds * (index === 0 ? 0.9 : 1.1), cashOutRecommendation: { isRecommended: false, value: null, reason: null }, hasValueAlert: false }));
            return { predictions: preMatch, liveMatches: liveMatches, bankroll: { ...bankrollDB }, userBets: [...userBetsDB], userSettings: { ...userSettingsDB } };
        },
        fetchHeadToHead: async (teamAId: number, teamBId: number): Promise<HeadToHeadFixture[]> => {
            await new Promise(res => setTimeout(res, 800));
            if ((teamAId === 42 && teamBId === 47) || (teamAId === 47 && teamBId === 42)) { return [ { fixtureId: 12345, date: "2024-03-03", homeTeam: "Arsenal", awayTeam: "Tottenham Hotspur", goals: { home: 3, away: 1 } }, { fixtureId: 12346, date: "2023-10-28", homeTeam: "Tottenham Hotspur", awayTeam: "Arsenal", goals: { home: 2, away: 2 } }, { fixtureId: 12347, date: "2023-01-15", homeTeam: "Tottenham Hotspur", awayTeam: "Arsenal", goals: { home: 0, away: 2 } }, { fixtureId: 12348, date: "2022-09-01", homeTeam: "Arsenal", awayTeam: "Tottenham Hotspur", goals: { home: 3, away: 1 } }, { fixtureId: 12349, date: "2022-5-12", homeTeam: "Tottenham Hotspur", awayTeam: "Arsenal", goals: { home: 3, away: 0 } }, ]; }
            return [];
        },
        fetchOddsHistory: async (matchId: string): Promise<OddsHistoryPoint[]> => {
            await new Promise(res => setTimeout(res, 900));
            const history: OddsHistoryPoint[] = [];
            let oA = Math.random()*1.5+1.5, oB = Math.random()*1.5+2.0, oD = Math.random()*1.0+3.0;
            for (let i=7; i>=0; i--) { oA += (Math.random()-0.5)*0.1; oB += (Math.random()-0.5)*0.1; oD += (Math.random()-0.5)*0.1; history.push({ date: i===0?'Today':`${i}d ago`, oddsA: parseFloat(Math.max(1.1, oA).toFixed(2)), oddsB: parseFloat(Math.max(1.1, oB).toFixed(2)), oddsDraw: parseFloat(Math.max(2.0, oD).toFixed(2))});}
            return history;
        },
        placeBet: async (prediction: MatchPrediction, stake: number, selections?: MatchPrediction[]): Promise<{ updatedBankroll: BankrollState, newBet: UserBet }> => {
            if (stake > userSettingsDB.maxStakePerBet) throw new Error(`Your stake of $${stake.toFixed(2)} exceeds your max stake per bet limit of $${userSettingsDB.maxStakePerBet.toFixed(2)}.`);
            if ((bankrollDB.dailyWagered + stake) > userSettingsDB.maxDailyStake) throw new Error(`This bet would exceed your daily wager limit of $${userSettingsDB.maxDailyStake.toFixed(2)}.`);
            await new Promise(res => setTimeout(res, 500));
            bankrollDB.current -= stake; bankrollDB.totalWagered += stake; bankrollDB.dailyWagered += stake;
            const newBet: UserBet = { id: crypto.randomUUID(), match: prediction, stake, odds: prediction.odds, status: 'pending', payout: null, placedAt: new Date(), selections: selections };
            userBetsDB.unshift(newBet);
            return { updatedBankroll: { ...bankrollDB }, newBet };
        },
        settleBet: async (betId: string): Promise<{ updatedBankroll: BankrollState, settledBet: UserBet }> => {
            await new Promise(res => setTimeout(res, 400));
            const betIndex = userBetsDB.findIndex(b => b.id === betId);
            if (betIndex === -1) throw new Error("Bet not found to settle");
            const bet = userBetsDB[betIndex];
            if (bet.status !== 'pending') return { updatedBankroll: { ...bankrollDB }, settledBet: bet };
            const isWin = Math.random() < bet.match.aiAnalysis.estimatedWinProbability;
            let settledBet: UserBet;
            if (isWin) { const winnings = bet.stake * bet.odds; bankrollDB.current += winnings; bankrollDB.totalReturned += winnings; settledBet = { ...bet, status: 'won', payout: winnings }; } 
            else { settledBet = { ...bet, status: 'lost', payout: 0 }; }
            userBetsDB[betIndex] = settledBet;
            return { updatedBankroll: { ...bankrollDB }, settledBet };
        },
        cashOutBet: async (betId: string, cashOutValue: number): Promise<{ updatedBankroll: BankrollState, cashedOutBet: UserBet }> => {
            await new Promise(res => setTimeout(res, 400));
            const betIndex = userBetsDB.findIndex(b => b.id === betId);
            if (betIndex === -1) throw new Error("Bet not found to cash out");
            const bet = userBetsDB[betIndex];
            if (bet.status !== 'pending') throw new Error("Only pending bets can be cashed out");
            bankrollDB.current += cashOutValue; bankrollDB.totalReturned += cashOutValue;
            const cashedOutBet: UserBet = { ...bet, status: 'cashed-out', payout: cashOutValue, cashedOutAmount: cashOutValue };
            userBetsDB[betIndex] = cashedOutBet;
            return { updatedBankroll: { ...bankrollDB }, cashedOutBet };
        },
        updateInitialBankroll: async (newInitial: number): Promise<{ updatedBankroll: BankrollState, clearedBets: UserBet[] }> => {
            await new Promise(res => setTimeout(res, 300));
            bankrollDB = { initial: newInitial, current: newInitial, totalWagered: 0, totalReturned: 0, dailyWagered: 0 };
            userBetsDB = [];
            return { updatedBankroll: { ...bankrollDB }, clearedBets: [] };
        },
        updateUserSettings: async (newSettings: UserSettings): Promise<UserSettings> => {
            await new Promise(res => setTimeout(res, 300));
            userSettingsDB = { ...newSettings };
            return { ...userSettingsDB };
        },
        generateTickets: async (selections: TicketSelection[], totalStake: number, riskProfile: 'Conservative' | 'Balanced' | 'Aggressive'): Promise<TicketVariation[]> => {
            await new Promise(res => setTimeout(res, 1500));
            if (selections.length === 0) return [];
            const variations: TicketVariation[] = [];
            const totalEV = selections.reduce((acc, s) => acc + s.aiAnalysis.expectedValue, 0) / selections.length;
            if (riskProfile === 'Conservative' && selections.length > 1) { const stakePerBet = totalStake / selections.length; variations.push({ title: 'Conservative Singles', description: 'Spreads risk by placing an equal stake on each individual prediction.', bets: selections.map(s => ({ prediction: s, stake: stakePerBet })), totalStake: totalStake, potentialReturn: selections.reduce((acc, s) => acc + (s.odds * stakePerBet), 0), winProbability: 65, totalEV: totalEV, }); }
            if (riskProfile === 'Balanced' && selections.length > 1) { const sortedSelections = [...selections].sort((a, b) => b.confidence === 'High' ? 1 : -1); const mainBet = sortedSelections[0]; const parlayBets = sortedSelections.slice(0, 2); const parlayOdds = parlayBets.reduce((acc, s) => acc * s.odds, 1); variations.push({ title: 'Balanced Approach', description: 'Focuses stake on the highest confidence pick, with a smaller 2-leg parlay for upside.', bets: [ { prediction: mainBet, stake: totalStake * 0.7 }, { prediction: { ...parlayBets[0], prediction: `${parlayBets.length}-Leg Parlay`, odds: parlayOdds, teamA: 'Parlay', teamB: 'Ticket', id: 'parlay-ticket', sport: 'Multiple', marketType: 'Parlay', teamAId: 0, teamBId: 0 }, stake: totalStake * 0.3 } ], totalStake: totalStake, potentialReturn: (mainBet.odds * totalStake * 0.7) + (parlayOdds * totalStake * 0.3), winProbability: 50, totalEV: totalEV, }); }
            const parlayOdds = selections.reduce((acc, s) => acc * s.odds, 1);
            variations.push({ title: `${selections.length}-Leg Parlay`, description: 'Combines all selections into a single high-risk, high-reward bet.', bets: [{ prediction: { ...selections[0], prediction: `${selections.length}-Leg Parlay`, odds: parlayOdds, teamA: 'Parlay', teamB: 'Ticket', id: 'parlay-ticket', sport: 'Multiple', marketType: 'Parlay', teamAId: 0, teamBId: 0 }, stake: totalStake }], totalStake: totalStake, potentialReturn: totalStake * parlayOdds, winProbability: 25, totalEV: (Math.pow(1 + (totalEV/100), selections.length) -1) * 100 });
            return variations;
        },
    };
};

const mockService = createMockService();
// --- END MOCK SERVICE ---


// --- API CLIENT IMPLEMENTATION ---
const apiCall = async <T>(endpoint: string, options: RequestInit, fallback: () => Promise<T>): Promise<T> => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`API request to ${endpoint} failed: ${response.status} ${response.statusText}`);
        }
        if (response.status === 204) return null as T;
        return await response.json();
    } catch (e) {
        if (e instanceof Error) {
            console.warn(`[API Fallback] Could not connect to backend for endpoint: ${endpoint}. Using mock data. Error: ${e.message}`);
        } else {
            console.warn(`[API Fallback] An unknown error occurred. Using mock data for endpoint: ${endpoint}.`);
        }
        return fallback();
    }
};

// --- EXPORTED SERVICE FUNCTIONS ---
export const fetchInitialData = async (): Promise<{ predictions: MatchPrediction[]; liveMatches: LiveMatchPrediction[]; bankroll: BankrollState; userBets: UserBet[]; userSettings: UserSettings; }> => {
    return apiCall('/data/initial', { method: 'GET' }, mockService.fetchInitialData);
};

export const fetchHeadToHead = async (teamAId: number, teamBId: number): Promise<HeadToHeadFixture[]> => {
    return apiCall(`/data/h2h/${teamAId}/${teamBId}`, { method: 'GET' }, () => mockService.fetchHeadToHead(teamAId, teamBId));
};

export const fetchOddsHistory = async (matchId: string): Promise<OddsHistoryPoint[]> => {
    return apiCall(`/data/odds-history/${matchId}`, { method: 'GET' }, () => mockService.fetchOddsHistory(matchId));
};

export const placeBet = async (prediction: MatchPrediction, stake: number, selections?: MatchPrediction[]): Promise<{ updatedBankroll: BankrollState, newBet: UserBet }> => {
    const body = { predictionId: prediction.id, stake, selectionIds: selections?.map(s => s.id) };
    return apiCall('/actions/bet', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }, () => mockService.placeBet(prediction, stake, selections));
};

export const settleBet = async (betId: string): Promise<{ updatedBankroll: BankrollState, settledBet: UserBet }> => {
    return apiCall(`/actions/settle-bet/${betId}`, { method: 'POST' }, () => mockService.settleBet(betId));
};

export const cashOutBet = async (betId: string, cashOutValue: number): Promise<{ updatedBankroll: BankrollState, cashedOutBet: UserBet }> => {
    const body = { cashOutValue };
    return apiCall(`/actions/cash-out/${betId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }, () => mockService.cashOutBet(betId, cashOutValue));
};

export const updateInitialBankroll = async (newInitial: number): Promise<{ updatedBankroll: BankrollState, clearedBets: UserBet[] }> => {
    const body = { newInitial };
    return apiCall('/actions/bankroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }, () => mockService.updateInitialBankroll(newInitial));
};

export const updateUserSettings = async (newSettings: UserSettings): Promise<UserSettings> => {
    return apiCall('/actions/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
    }, () => mockService.updateUserSettings(newSettings));
};

export const generateTickets = async (selections: TicketSelection[], totalStake: number, riskProfile: 'Conservative' | 'Balanced' | 'Aggressive'): Promise<TicketVariation[]> => {
    const body = { selectionIds: selections.map(s => s.id), totalStake, riskProfile };
    return apiCall('/actions/generate-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }, () => mockService.generateTickets(selections, totalStake, riskProfile));
};