import { type MatchPrediction, type LiveMatchPrediction, ConfidenceTier, Momentum, type BankrollState, RiskLevel, type AIDecisionFlowStep, type UserBet, type TicketSelection, type TicketVariation, Sentiment, DataSourceStatus, type UserSettings, type HeadToHeadFixture } from '../types';

// In a real application, this state would live on a server database.
let bankrollDB: BankrollState = {
    initial: 1000,
    current: 1000,
    totalWagered: 0,
    totalReturned: 0,
    dailyWagered: 0,
};

let userSettingsDB: UserSettings = {
    maxStakePerBet: 500,
    maxDailyStake: 2000,
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


// FIX: Corrected typo in `toLocaleDateString` method call and its arguments.
const formatDate = (date: Date) => date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// DATA REFRESH: Updated with new, more relevant and high-profile matchups to keep the dashboard fresh.
const mockPredictions: MatchPrediction[] = [
    { 
        id: "pl-ars-tot",
        sport: "Soccer",
        teamA: "Arsenal", 
        teamAId: 42,
        teamB: "Tottenham Hotspur", 
        teamBId: 47,
        league: "Premier League", 
        matchDate: formatDate(today),
        prediction: "Arsenal to Win", 
        marketType: "Match Winner",
        confidence: ConfidenceTier.High, 
        odds: 1.85, 
        reasoning: "AI highlights Arsenal's dominant home form (unbeaten in 8) and Bukayo Saka's creative influence. H2H trends at the Emirates strongly favor a home victory.",
        stadium: "Emirates Stadium",
        referee: "Anthony Taylor",
        attendance: 60260,
        aiAnalysis: {
            bettingAngle: "The AI identifies a significant mismatch in home vs. away defensive metrics, making Arsenal a strong favorite beyond what the current odds suggest.",
            formAnalysis: { teamA: 'WWWDW', teamB: 'LWLWW' },
            playerAnalysis: [
                { name: 'Bukayo Saka', team: 'A', impact: 'Key to Arsenal\'s attack; his performance often dictates the outcome.' },
                { name: 'Son Heung-min', team: 'B', impact: 'Tottenham\'s primary goal threat, capable of scoring from any situation.' }
            ],
            gameScenario: {
                narrative: "Expect Arsenal to control possession from the start, using their wingers to stretch Tottenham's defense. The first goal is likely to come in the first half from an Arsenal set-piece or a quick counter-press. Tottenham will be dangerous on the break, particularly in the second half if they are chasing the game. The match is predicted to be intense, with a high chance of yellow cards due to the derby nature.",
                scorePrediction: "2-1",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Bukayo Saka to be involved in at least one goal (score or assist).' },
                    { eventType: 'Discipline', likelihood: 'Medium', description: 'A red card is possible given the rivalry, but not highly probable.' },
                    { eventType: 'Key Score', likelihood: 'High', description: 'A goal from a set-piece situation is highly likely for either team.' },
                ]
            },
            keyPositives: ["Unbeaten in last 8 home games", "Higher xG (Expected Goals) in recent matches", "Key midfielder returning from injury", "Spurs' defensive vulnerabilities on the road"],
            keyNegatives: ["Derby matches are highly unpredictable", "Son Heung-min's excellent record against Arsenal"],
            confidenceBreakdown: [
                { model: 'XGBoost', weight: 50, color: 'bg-green-500'},
                { model: 'LSTM Network', weight: 25, color: 'bg-sky-500'},
                { model: 'Graph Network', weight: 15, color: 'bg-purple-500'},
                { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500'},
            ],
            expectedValue: 12.8,
            kellyStakePercentage: 3.8,
            marketInsights: {
                sharpMoneyAlignment: true,
                publicBettingPercentage: 75,
                significantOddsMovement: false,
            },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'All player and team stats are recent.' },
                { step: 'Model Agreement', status: 'pass', reason: 'High consensus for a home win.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'Calculated EV is 12.8%, exceeding threshold.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "Arteta praised his team's focus in the pre-match press conference. Pundits are backing Arsenal's solid defense to be the deciding factor.",
                socialMediaKeywords: ["#NLD", "#COYG", "Gunners", "HomeAdvantage"]
            },
            dataSources: [
                 { category: "Team & Player Stats", provider: "Sportradar", status: DataSourceStatus.Live, metrics: [{name: "xG (Live)", value: "1.2 - 0.4"}, {name: "Possession %", value: "62% - 38%"}, {name: "Shots on Target", value: "4 - 1"}] },
                 { category: "Live Odds & Market", provider: "Betfair Exchange", status: DataSourceStatus.Live, metrics: [{name: "Market Volume", value: "$3.5M"}, {name: "Implied Probability", value: "58%"}, {name: "Sharp Money Flow", value: "+$80k on Arsenal"}] },
                 { category: "Contextual Factors", provider: "OpenWeatherMap", status: DataSourceStatus.PreMatch, metrics: [{name: "Conditions", value: "Clear"}, {name: "Temperature", value: "15°C"}, {name: "Wind", value: "5 km/h"}] }
            ]
        }
    },
    { 
        id: "nba-den-min",
        sport: "Basketball",
        teamA: "Denver Nuggets", 
        teamAId: 10,
        teamB: "Minnesota Timberwolves", 
        teamBId: 11,
        league: "NBA Playoffs", 
        matchDate: formatDate(today),
        prediction: "Nuggets -4.5", 
        marketType: "Handicap",
        confidence: ConfidenceTier.Medium, 
        odds: 1.91, 
        reasoning: "The AI emphasizes the significant impact of Denver's high-altitude home venue and Nikola Jokic's MVP-level form, giving them a crucial edge over Minnesota's stout defense.",
        stadium: "Ball Arena",
        aiAnalysis: {
            bettingAngle: "The model places high weight on the impact of altitude and home-court advantage in playoff games, which it believes the market is underestimating.",
            formAnalysis: { teamA: 'WWLWW', teamB: 'LWWWL' },
            playerAnalysis: [
                { name: 'Nikola Jokic', team: 'A', impact: 'The engine of the Nuggets\' offense; his all-around game is the key to victory.' },
                { name: 'Anthony Edwards', team: 'B', impact: 'An explosive scorer who can single-handedly keep the Timberwolves competitive.' }
            ],
            gameScenario: {
                narrative: "This will be a battle of tempos. Denver will slow it down, running their offense through Jokic in the half-court, while Minnesota pushes the pace off turnovers. Expect a close first half, with Denver pulling away in the third quarter as Jokic's passing unlocks the Timberwolves' defense. Free throws will be critical in the final minutes.",
                scorePrediction: "112-105",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Nikola Jokic is projected for a triple-double.' },
                    { eventType: 'Turnover', likelihood: 'Medium', description: 'Anthony Edwards\' aggressive drives might lead to crucial late-game turnovers.' },
                    { eventType: 'Injury', likelihood: 'Low', description: 'Low risk of significant injuries, but the physical nature could lead to minor knocks.' },
                ]
            },
            keyPositives: ["Jokic's high assist-to-turnover ratio", "Strong home-court advantage at altitude", "Experience in playoff situations", "Better team offensive rating"],
            keyNegatives: ["Timberwolves' #1 ranked defense", "Anthony Edwards' explosive scoring ability", "Nuggets' occasional defensive lapses"],
            confidenceBreakdown: [
                { model: 'XGBoost', weight: 35, color: 'bg-green-500'},
                { model: 'LSTM Network', weight: 30, color: 'bg-sky-500'},
                { model: 'Graph Network', weight: 25, color: 'bg-purple-500'},
                { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500'},
            ],
            expectedValue: 6.2,
            kellyStakePercentage: 2.1,
            marketInsights: {
                sharpMoneyAlignment: false,
                publicBettingPercentage: 68,
                significantOddsMovement: true,
            },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'Full player stats available for both teams.' },
                { step: 'Model Agreement', status: 'neutral', reason: 'Models agree on a win, but differ on the margin.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 6.2%, exceeding threshold.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Neutral,
                newsSummary: "Analysts are highlighting the Jokic vs. Gobert matchup as key. The Timberwolves' coach expressed confidence that their defense can slow down the Nuggets' offense.",
                socialMediaKeywords: ["#NBAPlayoffs", "JokicMVP", "AntMan", "MileHighBasketball"]
            },
            dataSources: [
                 { category: "Player Stats", provider: "StatsPerform", status: DataSourceStatus.Live, metrics: [{name: "Jokic Points", value: "18"}, {name: "Jokic Assists", value: "9"}, {name: "Edwards Points", value: "22"}] },
                 { category: "Live Odds & Market", provider: "OddsAPI.io", status: DataSourceStatus.Live, metrics: [{name: "Live Spread", value: "-3.5"}, {name: "Odds Drift", value: "+2.1%"}, {name: "Best Available", value: "1.95 (Pinnacle)"}] },
                 { category: "Team Stats", provider: "TheSportsDB", status: DataSourceStatus.PreMatch, metrics: [{name: "Defensive Rating", value: "111.5 (8th) - 108.2 (1st)"}, {name: "Venue", value: "Ball Arena"}, {name: "Series Record", value: "1-1"}] }
            ]
        }
    },
    { 
        id: "pl-mci-che",
        sport: "Soccer",
        teamA: "Manchester City", 
        teamAId: 50,
        teamB: "Chelsea", 
        teamBId: 49,
        league: "Premier League", 
        matchDate: formatDate(tomorrow),
        prediction: "Over 3.5 Goals", 
        marketType: "Total Goals",
        confidence: ConfidenceTier.High, 
        odds: 2.20, 
        reasoning: "City averages 3.1 goals at home, and recent H2H trends at the Etihad are high-scoring. The AI model predicts an open game with multiple goalscorers, including the in-form Cole Palmer.",
        stadium: "Etihad Stadium",
        referee: "Michael Oliver",
        attendance: 53400,
        aiAnalysis: {
            bettingAngle: "The model has detected that both teams operate in the 90th percentile for 'big chances created' in their last 5 games, making the 'Over' a statistically probable outcome.",
            formAnalysis: { teamA: 'WWWWW', teamB: 'WDWWL' },
            playerAnalysis: [
                { name: 'Erling Haaland', team: 'A', impact: 'A generational goalscorer who can turn the game at any moment.' },
                { name: 'Cole Palmer', team: 'B', impact: 'Chelsea\'s main creative force, highly motivated against his former club.' }
            ],
            gameScenario: {
                narrative: "Manchester City is expected to dominate possession and create numerous scoring chances. Chelsea will be forced to play on the counter-attack, where Cole Palmer's creativity will be crucial. Expect an open, end-to-end match with goals from both sides. The second half could be particularly chaotic as defenses tire.",
                scorePrediction: "4-2",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Erling Haaland is predicted to score at least once.' },
                    { eventType: 'Key Score', likelihood: 'Medium', description: 'A goal from outside the penalty area is likely given the talent on display.' },
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Cole Palmer is likely to have a goal contribution (goal or assist) for Chelsea.' },
                ]
            },
            keyPositives: ["City average 3.1 goals/game at home", "Chelsea's last 5 games averaged 4.2 goals", "Both teams have world-class attackers", "H2H at the Etihad is often high-scoring"],
            keyNegatives: ["Potential for tactical, cautious play from Chelsea", "City's defense can be stifling"],
            confidenceBreakdown: [
                { model: 'XGBoost', weight: 50, color: 'bg-green-500'}, { model: 'LSTM Network', weight: 25, color: 'bg-sky-500'}, { model: 'Graph Network', weight: 15, color: 'bg-purple-500'}, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500'},
            ],
            expectedValue: 18.5,
            kellyStakePercentage: 4.8,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 70, significantOddsMovement: false },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'All data points fresh.' },
                { step: 'Model Agreement', status: 'pass', reason: 'High consensus on a high-scoring match.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 18.5%, excellent value on the Over.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "Focus is on Haaland's goal-scoring record and Cole Palmer's return to his former club. Both managers have hinted at attacking lineups.",
                socialMediaKeywords: ["#MCICHE", "Haaland", "ColePalmer", "GoalFest"]
            },
             dataSources: [
                 { category: "Team & Player Stats", provider: "API-Football", status: DataSourceStatus.PreMatch, metrics: [{name: "Goals For (L5)", value: "15 - 11"}, {name: "xG (L5)", value: "12.8 - 9.5"}, {name: "Key Player Status", value: "All Fit"}] },
                 { category: "Live Odds & Market", provider: "OddsAPI.io", status: DataSourceStatus.PreMatch, metrics: [{name: "Market Consensus", value: "70% on Over 3.5"}, {name: "Odds Stability", value: "Stable"}, {name: "Best Odds", value: "2.25"}] },
                 { category: "News & Sentiment", provider: "NewsAPI.org", status: DataSourceStatus.PreMatch, metrics: [{name: "Media Tone", value: "Positive (Attacking)"}, {name: "Player Morale", value: "High"}, {name: "Injury Rumors", value: "None"}] }
            ]
        }
    },
    { 
        id: "nba-nyk-phi",
        sport: "Basketball",
        teamA: "New York Knicks", 
        teamAId: 18,
        teamB: "Philadelphia 76ers", 
        teamBId: 19,
        league: "NBA Playoffs", 
        matchDate: formatDate(tomorrow),
        prediction: "Knicks Moneyline", 
        marketType: "Moneyline",
        confidence: ConfidenceTier.High, 
        odds: 1.77, 
        reasoning: "Jalen Brunson's elite scoring form combined with the Knicks' league-leading offensive rebounding at the iconic MSG venue creates a decisive advantage, according to the AI.",
        stadium: "Madison Square Garden",
        attendance: 19812,
        aiAnalysis: {
            bettingAngle: "The AI's analysis of rebounding metrics (especially offensive rebounds) shows a significant advantage for the Knicks that historically translates to a high win probability at home.",
            formAnalysis: { teamA: 'WWWLW', teamB: 'WWWWW' },
            playerAnalysis: [
                { name: 'Jalen Brunson', team: 'A', impact: 'Elite scorer and leader, performing at an MVP level in the playoffs.' },
                { name: 'Joel Embiid', team: 'B', impact: 'Dominant MVP center, but his health and conditioning are significant question marks.' }
            ],
            gameScenario: {
                narrative: "Expect a gritty, physical, and low-scoring playoff game. The Knicks will dominate the offensive glass, creating second-chance points. The 76ers will run their offense through Embiid, but he will face constant double-teams. The game will be decided by which team's star player can overcome the intense defensive pressure in the final quarter.",
                scorePrediction: "101-96",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Jalen Brunson is projected to score over 30 points.' },
                    { eventType: 'Discipline', likelihood: 'Medium', description: 'Joel Embiid is at risk of getting into foul trouble due to the Knicks\' physical defense.' },
                    { eventType: 'Injury', likelihood: 'Medium', description: 'Embiid\'s health is a major variable; any sign of fatigue could swing the game heavily.' },
                ]
            },
            keyPositives: ["#1 in Offensive Rebounding", "Strong home record (27-14)", "Brunson averaging 35+ PPG in playoffs", "76ers' inconsistent role player performance"],
            keyNegatives: ["Joel Embiid's dominant presence", "76ers have a higher ceiling when fully clicking"],
            confidenceBreakdown: [
                { model: 'XGBoost', weight: 45, color: 'bg-green-500'}, { model: 'LSTM Network', weight: 30, color: 'bg-sky-500'}, { model: 'Graph Network', weight: 20, color: 'bg-purple-500'}, { model: 'Bayesian Net', weight: 5, color: 'bg-amber-500'},
            ],
            expectedValue: 9.9,
            kellyStakePercentage: 3.2,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 80, significantOddsMovement: true },
            riskLevel: RiskLevel.Conservative,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'All data points available.' },
                { step: 'Model Agreement', status: 'pass', reason: 'All models favor the Knicks at home.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 9.9%, providing solid value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "The New York media is buzzing about the electric atmosphere at Madison Square Garden. Reports suggest Embiid is still not 100% healthy, which could be a major factor.",
                socialMediaKeywords: ["#NewYorkForever", "NBAPlayoffs", "Brunson", "MSG"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "Sportradar", status: DataSourceStatus.PreMatch, metrics: [{name: "Offensive Rebound %", value: "32.5% (1st)"}, {name: "Pace", value: "95.8 (30th)"}, {name: "Opponent TOV %", value: "14.1% (5th)"}] },
                 { category: "Live Odds & Market", provider: "Bet365 API", status: DataSourceStatus.PreMatch, metrics: [{name: "Opening Line", value: "-2.5"}, {name: "Current Line", value: "-3.0"}, {name: "Public Bets %", value: "80% on Knicks"}] },
                 { category: "Injury Reports", provider: "ESPN Feeds", status: DataSourceStatus.PreMatch, metrics: [{name: "Knicks Status", value: "Healthy"}, {name: "76ers Status", value: "Embiid (Questionable)"}, {name: "Key Impact", value: "Very High"}] }
            ]
        }
    },
    { 
        id: "l1-psg-lyo",
        sport: "Soccer",
        teamA: "PSG", 
        teamAId: 85,
        teamB: "Lyon", 
        teamBId: 84,
        league: "Ligue 1", 
        matchDate: formatDate(dayAfter),
        prediction: "PSG -1.5", 
        marketType: "Handicap",
        confidence: ConfidenceTier.Medium, 
        odds: 2.00, 
        reasoning: "The AI notes Lyon's poor defensive record on the road against top teams. With Mbappé in a Golden Boot race, PSG's potent attack at home is expected to overwhelm them.",
        stadium: "Parc des Princes",
        referee: "Clément Turpin",
        aiAnalysis: {
            bettingAngle: "The model flags Lyon's defensive xGA (Expected Goals Against) as significantly worse on the road, creating a value opportunity on the handicap market for a potent PSG attack.",
            formAnalysis: { teamA: 'WDWWW', teamB: 'WWWWW' },
            playerAnalysis: [
                { name: 'Kylian Mbappé', team: 'A', impact: 'One of the world\'s best players, his speed and finishing are nearly unstoppable.' },
                { name: 'Alexandre Lacazette', team: 'B', impact: 'Lyon\'s veteran striker and primary goal threat.' }
            ],
            gameScenario: {
                narrative: "PSG will dominate the ball and territory, creating waves of attacks. Lyon will defend deep and look to hit on the counter. An early goal for PSG could open the floodgates. While Lyon may get a goal, PSG's offensive pressure is expected to be too much over 90 minutes, leading to a multi-goal victory.",
                scorePrediction: "3-1",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Kylian Mbappé is highly likely to score or assist.' },
                    { eventType: 'Pace Change', likelihood: 'Medium', description: 'A second-half substitution for PSG could inject new energy and lead to late goals.' },
                ]
            },
            keyPositives: ["Unmatched offensive firepower", "Strong record at Parc des Princes", "Mbappé in Golden Boot race", "Lyon's defense struggles against top-tier attacks"],
            keyNegatives: ["Lyon is one of the form teams in Europe", "PSG can be complacent in the league"],
            confidenceBreakdown: [
                { model: 'XGBoost', weight: 40, color: 'bg-green-500'}, { model: 'LSTM Network', weight: 25, color: 'bg-sky-500'}, { model: 'Graph Network', weight: 25, color: 'bg-purple-500'}, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500'},
            ],
            expectedValue: 8.5,
            kellyStakePercentage: 2.4,
            marketInsights: { sharpMoneyAlignment: false, publicBettingPercentage: 72, significantOddsMovement: false },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'All API data points available.' },
                { step: 'Model Agreement', status: 'pass', reason: 'Consensus on a PSG win by 2+ goals.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 8.5%, exceeding threshold.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Neutral,
                newsSummary: "French media is curious to see if Lyon's form can challenge the Parisian giants. Luis Enrique has confirmed a full-strength squad will be available for the match.",
                socialMediaKeywords: ["#PSGOL", "IciCestParis", "Mbappe", "Ligue1"]
            },
            dataSources: [
                 { category: "Team & Player Stats", provider: "StatsPerform", status: DataSourceStatus.PreMatch, metrics: [{name: "Goals For (L5)", value: "14 - 12"}, {name: "Key Player Form", value: "Mbappé (5 goals)"}, {name: "H2H (Last 3)", value: "PSG 2W-1L"}] },
                 { category: "Live Odds & Market", provider: "OddsAPI.io", status: DataSourceStatus.PreMatch, metrics: [{name: "Market Consensus", value: "PSG (72%)"}, {name: "Value Indicator", value: "Positive"}, {name: "Odds Drift", value: "-1.1%"}] },
                 { category: "News & Sentiment", provider: "Twitter API", status: DataSourceStatus.Live, metrics: [{name: "Fan Sentiment", value: "Strongly Pro-PSG"}, {name: "Trending Hashtags", value: "#IciCestParis"}, {name: "Injury Rumors", value: "None"}] }
            ]
        }
    },
     {
        id: "nhl-bos-tor",
        sport: "Hockey",
        teamA: "Boston Bruins",
        teamAId: 101,
        teamB: "Toronto Maple Leafs",
        teamBId: 102,
        league: "NHL Playoffs",
        matchDate: formatDate(dayAfter),
        prediction: "Under 6.5 Goals",
        marketType: "Total Goals",
        confidence: ConfidenceTier.High,
        odds: 1.95,
        reasoning: "Historical H2H playoff data shows these teams play tight, defensive games. With two Vezina-caliber goalies in net, the AI strongly projects a low-scoring affair.",
        stadium: "TD Garden",
        attendance: 17850,
        aiAnalysis: {
            bettingAngle: "The AI's historical analysis of playoff games between two top-10 defensive teams shows a 78% probability of the 'Under' hitting, making this a strong value play.",
            formAnalysis: { teamA: 'WLWWL', teamB: 'LWLWL' },
            playerAnalysis: [
                { name: 'David Pastrnak', team: 'A', impact: 'Elite goalscorer for the Bruins, can change the game with a single shot.' },
                { name: 'Auston Matthews', team: 'B', impact: 'The NHL\'s top goalscorer, a constant threat on the ice.' }
            ],
            gameScenario: {
                narrative: "Expect a tight-checking, defense-first affair with limited high-danger scoring chances. Both goalies will be sharp. The game will be won or lost on special teams, with power plays being the most likely source of goals. A one-goal game heading into the final minutes is highly probable.",
                scorePrediction: "3-2",
                keyEvents: [
                    { eventType: 'Key Score', likelihood: 'Medium', description: 'A power-play goal will be critical and could decide the outcome.' },
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Both goaltenders are expected to make over 30 saves.' },
                    { eventType: 'Discipline', likelihood: 'High', description: 'Playoff intensity will lead to multiple penalties for both teams.' }
                ]
            },
            keyPositives: ["Both teams have Vezina-caliber goalies", "Playoff games are typically lower scoring", "Strong penalty kill units for both teams", "Focus on defensive structure in team systems"],
            keyNegatives: ["Elite offensive talent on both sides (Pastrnak, Matthews)", "Power plays can break games open"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 50, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 25, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 15, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 10.1,
            kellyStakePercentage: 3.3,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 60, significantOddsMovement: true },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'Complete player and team data available.' },
                { step: 'Model Agreement', status: 'pass', reason: 'High consensus on a low-scoring game.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 10.1%, good value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Neutral,
                newsSummary: "Hockey analysts are predicting a 'goaltending duel'. Both coaches have emphasized 'defensive responsibility' in their recent media availability.",
                socialMediaKeywords: ["#StanleyCup", "#NHLBruins", "#LeafsForever", "GoaltendingDuel"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "Sportradar", status: DataSourceStatus.PreMatch, metrics: [{name: "GAA (Goals Against Avg)", value: "2.25 (2nd) - 2.65 (7th)"}, {name: "Penalty Kill %", value: "87.3% (1st) - 84.1% (5th)"}, {name: "Team Save %", value: ".925 - .918"}] },
                 { category: "Live Odds & Market", provider: "OddsAPI.io", status: DataSourceStatus.PreMatch, metrics: [{name: "Total Line Move", value: "7.0 -> 6.5"}, {name: "Public % on Under", value: "60%"}, {name: "Sharp Money", value: "Heavy on Under"}] },
                 { category: "Injury Reports", provider: "TheSportsDB", status: DataSourceStatus.PreMatch, metrics: [{name: "Bruins Status", value: "Healthy"}, {name: "Leafs Status", value: "Nylander (Probable)"}, {name: "Key Impact", value: "Medium"}] }
            ]
        }
    },
    {
        id: "nfl-sf-gb",
        sport: "American Football",
        teamA: "San Francisco 49ers",
        teamAId: 201,
        teamB: "Green Bay Packers",
        teamBId: 202,
        league: "NFL",
        matchDate: formatDate(threeDaysOut),
        prediction: "49ers -6.5",
        marketType: "Handicap",
        confidence: ConfidenceTier.High,
        odds: 1.91,
        reasoning: "The AI's trench analysis gives the 49ers a significant edge. The impact of their home venue, Levi's Stadium, combined with McCaffrey's form, points to them covering the spread.",
        stadium: "Levi's Stadium",
        attendance: 71000,
        aiAnalysis: {
            bettingAngle: "The AI's trench warfare model gives the 49ers a 9.5-point advantage based on offensive and defensive line metrics alone, indicating significant value on the -6.5 spread.",
            formAnalysis: { teamA: 'WWWLW', teamB: 'WWWLW' },
            playerAnalysis: [
                { name: 'Christian McCaffrey', team: 'A', impact: 'The most versatile offensive weapon in the NFL; his health is paramount.' },
                { name: 'Jordan Love', team: 'B', impact: 'A rapidly developing young QB who showed elite potential late in the season.' }
            ],
            gameScenario: {
                narrative: "The 49ers will establish their running game early, controlling the clock and wearing down the Packers' defense. Green Bay will be forced to be more one-dimensional, allowing the 49ers' pass rush to create pressure. A key turnover forced by the SF defense in the second half is predicted to be the game-changing moment, allowing them to pull away and cover the spread.",
                scorePrediction: "27-17",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Christian McCaffrey is projected for over 100 all-purpose yards and a touchdown.' },
                    { eventType: 'Turnover', likelihood: 'Medium', description: 'The 49ers defense is likely to force at least one interception from Jordan Love.' },
                    { eventType: 'Key Score', likelihood: 'High', description: 'A rushing touchdown from the 49ers is a very high probability event.' }
                ]
            },
            keyPositives: ["#1 ranked rushing offense", "Top 3 defense by DVOA", "Multiple All-Pro players", "Home-field advantage at Levi's Stadium"],
            keyNegatives: ["Jordan Love's impressive development", "Packers' talented young receiving corps"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 55, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 20, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 15, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 11.8,
            kellyStakePercentage: 3.7,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 78, significantOddsMovement: false },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'Full team and player stats used.' },
                { step: 'Model Agreement', status: 'pass', reason: 'Strong consensus on the 49ers covering the spread.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 11.8%, exceeds threshold.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "Analysts are heavily favoring the 49ers' experience and roster depth. The health of Christian McCaffrey has been confirmed, boosting confidence.",
                socialMediaKeywords: ["#FTTB", "#GoPackGo", "NFL", "McCaffrey"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "Sportradar", status: DataSourceStatus.PreMatch, metrics: [{name: "Rush Yards/Game", value: "145.5 (1st) - 110.2 (15th)"}, {name: "Defensive DVOA", value: "3rd - 14th"}, {name: "Turnover Diff.", value: "+10 - +3"}] },
                 { category: "Live Odds & Market", provider: "OddsAPI.io", status: DataSourceStatus.PreMatch, metrics: [{name: "Line Move", value: "SF -5.5 -> SF -6.5"}, {name: "Public %", value: "78% on 49ers"}, {name: "Sharp Money", value: "Aligned with public"}] },
                 { category: "Weather", provider: "OpenWeatherMap", status: DataSourceStatus.PreMatch, metrics: [{name: "Forecast", value: "Sunny"}, {name: "Temp", value: "18°C"}, {name: "Wind", value: "10 km/h"}] }
            ]
        }
    },
    {
        id: "wta-swi-sab",
        sport: "Tennis",
        teamA: "Iga Swiatek",
        teamAId: 301,
        teamB: "Aryna Sabalenka",
        teamBId: 302,
        league: "WTA Madrid - Final",
        matchDate: formatDate(fourDaysOut),
        prediction: "Swiatek to Win 2-0",
        marketType: "Set Betting",
        confidence: ConfidenceTier.Medium,
        odds: 2.50,
        reasoning: "Swiatek's historical dominance on clay (88% win rate) and her 3-0 H2H record against Sabalenka on this surface are key factors. The AI predicts her return game will neutralize Sabalenka's power.",
        stadium: "Manolo Santana Stadium",
        aiAnalysis: {
            bettingAngle: "The AI's surface-specific model highlights Swiatek's return-of-serve statistics on clay against top-10 opponents, which project a high probability of breaking serve multiple times per set.",
            formAnalysis: { teamA: 'WWWWW', teamB: 'WWWWW' },
            playerAnalysis: [
                { name: 'Iga Swiatek', team: 'A', impact: 'The undisputed "Queen of Clay," her movement and consistency are unmatched on this surface.' },
                { name: 'Aryna Sabalenka', team: 'B', impact: 'Possesses immense power that can overwhelm any opponent if her game is firing.' }
            ],
            gameScenario: {
                narrative: "Swiatek will use her superior movement and heavy topspin to extend rallies and force errors from Sabalenka. Sabalenka's only path to victory is to keep points short with her powerful groundstrokes and first serve. The first set will be crucial; if Swiatek wins it, Sabalenka's unforced error count is likely to increase dramatically in the second.",
                scorePrediction: "2-0 Sets",
                keyEvents: [
                    { eventType: 'Turnover', likelihood: 'High', description: 'Swiatek is expected to generate multiple break point opportunities per set.' },
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Sabalenka\'s first serve percentage will be the most critical factor in her success.' },
                    { eventType: 'Pace Change', likelihood: 'Medium', description: 'A long, grueling rally won by Swiatek could cause a significant momentum shift.' }
                ]
            },
            keyPositives: ["Unmatched record on clay courts", "Excellent return game against big servers", "Superior movement and defense", "Mental edge in recent H2H matches"],
            keyNegatives: ["Sabalenka's raw power can be overwhelming", "Risk of a close three-set match"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 40, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 25, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 25, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 15.2,
            kellyStakePercentage: 2.9,
            marketInsights: { sharpMoneyAlignment: false, publicBettingPercentage: 55, significantOddsMovement: false },
            riskLevel: RiskLevel.Aggressive,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'All game data from current season analyzed.' },
                { step: 'Model Agreement', status: 'pass', reason: 'Models favor Swiatek, with a high chance of 2-0.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 15.2%, excellent value on the set score.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
             sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "Tennis experts are lauding Swiatek's clay-court prowess. Sabalenka mentioned in an interview that she needs to 'play perfect tennis' to win.",
                socialMediaKeywords: ["#WTA", "#MadridOpen", "ClayCourtQueen", "Tennis"]
            },
            dataSources: [
                 { category: "Player Stats", provider: "DataSportsGroup", status: DataSourceStatus.PreMatch, metrics: [{name: "Win % on Clay (Career)", value: "88% - 65%"}, {name: "Return Pts Won %", value: "48% - 41%"}, {name: "H2H on Clay", value: "3-0 Swiatek"}] },
                 { category: "Live Odds & Market", provider: "OddsAPI.io", status: DataSourceStatus.PreMatch, metrics: [{name: "Moneyline", value: "1.50 Swiatek"}, {name: "Implied Prob. (2-0)", value: "40.0%"}, {name: "Value", value: "Yes"}] },
                 { category: "Player Form", provider: "TheSportsDB", status: DataSourceStatus.PreMatch, metrics: [{name: "Swiatek Form (L5)", value: "WWWWW"}, {name: "Sabalenka Form (L5)", value: "WWWWW"}, {name: "Sets Dropped (Tourn.)", value: "0 - 2"}] }
            ]
        }
    },
    {
        id: "f1-ver-mon",
        sport: "Motorsport",
        teamA: "Max Verstappen",
        teamAId: 401,
        teamB: "Monaco GP",
        teamBId: 999,
        league: "Formula 1",
        matchDate: formatDate(fiveDaysOut),
        prediction: "Verstappen to Win",
        marketType: "Race Winner",
        confidence: ConfidenceTier.High,
        odds: 1.50,
        reasoning: "The AI's simulation highlights Verstappen's mastery of this specific circuit and the car's superior low-speed cornering. Historical data shows pole position here is critical, which the AI heavily favors him to achieve.",
        stadium: "Circuit de Monaco",
        aiAnalysis: {
            bettingAngle: "AI simulation of qualifying laps based on car setup and historical driver performance at Monaco gives Verstappen an 85% chance of securing pole position, which translates to a 70% win probability.",
            formAnalysis: { teamA: 'WWWWW', teamB: 'WWWWW' }, // Form can represent last 5 races
            playerAnalysis: [
                { name: 'Max Verstappen', team: 'A', impact: 'Arguably the most talented driver on the grid, excels at high-pressure street circuits.' },
                { name: 'Charles Leclerc', team: 'B', impact: 'Known for his incredible qualifying speed, especially at his home race in Monaco, but has been notoriously unlucky.' }
            ],
            gameScenario: {
                narrative: "The race will be decided in Saturday's qualifying. If Verstappen secures pole, he will control the race from the front. Overtaking is nearly impossible, so strategy will revolve around the single pit stop. The biggest threat to a clean race is a mistake leading to a crash and a safety car, which can dramatically alter the outcome. Expect a processional race led by the pole-sitter.",
                keyEvents: [
                    { eventType: 'Pace Change', likelihood: 'High', description: 'A Safety Car deployment is highly probable, which could shuffle the race order.' },
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Verstappen\'s performance in Qualifying is the single most important factor.' },
                    { eventType: 'Discipline', likelihood: 'Medium', description: 'A driver error leading to a crash is a constant threat on the narrow streets.' }
                ]
            },
            keyPositives: ["Driver's excellent track record at Monaco", "Car's strength in low-speed corners", "Team's strategic excellence", "Proven performance under pressure"],
            keyNegatives: ["Qualifying is critical; one mistake can ruin the race", "High chance of safety cars creating chaos"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 60, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 20, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 15, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 5, color: 'bg-amber-500' }],
            expectedValue: 8.9,
            kellyStakePercentage: 3.1,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 85, significantOddsMovement: false },
            riskLevel: RiskLevel.Conservative,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'All telemetry and historical data processed.' },
                { step: 'Model Agreement', status: 'pass', reason: 'Models overwhelmingly agree on Verstappen win.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 8.9% despite low odds.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
             sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "F1 pundits see it as 'Max's race to lose'. The Red Bull team principal is confident in their car's setup for the unique demands of Monaco.",
                socialMediaKeywords: ["#F1", "#MonacoGP", "Verstappen", "RedBullRacing"]
            },
             dataSources: [
                 { category: "Car Performance", provider: "Sportradar", status: DataSourceStatus.PreMatch, metrics: [{name: "Low-Speed Cornering", value: "A+"}, {name: "Tyre Deg (Soft)", value: "Low"}, {name: "Strategy Rating", value: "A+"}] },
                 { category: "Live Odds & Market", provider: "Betfair Exchange", status: DataSourceStatus.PreMatch, metrics: [{name: "Market Volume", value: "$450k"}, {name: "Implied Prob.", value: "66.7%"}, {name: "Sharp Money", value: "Heavy on Verstappen"}] },
                 { category: "Weather", provider: "OpenWeatherMap", status: DataSourceStatus.PreMatch, metrics: [{name: "Forecast", value: "Partly Cloudy"}, {name: "Temp", value: "22°C"}, {name: "Chance of Rain", value: "15%"}] }
            ]
        }
    },
    {
        id: "sa-juv-rom",
        sport: "Soccer",
        teamA: "Juventus",
        teamAId: 502,
        teamB: "AS Roma",
        teamBId: 505,
        league: "Serie A",
        matchDate: formatDate(fiveDaysOut),
        prediction: "Under 2.5 Goals",
        marketType: "Total Goals",
        confidence: ConfidenceTier.High,
        odds: 1.80,
        reasoning: "Historical H2H data reveals notoriously tight, low-scoring matches. The AI also factors in the specific referee's tendency for conservative games, strongly indicating an 'Under 2.5 Goals' outcome.",
        stadium: "Allianz Stadium",
        referee: "Daniele Orsato",
        attendance: 41000,
        aiAnalysis: {
            bettingAngle: "Historical data for matchups refereed by Daniele Orsato shows a 20% decrease in goals scored compared to the league average, favoring a low-scoring outcome.",
            formAnalysis: { teamA: 'DLDDW', teamB: 'WDLDW' },
            playerAnalysis: [
                { name: 'Dusan Vlahovic', team: 'A', impact: 'Juventus\' leading scorer, a physical presence who can score from half-chances.' },
                { name: 'Paulo Dybala', team: 'B', impact: 'Roma\'s creative hub, returning to face his former team.' }
            ],
            gameScenario: {
                narrative: "This will be a tactical chess match with both teams prioritizing defensive shape. Juventus will control possession but struggle to break down Roma's organized defense. Roma will look to counter-attack through Dybala. Chances will be few and far between, and a single goal, likely from a set-piece or an individual moment of brilliance, could decide the entire match.",
                scorePrediction: "1-0",
                keyEvents: [
                    { eventType: 'Discipline', likelihood: 'Medium', description: 'Expect a high number of yellow cards as both teams are physical.' },
                    { eventType: 'Key Score', likelihood: 'Low', description: 'The first goal, if it comes, will likely be from a set piece.' },
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Paulo Dybala will be the most creative player on the pitch.' }
                ]
            },
            keyPositives: ["Both teams in Top 5 for Goals Conceded", "Juventus games average 1.9 goals", "Roma's defensive setup away from home", "Historically a tight, low-scoring fixture"],
            keyNegatives: ["Both teams have potent attackers (Vlahovic, Dybala)", "An early goal could open the game up"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 60, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 20, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 10, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 12.3,
            kellyStakePercentage: 4.1,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 75, significantOddsMovement: false },
            riskLevel: RiskLevel.Conservative,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'Complete H2H and current form data.' },
                { step: 'Model Agreement', status: 'pass', reason: 'Very strong consensus for a low-scoring game.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 12.3%, high value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Neutral,
                newsSummary: "Italian media is billing this as a 'tactical chess match'. Both managers have stressed the importance of defensive solidity in their press conferences.",
                socialMediaKeywords: ["#SerieA", "#JuveRoma", "Catenaccio", "Tactics"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "StatsPerform", status: DataSourceStatus.PreMatch, metrics: [{name: "Goals Conceded/Game", value: "0.7 - 0.9"}, {name: "xGA (Expected Goals Against)", value: "0.8 - 1.0"}, {name: "Clean Sheets", value: "15 - 12"}] },
                 { category: "Live Odds & Market", provider: "OddsAPI.io", status: DataSourceStatus.PreMatch, metrics: [{name: "Total Line", value: "2.5"}, {name: "Market Consensus", value: "75% on Under"}, {name: "Implied Prob.", value: "55.6%"}] },
                 { category: "Injury Reports", provider: "TheSportsDB", status: DataSourceStatus.PreMatch, metrics: [{name: "Juventus Status", value: "Healthy"}, {name: "Roma Status", value: "Smalling (Out)"}, {name: "Impact", value: "Medium"}] }
            ]
        }
    },
    {
        id: "ufc-per-pro",
        sport: "MMA",
        teamA: "Alex Pereira",
        teamAId: 601,
        teamB: "Jiri Prochazka",
        teamBId: 602,
        league: "UFC",
        matchDate: formatDate(sixDaysOut),
        prediction: "Fight to NOT go the distance",
        marketType: "Fight Outcome",
        confidence: ConfidenceTier.High,
        odds: 1.45,
        reasoning: "The AI's stylistic analysis flags this as a high-volatility matchup. With a combined 90% finish rate and Pereira's one-punch power, a finish inside the distance is the highest probability outcome.",
        stadium: "T-Mobile Arena",
        aiAnalysis: {
            bettingAngle: "The AI model that analyzes fighter styles gives this matchup a 92% 'volatility' score, meaning a fight-ending sequence is highly probable due to the clash of Pereira's counter-striking and Prochazka's chaotic pressure.",
            formAnalysis: { teamA: 'WWLWW', teamB: 'WLWWW' },
            playerAnalysis: [
                { name: 'Alex Pereira', team: 'A', impact: 'Arguably the most powerful striker in UFC history, with devastating leg kicks and a left hook.' },
                { name: 'Jiri Prochazka', team: 'B', impact: 'An unpredictable and highly aggressive fighter who has finished nearly all of his opponents.' }
            ],
            gameScenario: {
                narrative: "This fight will be explosive from the opening bell. Prochazka will bring relentless, unorthodox pressure, while Pereira will look to counter with his devastating power. It's a clash of styles that is highly unlikely to last long. The first two rounds are the most dangerous, with a high probability of a knockdown or a knockout for either fighter. Do not expect a technical, drawn-out fight.",
                keyEvents: [
                    { eventType: 'Key Score', likelihood: 'High', description: 'A knockout or TKO finish is the most likely outcome.' },
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Pereira\'s left hook and Prochazka\'s pressure will define the fight.' },
                    { eventType: 'Injury', likelihood: 'Medium', description: 'High risk of cuts or significant damage due to the aggressive styles.' }
                ]
            },
            keyPositives: ["Combined 90% finish rate for both fighters", "Pereira's one-punch knockout power", "Prochazka's chaotic, high-risk style", "Both fighters have shown defensive vulnerabilities"],
            keyNegatives: ["A strategic, cautious approach could prolong the fight", "Both have durable chins"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 65, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 15, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 10, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 15.5,
            kellyStakePercentage: 4.9,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 92, significantOddsMovement: false },
            riskLevel: RiskLevel.Conservative,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'Full fight history and stats for both fighters.' },
                { step: 'Model Agreement', status: 'pass', reason: 'Overwhelming consensus that the fight ends early.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 15.5%, strong value even at low odds.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "MMA media is marketing this fight as a guaranteed 'banger'. Both fighters have promised to look for the finish in interviews. Dana White called it a 'Fight of the Year contender'.",
                socialMediaKeywords: ["#UFC306", "KO", "Poatan", "BJP", "Violence"]
            },
            dataSources: [
                 { category: "Fighter Stats", provider: "DataSportsGroup", status: DataSourceStatus.PreMatch, metrics: [{name: "Finish Rate", value: "88% - 93%"}, {name: "KOs", value: "7 - 13"}, {name: "Sig. Strikes/Min", value: "5.1 - 5.8"}] },
                 { category: "Live Odds & Market", provider: "OddsAPI.io", status: DataSourceStatus.PreMatch, metrics: [{name: "Moneyline", value: "-160 Pereira"}, {name: "Goes Distance Odds", value: "+250 Yes"}, {name: "Implied Prob. (No)", value: "69.0%"}] },
                 { category: "Social Media", provider: "Twitter API", status: DataSourceStatus.Live, metrics: [{name: "Fan Sentiment", value: "Explosion Emoji"}, {name: "Training Buzz", value: "High"}, {name: "Analyst Picks", value: "Split on winner, unified on finish"}] }
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
    userSettings: UserSettings;
}> => {
    console.log("API: Fetching initial data...");
    await new Promise(res => setTimeout(res, 1200)); // Simulate network latency

    const preMatch = mockPredictions.slice(2);
    const liveMatches: LiveMatchPrediction[] = mockPredictions.slice(0, 2).map((p, index) => ({
        ...p,
        scoreA: index === 0 ? 1 : 48, // Arsenal 1-0 Spurs, Nuggets 48-45 Wolves
        scoreB: index === 0 ? 0 : 45,
        matchTime: index === 0 ? 35 : 24, // 35th minute soccer, 24 mins basketball (end of 2Q)
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
        userSettings: { ...userSettingsDB },
    };
};

/**
 * Simulates fetching head-to-head data for two teams.
 */
export const fetchHeadToHead = async (teamAId: number, teamBId: number): Promise<HeadToHeadFixture[]> => {
    console.log(`API: Fetching H2H data for team IDs ${teamAId} vs ${teamBId}...`);
    await new Promise(res => setTimeout(res, 800)); // Simulate network latency

    // Only return mock data for a specific matchup for this demo (Arsenal vs Tottenham)
    if ((teamAId === 42 && teamBId === 47) || (teamAId === 47 && teamBId === 42)) {
        return [
            { fixtureId: 12345, date: "2024-03-03", homeTeam: "Arsenal", awayTeam: "Tottenham Hotspur", goals: { home: 3, away: 1 } },
            { fixtureId: 12346, date: "2023-10-28", homeTeam: "Tottenham Hotspur", awayTeam: "Arsenal", goals: { home: 2, away: 2 } },
            { fixtureId: 12347, date: "2023-01-15", homeTeam: "Tottenham Hotspur", awayTeam: "Arsenal", goals: { home: 0, away: 2 } },
            { fixtureId: 12348, date: "2022-09-01", homeTeam: "Arsenal", awayTeam: "Tottenham Hotspur", goals: { home: 3, away: 1 } },
            { fixtureId: 12349, date: "2022-05-12", homeTeam: "Tottenham Hotspur", awayTeam: "Arsenal", goals: { home: 3, away: 0 } },
        ];
    }
    
    // Return empty array for other matchups to simulate no data available
    return [];
};


/**
 * Simulates placing a bet and adding it to the user's history.
 */
export const placeBet = async (prediction: MatchPrediction, stake: number, selections?: MatchPrediction[]): Promise<{ updatedBankroll: BankrollState, newBet: UserBet }> => {
    console.log(`API: Placing bet of $${stake} on ${prediction.prediction}`);
    
    // Responsible Gambling Checks
    if (stake > userSettingsDB.maxStakePerBet) {
        throw new Error(`Your stake of $${stake.toFixed(2)} exceeds your max stake per bet limit of $${userSettingsDB.maxStakePerBet.toFixed(2)}.`);
    }
    if ((bankrollDB.dailyWagered + stake) > userSettingsDB.maxDailyStake) {
         throw new Error(`This bet would exceed your daily wager limit of $${userSettingsDB.maxDailyStake.toFixed(2)}.`);
    }

    await new Promise(res => setTimeout(res, 500)); 

    bankrollDB.current -= stake;
    bankrollDB.totalWagered += stake;
    bankrollDB.dailyWagered += stake;

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
    
    // Don't settle already-settled bets
    if (bet.status !== 'pending') {
        return { updatedBankroll: { ...bankrollDB }, settledBet: bet };
    }

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
 * Simulates cashing out a bet at a given value.
 */
export const cashOutBet = async (betId: string, cashOutValue: number): Promise<{ updatedBankroll: BankrollState, cashedOutBet: UserBet }> => {
    console.log(`API: Cashing out bet ${betId} for $${cashOutValue}`);
    await new Promise(res => setTimeout(res, 400));

    const betIndex = userBetsDB.findIndex(b => b.id === betId);
    if (betIndex === -1) {
        throw new Error("Bet not found to cash out");
    }
    
    const bet = userBetsDB[betIndex];
    if (bet.status !== 'pending') {
        throw new Error("Only pending bets can be cashed out");
    }
    
    bankrollDB.current += cashOutValue;
    bankrollDB.totalReturned += cashOutValue;
    
    const cashedOutBet: UserBet = {
        ...bet,
        status: 'cashed-out',
        payout: cashOutValue,
        cashedOutAmount: cashOutValue,
    };
    
    userBetsDB[betIndex] = cashedOutBet;
    
    return { updatedBankroll: { ...bankrollDB }, cashedOutBet };
}


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
        dailyWagered: 0,
    };
    userBetsDB = []; // Clear history on bankroll reset

    return { updatedBankroll: { ...bankrollDB }, clearedBets: [] };
};

/**
 * Simulates updating user settings for responsible gambling.
 */
export const updateUserSettings = async (newSettings: UserSettings): Promise<UserSettings> => {
    console.log("API: Updating user settings:", newSettings);
    await new Promise(res => setTimeout(res, 300));
    userSettingsDB = { ...newSettings };
    return { ...userSettingsDB };
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
                { prediction: { ...parlayBets[0], prediction: `${parlayBets.length}-Leg Parlay`, odds: parlayOdds, teamA: 'Parlay', teamB: 'Ticket', id: 'parlay-ticket', sport: 'Multiple', marketType: 'Parlay', teamAId: 0, teamBId: 0 }, stake: totalStake * 0.3 }
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
        bets: [{ prediction: { ...selections[0], prediction: `${selections.length}-Leg Parlay`, odds: parlayOdds, teamA: 'Parlay', teamB: 'Ticket', id: 'parlay-ticket', sport: 'Multiple', marketType: 'Parlay', teamAId: 0, teamBId: 0 }, stake: totalStake }],
        totalStake: totalStake,
        potentialReturn: totalStake * parlayOdds,
        winProbability: 25, // Lower chance but higher payout
        totalEV: (Math.pow(1 + (totalEV/100), selections.length) -1) * 100, // Compound EV
    });

    return variations;
};