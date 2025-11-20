
import { type MatchPrediction, type LiveMatchPrediction, ConfidenceTier, Momentum, type BankrollState, RiskLevel, type AIDecisionFlowStep, type UserBet, type TicketSelection, type TicketVariation, Sentiment, DataSourceStatus, type UserSettings, type HeadToHeadFixture, type OddsHistoryPoint, MarketType } from '../types';
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
      return { homeProbability: homeP / sum, drawProbability: drawP / sum, awayProbability: awayP / sum, homeStats, awayStats, totalGoals: homeStats.avgGoalsScored + awayStats.avgGoalsScored };
    };
    const calculateEV = (p: number, o: number) => (p * (o - 1)) - (1 - p);
    const calculateKellyStake = (p: number, o: number, f = 0.25) => { if (o <= 1) return 0; const k = ( (o-1) * p - (1-p) ) / (o-1); return Math.min(Math.max(0, k * f) * 100, 10); };
    
    // --- Data Generation (Expanded Sports) ---
    const teamData: Record<string, { name: string; id: number; league: string; players?: { name: string; position: string; }[] }[]> = { 
        "Soccer": [ 
            { name: 'Arsenal', id: 42, league: 'Premier League', players: [{ name: 'Bukayo Saka', position: 'FW'}] }, 
            { name: 'Tottenham Hotspur', id: 47, league: 'Premier League', players: [{ name: 'Son Heung-min', position: 'FW'}] }, 
            { name: 'Real Madrid', id: 541, league: 'La Liga', players: [{ name: 'Vinicius Jr', position: 'FW' }] }, 
            { name: 'Barcelona', id: 529, league: 'La Liga', players: [{ name: 'Lamine Yamal', position: 'FW' }] }, 
            { name: 'Man City', id: 501, league: 'Premier League', players: [{ name: 'Erling Haaland', position: 'FW' }] },
            { name: 'Liverpool', id: 502, league: 'Premier League', players: [{ name: 'Mo Salah', position: 'FW' }] }
        ], 
        "Basketball": [ 
            { name: 'Denver Nuggets', id: 10, league: 'NBA', players: [{ name: 'Nikola Jokic', position: 'C' }] }, 
            { name: 'Boston Celtics', id: 11, league: 'NBA', players: [{ name: 'Jayson Tatum', position: 'SF' }] }, 
            { name: 'Dallas Mavericks', id: 12, league: 'NBA', players: [{ name: 'Luka Doncic', position: 'PG' }] }, 
            { name: 'LA Lakers', id: 13, league: 'NBA', players: [{ name: 'LeBron James', position: 'SF' }] }, 
        ], 
        "American Football": [ 
            { name: 'Kansas City Chiefs', id: 201, league: 'NFL', players: [{ name: 'Patrick Mahomes', position: 'QB' }] }, 
            { name: 'San Francisco 49ers', id: 202, league: 'NFL', players: [{ name: 'Christian McCaffrey', position: 'RB' }] }, 
            { name: 'Detroit Lions', id: 203, league: 'NFL', players: [{ name: 'Jared Goff', position: 'QB' }] }, 
            { name: 'Baltimore Ravens', id: 204, league: 'NFL', players: [{ name: 'Lamar Jackson', position: 'QB' }] }, 
        ], 
        "Tennis": [
            { name: 'Jannik Sinner', id: 401, league: 'ATP' },
            { name: 'Carlos Alcaraz', id: 402, league: 'ATP' },
            { name: 'Novak Djokovic', id: 403, league: 'ATP' },
            { name: 'Daniil Medvedev', id: 404, league: 'ATP' },
            { name: 'Iga Swiatek', id: 405, league: 'WTA' },
            { name: 'Aryna Sabalenka', id: 406, league: 'WTA' }
        ],
        "MMA": [
            { name: 'Islam Makhachev', id: 501, league: 'UFC' },
            { name: 'Dustin Poirier', id: 502, league: 'UFC' },
            { name: 'Jon Jones', id: 503, league: 'UFC' },
            { name: 'Tom Aspinall', id: 504, league: 'UFC' },
            { name: 'Sean O\'Malley', id: 505, league: 'UFC' },
            { name: 'Merab Dvalishvili', id: 506, league: 'UFC' }
        ],
        "Baseball": [
            { name: 'LA Dodgers', id: 601, league: 'MLB', players: [{name: 'Shohei Ohtani', position: 'DH'}] },
            { name: 'NY Yankees', id: 602, league: 'MLB', players: [{name: 'Aaron Judge', position: 'OF'}] },
            { name: 'Philadelphia Phillies', id: 603, league: 'MLB', players: [{name: 'Bryce Harper', position: '1B'}] },
            { name: 'Baltimore Orioles', id: 604, league: 'MLB', players: [{name: 'Gunnar Henderson', position: 'SS'}] }
        ],
        "Formula 1": [
            { name: 'Max Verstappen', id: 701, league: 'F1' },
            { name: 'Lando Norris', id: 702, league: 'F1' },
            { name: 'Lewis Hamilton', id: 703, league: 'F1' },
            { name: 'Charles Leclerc', id: 704, league: 'F1' }
        ]
    };
    const allTeams = Object.values(teamData).flat().map(t => t.name);
    const historicalMatches = generateHistoricalData(allTeams, 500);

    const generatePrediction = (matchInfo: any, predictionData: any): MatchPrediction => {
        const { homeTeam, awayTeam, matchDate, homeStats, awayStats, sport } = matchInfo;
        const { prediction, marketType, marketValue, probability } = predictionData;

        const odds = parseFloat((1 / (probability - 0.05) + Math.random() * 0.2).toFixed(2));
        const expectedValue = calculateEV(probability, odds) * 100;
        const kellyStakePercentage = calculateKellyStake(probability, odds);
        const significantOddsMovement = Math.random() > 0.7;
        const oddsMovementDirection = significantOddsMovement ? (Math.random() > 0.5 ? 'up' : 'down') : undefined;

        let confidence: ConfidenceTier;
        if (probability > 0.60) confidence = ConfidenceTier.High; else if (probability > 0.45) confidence = ConfidenceTier.Medium; else confidence = ConfidenceTier.Low;
        
        // Generate random streak for visual flair
        const streak = Math.floor(Math.random() * 6) - 1; // -1 to 4

        return {
            id: `${homeTeam.id}-${awayTeam.id}-${prediction.replace(/\s/g, '')}`.toLowerCase(),
            matchId: `${homeTeam.id}-${awayTeam.id}`,
            sport,
            teamA: homeTeam.name, teamAId: homeTeam.id,
            teamB: awayTeam.name, teamBId: awayTeam.id,
            league: homeTeam.league,
            matchDate: matchDate.toISOString(),
            prediction, marketType, marketValue,
            confidence, odds,
            streak: streak > 2 ? streak : undefined,
            reasoning: "Initial statistical model scan. Click for deep AI analysis.",
            aiAnalysis: { keyPositives: ["Statistical Edge identified", "Market inefficiency detected"], keyNegatives: ["Volatility high"], confidenceBreakdown: [ { model: 'Base Model', weight: 100, color: 'bg-gray-500'}], expectedValue: parseFloat(expectedValue.toFixed(1)), estimatedWinProbability: probability, kellyStakePercentage: parseFloat(kellyStakePercentage.toFixed(1)), marketInsights: { sharpMoneyAlignment: Math.random() > 0.4, publicBettingPercentage: Math.floor(Math.random() * 40) + 50, significantOddsMovement, oddsMovementDirection }, riskLevel: kellyStakePercentage > 4 ? RiskLevel.Aggressive : kellyStakePercentage > 2 ? RiskLevel.Moderate : RiskLevel.Conservative, decisionFlow: [ { step: 'Screening', status: 'pass', reason: 'Passed initial filters' } ], sentimentAnalysis: { overallSentiment: Sentiment.Neutral, newsSummary: "Loading AI Context...", socialMediaKeywords: [] }, dataSources: [], formAnalysis: { teamA: homeStats?.formString || 'N/A', teamB: awayStats?.formString || 'N/A' }, playerAnalysis: [], bettingAngle: "AI Model initialized. Open details for full deep-dive.", gameScenario: { narrative: "Pending AI generation...", keyEvents: [] }, statisticalProfile: { teamA: { avgGoalsScored: homeStats?.avgGoalsScored || 0, avgGoalsConceded: homeStats?.avgGoalsConceded || 0, daysSinceLastMatch: 7 }, teamB: { avgGoalsScored: awayStats?.avgGoalsScored || 0, avgGoalsConceded: awayStats?.avgGoalsConceded || 0, daysSinceLastMatch: 7 }, } }
        };
    };

    const generateAllPredictions = (): MatchPrediction[] => {
        const predictions: MatchPrediction[] = [];
        let dayOffset = 0;
        for (const sport in teamData) {
            const teams = teamData[sport];
            // For individual sports (Tennis, MMA, F1), we pair them differently or just pick random head-to-heads
            const step = sport === 'Formula 1' ? 2 : 2; 
            
            for (let i = 0; i < teams.length; i += step) {
                if (i + 1 >= teams.length) continue;
                const homeTeam = teams[i], awayTeam = teams[i+1];
                const matchDate = new Date(); matchDate.setDate(matchDate.getDate() + dayOffset); matchDate.setHours(matchDate.getHours() + (i * 2) + 12);
                
                // Use simpler stats for non-team sports
                const isTeamSport = ['Soccer', 'Basketball', 'American Football', 'Hockey', 'Baseball'].includes(sport);
                const { homeProbability, drawProbability, awayProbability, homeStats, awayStats, totalGoals } = isTeamSport 
                    ? predictMatch(homeTeam.name, awayTeam.name, historicalMatches)
                    : { homeProbability: 0.55, drawProbability: 0, awayProbability: 0.45, homeStats: null, awayStats: null, totalGoals: 0 };
                
                const matchInfo = { homeTeam, awayTeam, matchDate, homeStats, awayStats, sport };
                
                // --- Generate Market Bundles ---
                // 1. Match Winner (always generate)
                let winnerPrediction;
                if (homeProbability > awayProbability && homeProbability > drawProbability) {
                    winnerPrediction = { prediction: `${homeTeam.name}`, marketType: MarketType.MatchWinner, probability: homeProbability };
                } else if (awayProbability > homeProbability && awayProbability > drawProbability) {
                    winnerPrediction = { prediction: `${awayTeam.name}`, marketType: MarketType.MatchWinner, probability: awayProbability };
                } else {
                    winnerPrediction = { prediction: 'Draw', marketType: MarketType.MatchWinner, probability: drawProbability };
                }
                predictions.push(generatePrediction(matchInfo, winnerPrediction));

                // 2. Sport Specific Markets
                if (sport === 'Soccer') {
                    const marketValue = 2.5;
                    const overProbability = Math.min(0.9, totalGoals / (marketValue * 2));
                    predictions.push(generatePrediction(matchInfo, { prediction: `Over ${marketValue} Goals`, marketType: MarketType.TotalGoals, marketValue, probability: overProbability }));
                } else if (sport === 'Basketball' || sport === 'American Football') {
                    const isHomeFavorite = homeProbability > awayProbability;
                    const spread = isHomeFavorite ? -(Math.floor(Math.random() * 5) + 2.5) : (Math.floor(Math.random() * 5) + 2.5);
                    predictions.push(generatePrediction(matchInfo, {
                        prediction: `${isHomeFavorite ? homeTeam.name : awayTeam.name} ${spread > 0 ? '+' : ''}${spread}`,
                        marketType: MarketType.PointSpread,
                        marketValue: spread,
                        probability: 0.52 + (Math.random() * 0.1)
                    }));
                } else if (sport === 'Tennis') {
                     predictions.push(generatePrediction(matchInfo, {
                        prediction: `${homeTeam.name} -1.5 Sets`,
                        marketType: MarketType.PointSpread, // Reusing PointSpread for Set Handicap
                        marketValue: -1.5,
                        probability: 0.45
                    }));
                } else if (sport === 'MMA') {
                     predictions.push(generatePrediction(matchInfo, {
                        prediction: `Fight to go the Distance: No`,
                        marketType: MarketType.TotalGoals, // Reusing type for duration
                        probability: 0.65
                    }));
                }
                
                // 3. Player Props (if players exist)
                const hasPlayers = homeTeam.players && homeTeam.players.length > 0;
                if (hasPlayers) {
                     const teamToBetOn = Math.random() > 0.5 ? homeTeam : awayTeam;
                    const player = teamToBetOn.players![Math.floor(Math.random() * teamToBetOn.players!.length)];
                    let propType = '', line = 0, predictionString = '';

                    if (sport === 'Basketball') {
                        propType = 'Points';
                        line = player.position === 'C' ? 22.5 : 25.5;
                        predictionString = `${player.name} Over ${line} ${propType}`;
                    } else if (sport === 'American Football') {
                        propType = player.position === 'QB' ? 'Passing Yards' : 'Receiving Yards';
                        line = player.position === 'QB' ? 250.5 : 65.5;
                         predictionString = `${player.name} Over ${line} ${propType}`;
                    } else if (sport === 'Soccer') {
                        propType = 'to Score Anytime';
                        line = 0.5;
                         predictionString = `${player.name} ${propType}`;
                    } else if (sport === 'Baseball') {
                        propType = 'Home Run';
                        line = 0.5;
                        predictionString = `${player.name} to Hit a ${propType}`;
                    }
                    
                    if (predictionString) {
                         const playerPropPrediction = {
                            prediction: predictionString,
                            marketType: MarketType.PlayerProp,
                            marketValue: line,
                            probability: 0.40 + (Math.random() * 0.15)
                        };
                        predictions.push(generatePrediction(matchInfo, playerPropPrediction));
                    }
                }
                dayOffset++;
            }
        }
        return predictions.sort((a,b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());
    };
    let mockPredictions: MatchPrediction[] = generateAllPredictions();

    return {
        fetchInitialData: async (): Promise<{ predictions: MatchPrediction[]; liveMatches: LiveMatchPrediction[]; bankroll: BankrollState; userBets: UserBet[]; userSettings: UserSettings; }> => {
            await new Promise(res => setTimeout(res, 800));
            // Ensure live matches are also generated with matchIds. Re-slicing from the full list.
            const liveMatches: LiveMatchPrediction[] = mockPredictions.slice(0, 4).map((p, index) => ({ ...p, scoreA: index % 2 === 0 ? 1 : 48, scoreB: index % 2 === 0 ? 0 : 45, matchTime: index % 2 === 0 ? 35 : 24, momentum: index % 2 === 0 ? Momentum.TeamA : Momentum.Neutral, liveOdds: p.odds * (index % 2 === 0 ? 0.9 : 1.1), cashOutRecommendation: { isRecommended: false, value: null, reason: null }, hasValueAlert: false }));
            const preMatch = mockPredictions.filter(p => !liveMatches.some(live => live.id === p.id));
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
            await new Promise(res => setTimeout(res, 1500)); // Simulate AI thinking time
            if (selections.length === 0) return [];

            const variations: TicketVariation[] = [];
            const sortedByConfidence = [...selections].sort((a, b) => {
                const confidenceOrder = { [ConfidenceTier.High]: 3, [ConfidenceTier.Medium]: 2, [ConfidenceTier.Low]: 1 };
                return confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
            });
            
            const isSGP = new Set(selections.map(s => s.matchId)).size === 1;

            // --- AI SIMULATION LOGIC ---

            // ** Conservative Strategy: Prioritize capital preservation. **
            if (riskProfile === 'Conservative' && selections.length > 0 && !isSGP) {
                const stakePerBet = totalStake / selections.length;
                variations.push({
                    title: 'Conservative Singles',
                    description: 'AI recommends spreading risk equally across all selected matches to minimize exposure on any single outcome.',
                    bets: selections.map(s => ({ prediction: s, stake: stakePerBet })),
                    totalStake: totalStake,
                    potentialReturn: selections.reduce((acc, s) => acc + (s.odds * stakePerBet), 0),
                    winProbability: 70, 
                    totalEV: selections.reduce((acc, s) => acc + (s.aiAnalysis.expectedValue / selections.length), 0),
                });
            }

            // ** Balanced Strategy: A mix of a primary bet and a smaller upside play. **
            if (riskProfile === 'Balanced' && selections.length > 1 && !isSGP) {
                const anchorBet = sortedByConfidence[0];
                const secondaryBets = sortedByConfidence.slice(1, 3); // Max 2-leg parlay for balance
                const parlayOdds = secondaryBets.reduce((acc, s) => acc * s.odds, 1);
                
                const anchorStake = totalStake * 0.65;
                const parlayStake = totalStake * 0.35;

                variations.push({
                    title: 'Balanced Anchor & Parlay',
                    description: `AI suggests focusing 65% of the stake on the highest confidence pick (${anchorBet.prediction}) and combining the next two strongest picks into a smaller parlay for higher potential returns.`,
                    bets: [
                        { prediction: anchorBet, stake: anchorStake },
                        { prediction: { ...secondaryBets[0], prediction: `${secondaryBets.length}-Leg Parlay`, odds: parlayOdds, teamA: 'Parlay', teamB: 'Ticket', id: 'parlay-balanced', sport: 'Multiple', marketType: MarketType.Parlay, matchId: 'parlay-balanced' }, stake: parlayStake }
                    ],
                    totalStake: totalStake,
                    potentialReturn: (anchorBet.odds * anchorStake) + (parlayOdds * parlayStake),
                    winProbability: 55,
                    totalEV: (anchorBet.aiAnalysis.expectedValue * 0.65) + (secondaryBets.reduce((acc, s) => acc + s.aiAnalysis.expectedValue, 0) / secondaryBets.length * 0.35),
                });
            }
            
            // ** Aggressive Strategy: High-risk, high-reward parlays. **
            if (selections.length > 0) {
                 // SGP odds need a slight reduction for correlation, simple multiplication is fine for mock
                 const parlayOdds = selections.reduce((acc, s) => acc * s.odds, 1) * (isSGP ? 0.9 : 1);
                 const totalEV = selections.reduce((acc, s) => acc * (1 + s.aiAnalysis.expectedValue / 100), 1);
                 const compoundedEV = (totalEV - 1) * 100;
                 const title = isSGP ? `Aggressive Same Game Parlay` : `Aggressive ${selections.length}-Leg Parlay`;
                 const description = isSGP
                    ? 'The AI combines your selections from this single game into a high-risk, high-reward SGP.'
                    : 'For a high-risk, high-reward approach, the AI combines all selections into a single parlay.';

                 variations.push({
                    title: title,
                    description: description,
                    bets: [{ prediction: { ...selections[0], prediction: `${selections.length}-Leg Parlay`, odds: parlayOdds, teamA: 'Parlay', teamB: 'Ticket', id: 'parlay-aggressive', sport: 'Multiple', marketType: MarketType.Parlay, matchId: 'parlay-aggressive' }, stake: totalStake }],
                    totalStake: totalStake,
                    potentialReturn: totalStake * parlayOdds,
                    winProbability: 30,
                    totalEV: compoundedEV,
                });
            }
            
            // Ensure there's at least one option if logic fails
            if (variations.length === 0 && selections.length > 0) {
                 const parlayOdds = selections.reduce((acc, s) => acc * s.odds, 1);
                 variations.push({ title: `${selections.length}-Leg Parlay`, description: 'Default high-reward bet.', bets: [{ prediction: { ...selections[0], prediction: `${selections.length}-Leg Parlay`, odds: parlayOdds, teamA: 'Parlay', teamB: 'Ticket', id: 'parlay-default', sport: 'Multiple', marketType: MarketType.Parlay, matchId: 'parlay-default' }, stake: totalStake }], totalStake: totalStake, potentialReturn: totalStake * parlayOdds, winProbability: 25, totalEV: 0 });
            }

            return variations.slice(0, 3); // Max 3 variations
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
