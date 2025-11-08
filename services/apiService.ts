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
const sevenDaysOut = new Date(today);
sevenDaysOut.setDate(sevenDaysOut.getDate() + 7);
const eightDaysOut = new Date(today);
eightDaysOut.setDate(eightDaysOut.getDate() + 8);
const nineDaysOut = new Date(today);
nineDaysOut.setDate(nineDaysOut.getDate() + 9);
const tenDaysOut = new Date(today);
tenDaysOut.setDate(tenDaysOut.getDate() + 10);
const elevenDaysOut = new Date(today);
elevenDaysOut.setDate(elevenDaysOut.getDate() + 11);
const twelveDaysOut = new Date(today);
twelveDaysOut.setDate(twelveDaysOut.getDate() + 12);
const thirteenDaysOut = new Date(today);
thirteenDaysOut.setDate(thirteenDaysOut.getDate() + 13);
const fourteenDaysOut = new Date(today);
fourteenDaysOut.setDate(fourteenDaysOut.getDate() + 14);
const fifteenDaysOut = new Date(today);
fifteenDaysOut.setDate(fifteenDaysOut.getDate() + 15);
const sixteenDaysOut = new Date(today);
sixteenDaysOut.setDate(sixteenDaysOut.getDate() + 16);
const seventeenDaysOut = new Date(today);
seventeenDaysOut.setDate(seventeenDaysOut.getDate() + 17);
const eighteenDaysOut = new Date(today);
eighteenDaysOut.setDate(eighteenDaysOut.getDate() + 18);
const nineteenDaysOut = new Date(today);
nineteenDaysOut.setDate(nineteenDaysOut.getDate() + 19);
const twentyDaysOut = new Date(today);
twentyDaysOut.setDate(twentyDaysOut.getDate() + 20);
const twentyOneDaysOut = new Date(today);
twentyOneDaysOut.setDate(twentyOneDaysOut.getDate() + 21);
const twentyTwoDaysOut = new Date(today);
twentyTwoDaysOut.setDate(twentyTwoDaysOut.getDate() + 22);
const twentyThreeDaysOut = new Date(today);
twentyThreeDaysOut.setDate(twentyThreeDaysOut.getDate() + 23);
const twentyFourDaysOut = new Date(today);
twentyFourDaysOut.setDate(twentyFourDaysOut.getDate() + 24);
const twentyFiveDaysOut = new Date(today);
twentyFiveDaysOut.setDate(twentyFiveDaysOut.getDate() + 25);
const twentySixDaysOut = new Date(today);
twentySixDaysOut.setDate(twentySixDaysOut.getDate() + 26);
const twentySevenDaysOut = new Date(today);
twentySevenDaysOut.setDate(twentySevenDaysOut.getDate() + 27);
const twentyEightDaysOut = new Date(today);
twentyEightDaysOut.setDate(twentyEightDaysOut.getDate() + 28);
const twentyNineDaysOut = new Date(today);
twentyNineDaysOut.setDate(twentyNineDaysOut.getDate() + 29);
const thirtyDaysOut = new Date(today);
thirtyDaysOut.setDate(thirtyDaysOut.getDate() + 30);


const formatDate = (date: Date) => date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// Helper to calculate estimated win probability from EV and odds for data consistency
const calculateProbFromEV = (evPercentage: number, odds: number): number => {
  if (odds <= 0) return 0;
  // Formula derived from EV = (P_win * (Odds - 1)) - (1 - P_win)
  // P_win = (EV_decimal + 1) / Odds
  const evDecimal = evPercentage / 100;
  return (evDecimal + 1) / odds;
};


// DATA REFRESH: Massively expanded the sports and leagues to provide a global feel.
const rawPredictions = [
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
            statisticalProfile: {
                teamA: { avgGoalsScored: 2.4, avgGoalsConceded: 0.8, daysSinceLastMatch: 7 },
                teamB: { avgGoalsScored: 1.9, avgGoalsConceded: 1.4, daysSinceLastMatch: 8 }
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
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 114.9, avgGoalsConceded: 109.6, daysSinceLastMatch: 3 },
                teamB: { avgGoalsScored: 113.0, avgGoalsConceded: 106.5, daysSinceLastMatch: 2 }
            },
            keyPositives: ["Jokic's high assist-to-turnover ratio", "Strong home-court advantage at altitude", "Experience in playoff situations", "Better team offensive rating"],
            keyNegatives: ["Timberwolves' #1 ranked defense", "Anthony Edwards' explosive scoring ability", "Nuggets' occasional defensive lapses"],
            confidenceBreakdown: [
                { model: 'XGBoost', weight: 35, color: 'bg-green-500'}, { model: 'LSTM Network', weight: 30, color: 'bg-sky-500'}, { model: 'Graph Network', weight: 25, color: 'bg-purple-500'}, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500'},
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
        id: "laliga-rm-bar",
        sport: "Soccer",
        teamA: "Real Madrid", 
        teamAId: 541,
        teamB: "Barcelona", 
        teamBId: 529,
        league: "La Liga", 
        matchDate: formatDate(tomorrow),
        prediction: "Both Teams to Score", 
        marketType: "Goals",
        confidence: ConfidenceTier.High, 
        odds: 1.66, 
        reasoning: "El Clásico is famously high-scoring. The AI notes both teams are in elite attacking form but have shown defensive vulnerabilities in recent high-stakes matches.",
        stadium: "Santiago Bernabéu",
        aiAnalysis: {
            bettingAngle: "The model's analysis of 'big chances created' vs. 'big chances conceded' for both teams in their last 10 games shows a 85% probability of at least one goal for each side.",
            formAnalysis: { teamA: 'WWDWW', teamB: 'WWWWW' },
            playerAnalysis: [
                { name: 'Jude Bellingham', team: 'A', impact: 'A key goalscoring midfielder who often decides big games.' },
                { name: 'Lamine Yamal', team: 'B', impact: 'A generational young talent capable of unlocking any defense.' }
            ],
            gameScenario: {
                narrative: "A classic El Clásico with end-to-end action. Real Madrid will leverage their powerful counter-attacks, while Barcelona will try to control possession. Both defenses will be tested, and given the attacking talent on display, a clean sheet for either side is highly unlikely. Expect goals in both halves.",
                scorePrediction: "2-2",
                keyEvents: [
                    { eventType: 'Key Score', likelihood: 'High', description: 'A goal from a counter-attack is highly probable for Real Madrid.' },
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Lamine Yamal is predicted to be a constant threat on the wing for Barcelona.' },
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 2.2, avgGoalsConceded: 0.7, daysSinceLastMatch: 4 },
                teamB: { avgGoalsScored: 2.1, avgGoalsConceded: 1.1, daysSinceLastMatch: 5 }
            },
            keyPositives: ["Historically high-scoring fixture", "Both teams average over 2 goals per game", "Elite attacking talent on both sides", "Recent defensive errors from both teams"],
            keyNegatives: ["'Derby' tension can lead to cautious play", "Goalkeepers (Courtois, ter Stegen) are world-class"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 45, color: 'bg-green-500'}, { model: 'LSTM Network', weight: 30, color: 'bg-sky-500'}, { model: 'Graph Network', weight: 15, color: 'bg-purple-500'}, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500'}],
            expectedValue: 10.4,
            kellyStakePercentage: 3.5,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 88, significantOddsMovement: false },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Data Quality', status: 'pass', reason: 'Complete H2H and player form data.' },
                { step: 'Model Agreement', status: 'pass', reason: 'Strong consensus on both teams scoring.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 10.4%, providing good value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "The Spanish press is hyping up the attacking duels all over the pitch. Both managers have promised to play attacking football, befitting the fixture.",
                socialMediaKeywords: ["#ElClasico", "#HalaMadrid", "#ForçaBarça", "Bellingham"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "API-Football", status: DataSourceStatus.PreMatch, metrics: [{name: "Goals For (L5)", value: "12 - 11"}, {name: "xG (L5)", value: "11.2 - 10.1"}, {name: "Clean Sheets (L5)", value: "2 - 4"}] },
                 { category: "Odds & Market", provider: "OddsAPI.io", status: DataSourceStatus.PreMatch, metrics: [{name: "BTTS Odds", value: "1.66"}, {name: "Market Consensus", value: "88%"}, {name: "Odds Stability", value: "Stable"}] },
            ]
        }
    },
    {
        id: "bundesliga-bvb-fcb",
        sport: "Soccer",
        teamA: "Borussia Dortmund",
        teamAId: 165,
        teamB: "Bayern Munich",
        teamBId: 157,
        league: "Bundesliga",
        matchDate: formatDate(dayAfter),
        prediction: "Over 3.5 Goals",
        marketType: "Total Goals",
        confidence: ConfidenceTier.High,
        odds: 2.10,
        reasoning: "'Der Klassiker' has seen over 3.5 goals in 7 of the last 8 meetings. The AI model highlights both teams' elite attacks and vulnerabilities in defensive transitions.",
        stadium: "Signal Iduna Park",
        aiAnalysis: {
            bettingAngle: "The AI's tactical analysis identifies that both teams commit a high number of players forward, leaving them exceptionally vulnerable to counter-attacks, which historically leads to high-scoring games in this fixture.",
            formAnalysis: { teamA: 'WWLWW', teamB: 'WLWWW' },
            playerAnalysis: [
                { name: 'Jadon Sancho', team: 'A', impact: 'Dortmund\'s main creative outlet, his 1v1 ability is crucial.' },
                { name: 'Harry Kane', team: 'B', impact: 'A world-class striker enjoying a record-breaking goalscoring season in Germany.' }
            ],
            gameScenario: {
                narrative: "An explosive, high-tempo match is expected in front of the 'Yellow Wall'. Both teams will trade blows from the start. Bayern's clinical finishing versus Dortmund's rapid counter-attacks will be the key dynamic. Defenses are an afterthought in this fixture; expect a goal-fest.",
                scorePrediction: "2-3",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Harry Kane is projected to have at least one goal contribution.' },
                    { eventType: 'Pace Change', likelihood: 'High', description: 'The game will be played at a frantic pace, with numerous turnovers.' },
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 2.5, avgGoalsConceded: 1.3, daysSinceLastMatch: 7 },
                teamB: { avgGoalsScored: 3.1, avgGoalsConceded: 1.2, daysSinceLastMatch: 6 }
            },
            keyPositives: ["7 of last 8 H2H games had over 3.5 goals", "Both teams are in the top 3 for goals scored", "Bayern averages 3.2 goals/game", "Dortmund's potent home attack"],
            keyNegatives: ["'Derby' pressure can sometimes stifle games", "Both teams possess quality defenders"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 50, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 25, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 15, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 14.5,
            kellyStakePercentage: 4.1,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 85, significantOddsMovement: false },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'H2H Analysis', status: 'pass', reason: 'Strong historical trend for goals.' },
                { step: 'Model Agreement', status: 'pass', reason: 'High consensus for an open, high-scoring match.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 14.5%, excellent value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "German media anticipates another classic 'Der Klassiker'. Focus is on the Kane vs. Dortmund's defense matchup. Both coaches have dismissed the idea of a defensive approach.",
                socialMediaKeywords: ["#DerKlassiker", "#BVBFCB", "Bundesliga", "Kane"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "TheSportsDB", status: DataSourceStatus.PreMatch, metrics: [{name: "Goals For (Season)", value: "64 - 80"}, {name: "xG/90", value: "2.1 - 2.8"}, {name: "H2H Goals Avg.", value: "4.5"}] },
            ]
        }
    },
    {
        id: "cricket-mi-csk",
        sport: "Cricket",
        teamA: "Mumbai Indians",
        teamAId: 701,
        teamB: "Chennai Super Kings",
        teamBId: 702,
        league: "IPL",
        matchDate: formatDate(threeDaysOut),
        prediction: "Highest Opening Partnership - MI",
        marketType: "Team Props",
        confidence: ConfidenceTier.Medium,
        odds: 1.90,
        reasoning: "The AI's player-form analysis highlights Rohit Sharma's aggressive starts at Wankhede Stadium. CSK's opening bowlers have a higher economy rate in the powerplay compared to MI's.",
        stadium: "Wankhede Stadium",
        aiAnalysis: {
            bettingAngle: "The AI model analyzing bowler vs. batsman matchups in the powerplay overs gives MI's opening pair a 65% probability of outscoring CSK's openers before the first wicket falls.",
            formAnalysis: { teamA: 'WLWWL', teamB: 'WWLWL' },
            playerAnalysis: [
                { name: 'Rohit Sharma', team: 'A', impact: 'An explosive opening batsman, especially dangerous in the first 6 overs at his home ground.' },
                { name: 'Ruturaj Gaikwad', team: 'B', impact: 'CSK\'s classy opener, known for his consistency.' }
            ],
            gameScenario: {
                narrative: "Expect a high-scoring T20 match on a flat Wankhede pitch. Mumbai Indians will come out swinging in the powerplay, led by Rohit Sharma. Chennai will aim for a more measured start. The key to this specific bet is whether MI's openers can survive the initial two overs from Deepak Chahar.",
                scorePrediction: "MI 195/6 - CSK 180/7",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Rohit Sharma is predicted to score over 20 runs in the powerplay.' },
                    { eventType: 'Key Score', likelihood: 'Medium', description: 'A wicket in the first over is possible, but MI is favored to build a solid start.' },
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 185, avgGoalsConceded: 180, daysSinceLastMatch: 3 },
                teamB: { avgGoalsScored: 175, avgGoalsConceded: 170, daysSinceLastMatch: 4 }
            },
            keyPositives: ["Rohit Sharma's high strike rate in powerplays", "MI's aggressive opening strategy at home", "CSK's key powerplay bowler has been expensive recently", "Wankhede pitch favors batsmen early on"],
            keyNegatives: ["CSK's disciplined bowling", "An early wicket can change everything in T20s"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 40, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 30, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 20, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 7.5,
            kellyStakePercentage: 2.2,
            marketInsights: { sharpMoneyAlignment: false, publicBettingPercentage: 65, significantOddsMovement: false },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Player Matchup Analysis', status: 'pass', reason: 'MI openers have a statistical edge.' },
                { step: 'Venue Analysis', status: 'pass', reason: 'Wankhede conditions favor opening batsmen.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 7.5%, indicating value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Neutral,
                newsSummary: "Cricket pundits are calling this the 'El Clásico of the IPL'. The focus is on the star-studded batting lineups of both teams.",
                socialMediaKeywords: ["#IPL2024", "#MIvCSK", "Cricket", "RohitSharma"]
            },
            dataSources: [
                 { category: "Player Stats", provider: "Cricinfo API", status: DataSourceStatus.PreMatch, metrics: [{name: "Rohit SR (Powerplay)", value: "145.2"}, {name: "CSK Bowler Econ (PP)", value: "8.9"}, {name: "H2H Wins", value: "MI 20 - CSK 16"}] },
            ]
        }
    },
    {
        id: "rugby-fra-ire",
        sport: "Rugby",
        teamA: "France",
        teamAId: 801,
        teamB: "Ireland",
        teamBId: 802,
        league: "Six Nations",
        matchDate: formatDate(fourDaysOut),
        prediction: "France to Win",
        marketType: "Match Winner",
        confidence: ConfidenceTier.High,
        odds: 1.83,
        reasoning: "The AI gives significant weight to France's home advantage in Paris. Their powerful forward pack and the creative genius of Dupont are predicted to be the deciding factors.",
        stadium: "Stade de France",
        aiAnalysis: {
            bettingAngle: "The AI model analyzing 'gain line success rate' and 'tackle breaks' gives the French pack a decisive edge, which historically translates to a high win probability at home.",
            formAnalysis: { teamA: 'WWWLW', teamB: 'WWWWW' },
            playerAnalysis: [
                { name: 'Antoine Dupont', team: 'A', impact: 'Widely considered the best player in the world; his game management and attacking flair are unmatched.' },
                { name: 'Johnny Sexton', team: 'B', impact: 'Ireland\'s veteran fly-half, his tactical kicking and leadership are crucial.' }
            ],
            gameScenario: {
                narrative: "An immensely physical and tactical battle is expected. France will use their powerful forwards to gain dominance at the scrum and breakdown. Ireland will rely on their structured attack and Sexton's precise kicking game to control territory. The match will be decided by which team can win the physical battle and maintain discipline under pressure.",
                scorePrediction: "24-19",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Antoine Dupont will be directly involved in at least one try.' },
                    { eventType: 'Discipline', likelihood: 'Medium', description: 'A yellow card for either side could be a major turning point.' },
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 32.5, avgGoalsConceded: 18.2, daysSinceLastMatch: 14 },
                teamB: { avgGoalsScored: 34.1, avgGoalsConceded: 15.5, daysSinceLastMatch: 13 }
            },
            keyPositives: ["Powerful and dominant forward pack", "Strong home-field advantage in Paris", "World's best player in Antoine Dupont", "Explosive backline"],
            keyNegatives: ["Ireland's world-class structure and discipline", "Can be prone to moments of ill-discipline"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 55, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 20, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 15, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 9.2,
            kellyStakePercentage: 2.8,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 70, significantOddsMovement: true },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Forward Pack Matchup', status: 'pass', reason: 'France has a clear physical advantage.' },
                { step: 'Home Advantage Weighting', status: 'pass', reason: 'Stade de France is a fortress.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 9.2%, good value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "Rugby media is billing this as the 'championship decider'. The French coach has emphasized the importance of 'passion and physicality' in front of their home crowd.",
                socialMediaKeywords: ["#SixNations", "#FRAvIRE", "Rugby", "AllezLesBleus"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "StatsPerform", status: DataSourceStatus.PreMatch, metrics: [{name: "Scrum Success %", value: "94% - 89%"}, {name: "Tackle Success %", value: "91% - 93%"}, {name: "H2H (Paris)", value: "France 4W-1L"}] },
            ]
        }
    },
     {
        id: "golf-rory-scottie",
        sport: "Golf",
        teamA: "Scottie Scheffler",
        teamAId: 901,
        teamB: "Rory McIlroy",
        teamBId: 902,
        league: "The Masters",
        matchDate: formatDate(fiveDaysOut),
        prediction: "Scheffler to Win H2H",
        marketType: "Player Matchup",
        confidence: ConfidenceTier.High,
        odds: 1.62,
        reasoning: "The AI's analysis of 'Strokes Gained: Approach' and 'Course History' gives Scheffler a clear statistical advantage at Augusta National over McIlroy.",
        stadium: "Augusta National",
        aiAnalysis: {
            bettingAngle: "The AI model weights 'Strokes Gained: Approach' at Augusta as the most critical statistic for success. Scheffler leads the tour in this metric, giving him a significant edge in the model's simulations.",
            formAnalysis: { teamA: '1,1,2,5', teamB: '3,1,10,15' }, // Representing recent finishes
            playerAnalysis: [
                { name: 'Scottie Scheffler', team: 'A', impact: 'The current world #1, his ball-striking is in a class of its own. A former Masters champion.' },
                { name: 'Rory McIlroy', team: 'B', impact: 'One of the best drivers of the golf ball in history, chasing a career grand slam at The Masters.' }
            ],
            gameScenario: {
                narrative: "This is a head-to-head matchup over 72 holes. Scheffler's elite iron play is perfectly suited for Augusta's demanding greens. McIlroy's driver will give him opportunities, but his historically streaky putting at Augusta is a major concern for the AI. Expect Scheffler to build a lead through consistent, steady play, while McIlroy will be more volatile with rounds of brilliance mixed with costly mistakes.",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Scheffler is predicted to lead the field in Greens in Regulation.' },
                    { eventType: 'Turnover', likelihood: 'Medium', description: 'McIlroy is at risk of a high score on one of Augusta\'s treacherous par 3s.' },
                ]
            },
            keyPositives: ["#1 in Strokes Gained: Approach", "Excellent course history (1 win, 2 top 10s)", "Current form is unmatched", "Calm demeanor suited for major pressure"],
            keyNegatives: ["Putting can occasionally be average", "McIlroy's high ceiling and power advantage"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 60, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 20, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 10, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 11.1,
            kellyStakePercentage: 3.9,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 80, significantOddsMovement: false },
            riskLevel: RiskLevel.Conservative,
            decisionFlow: [
                { step: 'Strokes Gained Analysis', status: 'pass', reason: 'Scheffler holds a significant statistical edge.' },
                { step: 'Course History Check', status: 'pass', reason: 'Scheffler has proven success at Augusta.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 11.1%, good value despite low odds.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "Golf analysts almost unanimously favor Scheffler, calling him the 'clear man to beat'. McIlroy's narrative is focused on his quest for the grand slam, adding extra pressure.",
                socialMediaKeywords: ["#TheMasters", "Golf", "Scheffler", "Augusta"]
            },
            dataSources: [
                 { category: "Player Stats", provider: "PGA Tour API", status: DataSourceStatus.PreMatch, metrics: [{name: "SG: Approach", value: "1st - 15th"}, {name: "SG: Putting", value: "98th - 8th"}, {name: "Course History", value: "Excellent - Good"}] },
            ]
        }
    },
    {
        id: "boxing-canelo-benavidez",
        sport: "Boxing",
        teamA: "Canelo Alvarez",
        teamAId: 1001,
        teamB: "David Benavidez",
        teamBId: 1002,
        league: "Boxing Title Fight",
        matchDate: formatDate(sixDaysOut),
        prediction: "Fight to go the distance",
        marketType: "Fight Outcome",
        confidence: ConfidenceTier.Medium,
        odds: 1.72,
        reasoning: "The AI analysis highlights both fighters' exceptional durability and chins. While Benavidez has volume and power, Canelo's elite defense and counter-punching suggest a tactical, 12-round fight is more likely than a knockout.",
        stadium: "MGM Grand, Las Vegas",
        aiAnalysis: {
            bettingAngle: "The AI model analyzing 'punches absorbed per round' vs. 'knockdown ratio' for both fighters against elite opposition calculates a 70% probability that the fight will reach the final bell.",
            formAnalysis: { teamA: 'WWWWW', teamB: 'WWWWW' },
            playerAnalysis: [
                { name: 'Canelo Alvarez', team: 'A', impact: 'A boxing legend with one of the best resumes in the sport. Elite defense and counter-punching.' },
                { name: 'David Benavidez', team: 'B', impact: 'A young, undefeated pressure fighter with formidable power and volume.' }
            ],
            gameScenario: {
                narrative: "This will be a high-level chess match disguised as a brawl. Benavidez will push the pace, throwing combinations, while Canelo will use his masterful head movement and defense to slip punches and land powerful counters. The middle rounds will be crucial as Benavidez tries to wear Canelo down. Canelo's experience in 12-round championship fights will likely show in the later rounds, leading to a points decision.",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Canelo\'s counter left hook will be his most important weapon.' },
                    { eventType: 'Pace Change', likelihood: 'Medium', description: 'The pace will be frantic early on, but is expected to slow into a more tactical rhythm by round 5.' },
                ]
            },
            keyPositives: ["Both fighters have granite chins", "Canelo's defense is legendary", "Benavidez has never been knocked down", "Championship fight experience favors a longer bout"],
            keyNegatives: ["Benavidez possesses true one-punch power", "Canelo has shown signs of slowing down in recent fights"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 40, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 30, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 20, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 6.8,
            kellyStakePercentage: 2.1,
            marketInsights: { sharpMoneyAlignment: false, publicBettingPercentage: 60, significantOddsMovement: true },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Durability Analysis', status: 'pass', reason: 'Both fighters are historically very durable.' },
                { step: 'Stylistic Matchup', status: 'pass', reason: 'Canelo\'s defense is likely to neutralize Benavidez\'s aggression.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 6.8%, providing value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Neutral,
                newsSummary: "Boxing media is split, with many seeing it as Canelo's toughest test in years. The odds have been moving slightly in Benavidez's favor, suggesting public belief in his power.",
                socialMediaKeywords: ["#CaneloBenavidez", "#Boxing", "TitleFight", "Vegas"]
            },
            dataSources: [
                 { category: "Fighter Stats", provider: "Compubox", status: DataSourceStatus.PreMatch, metrics: [{name: "KOs", value: "39 - 27"}, {name: "KO %", value: "65% - 87%"}, {name: "Knockdowns Suffered", value: "0 - 0"}] },
            ]
        }
    },
    { 
        id: "mls-lafc-lag",
        sport: "Soccer",
        teamA: "LAFC", 
        teamAId: 601,
        teamB: "LA Galaxy", 
        teamBId: 602,
        league: "MLS", 
        matchDate: formatDate(sevenDaysOut),
        prediction: "LAFC to Win & Over 2.5", 
        marketType: "Combo Bet",
        confidence: ConfidenceTier.Medium, 
        odds: 2.75, 
        reasoning: "The 'El Tráfico' derby is notoriously high-scoring. The AI combines LAFC's strong home form at BMO Stadium with the fixture's history of goals to find value in the combo market.",
        stadium: "BMO Stadium",
        aiAnalysis: {
            bettingAngle: "The model identifies that in games where LAFC is a strong home favorite (odds < 1.80), the 'Win & Over 2.5' combo has hit 70% of the time over the past two seasons.",
            formAnalysis: { teamA: 'WDLWW', teamB: 'DWLWD' },
            playerAnalysis: [
                { name: 'Denis Bouanga', team: 'A', impact: 'Last season\'s Golden Boot winner, his pace and finishing are elite for MLS.' },
                { name: 'Riqui Puig', team: 'B', impact: 'The creative engine of the Galaxy, he dictates their entire attacking play.' }
            ],
            gameScenario: {
                narrative: "A chaotic, fast-paced derby is on the cards. LAFC will press high and look to overwhelm the Galaxy with their attacking speed. The Galaxy will try to build through Puig and hit on the counter. Both defenses are prone to errors, which will lead to numerous chances. LAFC's home advantage and superior firepower should see them win a high-scoring thriller.",
                scorePrediction: "3-1",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Denis Bouanga is predicted to score or assist.' },
                    { eventType: 'Discipline', likelihood: 'Medium', description: 'A red card is a real possibility given the intensity of the rivalry.' },
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 2.8, avgGoalsConceded: 1.1, daysSinceLastMatch: 7 },
                teamB: { avgGoalsScored: 1.8, avgGoalsConceded: 1.7, daysSinceLastMatch: 7 }
            },
            keyPositives: ["LAFC's strong home record", "Bouanga's goalscoring form", "H2H is always high-scoring", "Galaxy's defensive weaknesses"],
            keyNegatives: ["Derby matches are unpredictable", "Galaxy's attack is potent"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 40, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 25, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 20, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 15, color: 'bg-amber-500' }],
            expectedValue: 12.1,
            kellyStakePercentage: 2.9,
            marketInsights: { sharpMoneyAlignment: false, publicBettingPercentage: 75, significantOddsMovement: false },
            riskLevel: RiskLevel.Aggressive,
            decisionFlow: [
                { step: 'Home/Away Analysis', status: 'pass', reason: 'LAFC is dominant at home.' },
                { step: 'H2H Goal Trend', status: 'pass', reason: 'Fixture consistently produces goals.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 12.1%, excellent value on the combo.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "The LA soccer scene is buzzing for 'El Tráfico'. Pundits expect fireworks and a hostile atmosphere for the visiting Galaxy.",
                socialMediaKeywords: ["#LAFC", "#LAGalaxy", "#ElTrafico", "MLS"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "MLS Soccer API", status: DataSourceStatus.PreMatch, metrics: [{name: "Home Wins %", value: "75%"}, {name: "Avg. Goals (H2H)", value: "4.2"}, {name: "Key Player Status", value: "All Fit"}] },
            ]
        }
    },
    {
        id: "euroleague-oly-paok",
        sport: "Basketball",
        teamA: "Olympiacos",
        teamAId: 1101,
        teamB: "Panathinaikos",
        teamBId: 1102,
        league: "EuroLeague",
        matchDate: formatDate(eightDaysOut),
        prediction: "Under 155.5 Points",
        marketType: "Total Points",
        confidence: ConfidenceTier.High,
        odds: 1.95,
        reasoning: "The 'Derby of the Eternal Enemies' is known for its intense, defense-first mentality. The AI's analysis of pace and defensive efficiency projects a gritty, low-scoring game, far below the market line.",
        stadium: "Peace and Friendship Stadium",
        aiAnalysis: {
            bettingAngle: "The AI model specifically for high-rivalry European basketball games applies a '-8 point' adjustment to the standard points projection due to increased defensive intensity and slower pace, making the 'Under' a strong value play.",
            formAnalysis: { teamA: 'WWLWW', teamB: 'WWWWW' },
            playerAnalysis: [
                { name: 'Kostas Sloukas', team: 'B', impact: 'A legendary point guard who controversially moved from Olympiacos to Panathinaikos, adding immense tension to the matchup.' },
                { name: 'Moustapha Fall', team: 'A', impact: 'A towering center who anchors Olympiacos\' league-best defense.' }
            ],
            gameScenario: {
                narrative: "This will be a rock fight. Expect a slow, methodical pace with long possessions and intense half-court defense. Referees will let them play, leading to a very physical game. Points will be at a premium, and the game will likely be decided in the final minutes with a score in the low 70s.",
                scorePrediction: "74-71",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Moustapha Fall is projected to have multiple blocks and alter many shots.' },
                    { eventType: 'Discipline', likelihood: 'High', description: 'Foul trouble for a key player is a significant risk.' },
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 78.5, avgGoalsConceded: 74.2, daysSinceLastMatch: 5 },
                teamB: { avgGoalsScored: 81.3, avgGoalsConceded: 77.1, daysSinceLastMatch: 5 }
            },
            keyPositives: ["#1 vs #3 ranked defenses in EuroLeague", "Historically low-scoring derby", "Both teams play at a slow pace", "High-pressure environment suppresses offense"],
            keyNegatives: ["Both teams have elite offensive players", "A hot shooting night could push the total over"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 60, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 20, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 10, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 13.8,
            kellyStakePercentage: 4.5,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 68, significantOddsMovement: true },
            riskLevel: RiskLevel.Conservative,
            decisionFlow: [
                { step: 'Rivalry Impact Analysis', status: 'pass', reason: 'Historical data confirms defensive intensity increases.' },
                { step: 'Pace Projection', status: 'pass', reason: 'Both teams rank in the bottom 5 for pace.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 13.8%, excellent value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Negative,
                newsSummary: "Greek media is focused on the intense rivalry and the return of Kostas Sloukas to his former home court. The narrative is all about defense, passion, and hatred.",
                socialMediaKeywords: ["#EuroLeague", "#OlympiacosBC", "#paobc", "GreekDerby"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "EuroLeague API", status: DataSourceStatus.PreMatch, metrics: [{name: "Defensive Rating", value: "101.5 (1st) - 104.2 (3rd)"}, {name: "Pace", value: "90.1 (17th) - 92.5 (14th)"}, {name: "Avg. H2H Score", value: "148.5"}] },
            ]
        }
    },
    {
        id: "nfl-gb-chi",
        sport: "American Football",
        teamA: "Green Bay Packers",
        teamAId: 201,
        teamB: "Chicago Bears",
        teamBId: 202,
        league: "NFL",
        matchDate: formatDate(nineDaysOut),
        prediction: "Packers -3.5",
        marketType: "Handicap",
        confidence: ConfidenceTier.Medium,
        odds: 1.91,
        reasoning: "The AI model gives a significant edge to the Packers' aerial attack, led by Jordan Love, against a Bears secondary that has struggled with deep passes.",
        stadium: "Lambeau Field",
        aiAnalysis: {
            bettingAngle: "The model's simulation projects the Packers winning by an average of 6.2 points, creating a value opportunity on the -3.5 spread, especially given their historical dominance in this rivalry.",
            formAnalysis: { teamA: 'LWWWW', teamB: 'WLWLW' },
            playerAnalysis: [
                { name: 'Jordan Love', team: 'A', impact: 'A rising star QB whose arm talent and decision-making are key to the Packers\' offense.' },
                { name: 'DJ Moore', team: 'B', impact: 'The Bears\' top wide receiver, a game-breaker who can score from anywhere on the field.' }
            ],
            gameScenario: {
                narrative: "Expect a classic, hard-fought NFC North battle. The Packers will look to establish the passing game early, testing the Bears' defense deep. The Bears will counter with a run-heavy approach to control the clock and keep Love off the field. The game will likely be decided by which team can create more explosive plays and win the turnover battle.",
                scorePrediction: "27-20",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Jordan Love is projected to throw for over 250 yards and 2 TDs.' },
                    { eventType: 'Turnover', likelihood: 'Medium', description: 'A crucial interception in the second half could swing the momentum.' }
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 22.5, avgGoalsConceded: 20.6, daysSinceLastMatch: 14 },
                teamB: { avgGoalsScored: 21.2, avgGoalsConceded: 22.6, daysSinceLastMatch: 14 }
            },
            keyPositives: ["Strong QB play", "Explosive young receiving corps", "Dominant home-field advantage at Lambeau", "Historical H2H dominance"],
            keyNegatives: ["Inconsistent run defense", "Bears' improved defensive line"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 45, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 25, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 15, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 15, color: 'bg-amber-500' }],
            expectedValue: 8.1,
            kellyStakePercentage: 2.5,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 72, significantOddsMovement: false },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'QB Matchup Analysis', status: 'pass', reason: 'Clear advantage for the Packers.' },
                { step: 'Rivalry Trends', status: 'pass', reason: 'Packers have won 10 of the last 11 meetings.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 8.1%, providing good value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "NFL analysts are high on the Packers' offense heading into the season. The Bears are seen as an improving team, but still a step below Green Bay.",
                socialMediaKeywords: ["#GoPackGo", "#BearsDown", "NFL", "LambeauLeap"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "Pro-Football-Reference", status: DataSourceStatus.PreMatch, metrics: [{name: "Passing Yds/G", value: "255.4 - 198.7"}, {name: "Turnover Margin", value: "+7 - -2"}] },
            ]
        }
    },
    {
        id: "nhl-tor-bos",
        sport: "Hockey",
        teamA: "Toronto Maple Leafs",
        teamAId: 301,
        teamB: "Boston Bruins",
        teamBId: 302,
        league: "NHL Playoffs",
        matchDate: formatDate(tenDaysOut),
        prediction: "Over 6.5 Goals",
        marketType: "Total Goals",
        confidence: ConfidenceTier.High,
        odds: 2.05,
        reasoning: "A historic rivalry known for high-scoring playoff games. Both teams boast top-5 power plays and elite offensive talent, while goaltending has been inconsistent in recent matchups.",
        stadium: "TD Garden",
        aiAnalysis: {
            bettingAngle: "The AI model identifies that when these two teams meet in the playoffs, the 'expected goals' (xG) created per game jumps by 25% compared to their regular-season average, making the 'Over' a statistically strong play.",
            formAnalysis: { teamA: 'WWLWW', teamB: 'LWWWL' },
            playerAnalysis: [
                { name: 'Auston Matthews', team: 'A', impact: 'The league\'s premier goalscorer, capable of changing the game with a single shot.' },
                { name: 'David Pastrnak', team: 'B', impact: 'An elite playmaker and scorer who drives the Bruins\' offense.' }
            ],
            gameScenario: {
                narrative: "Expect a fast, physical, and emotional game from the opening puck drop. Both teams will trade chances, and special teams will play a massive role. The game is likely to feature multiple lead changes and a frantic final period. A 4-3 or 5-3 final score is highly probable.",
                scorePrediction: "4-3",
                keyEvents: [
                    { eventType: 'Key Score', likelihood: 'High', description: 'At least two power-play goals will be scored in the game.' },
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Auston Matthews is projected to have over 4 shots on goal.' }
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 3.6, avgGoalsConceded: 3.1, daysSinceLastMatch: 2 },
                teamB: { avgGoalsScored: 3.4, avgGoalsConceded: 2.7, daysSinceLastMatch: 3 }
            },
            keyPositives: ["Top-5 power plays for both teams", "Elite offensive talent on both rosters", "Recent H2H games have been high-scoring", "Goaltending has been questionable"],
            keyNegatives: ["Playoff intensity can lead to tighter defense", "Bruins' strong defensive system at home"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 50, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 25, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 15, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 15.2,
            kellyStakePercentage: 4.2,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 80, significantOddsMovement: false },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Special Teams Analysis', status: 'pass', reason: 'Both power plays are elite.' },
                { step: 'H2H Goal Trends', status: 'pass', reason: 'Clear history of high-scoring games.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 15.2%, excellent value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "Hockey media is buzzing about the offensive firepower in this series. Analysts predict a 'long and high-scoring' series between the two rivals.",
                socialMediaKeywords: ["#StanleyCup", "#LeafsForever", "#NHLBruins", "Hockey"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "NHL Stats API", status: DataSourceStatus.PreMatch, metrics: [{name: "PP %", value: "26.8% (2nd) - 25.5% (4th)"}, {name: "Goals/Game", value: "3.65 - 3.45"}] },
            ]
        }
    },
    {
        id: "tennis-djok-alca",
        sport: "Tennis",
        teamA: "Carlos Alcaraz",
        teamAId: 1201,
        teamB: "Novak Djokovic",
        teamBId: 1202,
        league: "Wimbledon Final",
        matchDate: formatDate(elevenDaysOut),
        prediction: "Alcaraz to Win",
        marketType: "Match Winner",
        confidence: ConfidenceTier.Medium,
        odds: 2.10,
        reasoning: "While Djokovic is the grass-court legend, the AI model gives a slight edge to Alcaraz's youthful athleticism and all-court aggression, predicting he can outlast the veteran in a grueling five-set match.",
        stadium: "Centre Court",
        aiAnalysis: {
            bettingAngle: "The AI's simulation model, which heavily weights 'average rally length' and 'second serve win percentage', shows Alcaraz winning 55% of 5-set match simulations against Djokovic on grass, making the 2.10 odds a value play.",
            formAnalysis: { teamA: 'WWWWW', teamB: 'WWWWW' },
            playerAnalysis: [
                { name: 'Carlos Alcaraz', team: 'A', impact: 'A new-generation superstar with a complete game, incredible speed, and powerful groundstrokes.' },
                { name: 'Novak Djokovic', team: 'B', impact: 'Arguably the greatest player of all time, his mental strength and defensive skills on grass are legendary.' }
            ],
            gameScenario: {
                narrative: "A blockbuster final for the ages. Expect long, brutal rallies with incredible shot-making from both players. Alcaraz will try to be the aggressor, using his drop shot and powerful forehand. Djokovic will counter with his trademark defense and precision. The match will likely go to a deciding set, where Alcaraz's fitness could be the deciding factor.",
                scorePrediction: "3-2 in sets",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'The match is predicted to last over 3.5 hours.' },
                    { eventType: 'Pace Change', likelihood: 'High', description: 'Momentum will swing back and forth multiple times.' }
                ]
            },
            keyPositives: ["Superior athleticism and court coverage", "Higher first-serve speed", "Aggressive style that can rush Djokovic", "Fearless mentality"],
            keyNegatives: ["Facing the most successful Wimbledon player ever", "Less experience in major finals", "Can be prone to unforced errors"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 30, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 40, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 15, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 15, color: 'bg-amber-500' }],
            expectedValue: 7.5,
            kellyStakePercentage: 2.2,
            marketInsights: { sharpMoneyAlignment: false, publicBettingPercentage: 58, significantOddsMovement: true },
            riskLevel: RiskLevel.Aggressive,
            decisionFlow: [
                { step: '5-Set Simulation', status: 'pass', reason: 'Alcaraz shows a slight edge in longer matches.' },
                { step: 'Surface Analysis', status: 'neutral', reason: 'Djokovic has the historical edge, but Alcaraz has adapted well.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 7.5%, providing value on the underdog.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Neutral,
                newsSummary: "Tennis world is eagerly anticipating the 'changing of the guard' matchup. Experts are split, with many favoring Djokovic's experience but acknowledging Alcaraz's immense talent.",
                socialMediaKeywords: ["#Wimbledon", "#Tennis", "Djokovic", "Alcaraz"]
            },
            dataSources: [
                 { category: "Player Stats", provider: "ATP Tour API", status: DataSourceStatus.PreMatch, metrics: [{name: "Aces/Match", value: "8.5 - 6.2"}, {name: "2nd Serve Win %", value: "58% - 55%"}] },
            ]
        }
    },
    {
        id: "f1-monaco",
        sport: "Motorsport",
        teamA: "Charles Leclerc",
        teamAId: 1301,
        teamB: "Max Verstappen",
        teamBId: 1302,
        league: "Formula 1",
        matchDate: formatDate(twelveDaysOut),
        prediction: "Leclerc to Win",
        marketType: "Race Winner",
        confidence: ConfidenceTier.High,
        odds: 2.25,
        reasoning: "The AI model places an 80% weight on qualifying position for the Monaco GP. Leclerc's historical one-lap pace at his home circuit is statistically dominant, making him the clear favorite if he secures pole position.",
        stadium: "Circuit de Monaco",
        aiAnalysis: {
            bettingAngle: "Given that the pole-sitter has won 12 of the last 20 races in Monaco, the AI identifies significant value in backing the circuit's qualifying specialist, Leclerc, even before the weekend begins.",
            formAnalysis: { teamA: '2,3,4,1', teamB: '1,1,1,2' },
            playerAnalysis: [
                { name: 'Charles Leclerc', team: 'A', impact: 'An exceptional qualifier, especially at his home track of Monaco. Drives for Ferrari.' },
                { name: 'Max Verstappen', team: 'B', impact: 'The reigning world champion and a dominant force in Formula 1. Drives for Red Bull.' }
            ],
            gameScenario: {
                narrative: "The Monaco Grand Prix is all about track position. The race will be won on Saturday in qualifying. Expect Leclerc to push the limits to take pole. If he does, he will likely control the race from the front, as overtaking is nearly impossible on the narrow streets. Strategy and pit stops will be the only threat to a lights-to-flag victory.",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Leclerc is projected to be the fastest in qualifying.' },
                    { eventType: 'Discipline', likelihood: 'Medium', description: 'A safety car is highly probable, which could shake up the strategy.' }
                ]
            },
            keyPositives: ["Home track advantage", "Arguably the best qualifier on the grid", "Ferrari's car is well-suited to slow corners", "Extremely high motivation to win at home"],
            keyNegatives: ["Has been notoriously unlucky at Monaco in the past ('Monaco curse')", "Verstappen's relentless race pace"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 60, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 15, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 15, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 18.5,
            kellyStakePercentage: 4.8,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 65, significantOddsMovement: true },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Track Specific Analysis', status: 'pass', reason: 'Model weights qualifying performance heavily.' },
                { step: 'Driver Skill Analysis', status: 'pass', reason: 'Leclerc is a Monaco specialist.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 18.5%, excellent value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "The F1 paddock widely regards Leclerc as the favorite for Monaco. The narrative is focused on whether he can finally break his home-race curse.",
                socialMediaKeywords: ["#F1", "#MonacoGP", "#Leclerc", "#Tifosi"]
            },
            dataSources: [
                 { category: "Track Stats", provider: "FIA F1 API", status: DataSourceStatus.PreMatch, metrics: [{name: "Pole Win % (Last 20)", value: "60%"}, {name: "Leclerc Monaco Poles", value: "2"}] },
            ]
        }
    },
    {
        id: "ufc-makh-tsar",
        sport: "MMA",
        teamA: "Islam Makhachev",
        teamAId: 1401,
        teamB: "Arman Tsarukyan",
        teamBId: 1402,
        league: "UFC",
        matchDate: formatDate(thirteenDaysOut),
        prediction: "Makhachev by Submission",
        marketType: "Method of Victory",
        confidence: ConfidenceTier.Medium,
        odds: 2.50,
        reasoning: "The AI model highlights Makhachev's 60% submission rate in his UFC wins. Given that their first fight was a grappling-heavy affair, the model predicts that the champion's superior submission skills will be the deciding factor in the rematch.",
        stadium: "T-Mobile Arena, Las Vegas",
        aiAnalysis: {
            bettingAngle: "While a decision is possible, the AI's stylistic matchup analysis gives a 45% probability to a Makhachev submission finish, making the 2.50 odds a significant value opportunity compared to a simple win bet.",
            formAnalysis: { teamA: 'WWWWW', teamB: 'WWWWW' },
            playerAnalysis: [
                { name: 'Islam Makhachev', team: 'A', impact: 'The dominant lightweight champion, known for his suffocating Sambo-style grappling and submissions.' },
                { name: 'Arman Tsarukyan', team: 'B', impact: 'A highly skilled and well-rounded contender, one of the few fighters to test Makhachev on the ground.' }
            ],
            gameScenario: {
                narrative: "This will be an extremely high-level MMA fight, contested primarily in the grappling realm. Both fighters will exchange takedowns and control positions. The fight will be close, but the AI predicts Makhachev will capitalize on a small mistake by Tsarukyan in a scramble, lock in a submission, and secure the finish in the championship rounds (3-5).",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Over 10 minutes of control time is projected for Makhachev.' },
                    { eventType: 'Pace Change', likelihood: 'High', description: 'The pace will be relentless, testing the cardio of both fighters.' }
                ]
            },
            keyPositives: ["Dominant grappling and submission skills", "Experience in 5-round championship fights", "Proven ability to finish top contenders", "Psychological edge from the first win"],
            keyNegatives: ["Tsarukyan is also an elite grappler", "Tsarukyan has improved significantly since their first fight"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 40, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 30, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 20, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 12.5,
            kellyStakePercentage: 3.1,
            marketInsights: { sharpMoneyAlignment: false, publicBettingPercentage: 62, significantOddsMovement: false },
            riskLevel: RiskLevel.Aggressive,
            decisionFlow: [
                { step: 'Stylistic Matchup', status: 'pass', reason: 'Grappling-heavy fight favors the better submission artist.' },
                { step: 'Finishing Rate Analysis', status: 'pass', reason: 'Makhachev has a high submission rate.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 12.5%, excellent value on this prop.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Neutral,
                newsSummary: "The MMA community is highly anticipating this rematch, considering it the toughest test of Makhachev's reign. Many believe Tsarukyan has the skills to win, but the champion's dominance is hard to bet against.",
                socialMediaKeywords: ["#UFC", "#MMA", "Makhachev", "Tsarukyan"]
            },
            dataSources: [
                 { category: "Fighter Stats", provider: "UFC Stats API", status: DataSourceStatus.PreMatch, metrics: [{name: "Sub. Avg./15min", value: "1.9 - 0.8"}, {name: "Takedown Defense %", value: "90% - 75%"}] },
            ]
        }
    },
    {
        id: "seriea-int-acm",
        sport: "Soccer",
        teamA: "Inter Milan",
        teamAId: 505,
        teamB: "AC Milan",
        teamBId: 489,
        league: "Serie A",
        matchDate: formatDate(fourteenDaysOut),
        prediction: "Under 2.5 Goals",
        marketType: "Total Goals",
        confidence: ConfidenceTier.High,
        odds: 1.95,
        reasoning: "The 'Derby della Madonnina' is famously tactical and tense. The AI model highlights that 6 of the last 7 meetings have gone under 2.5 goals, pointing to both teams' defensive solidity in high-stakes matches.",
        stadium: "San Siro",
        aiAnalysis: {
            bettingAngle: "The model's analysis of historical derby data shows a 30% decrease in 'shots on target' compared to the teams' league averages, indicating a cautious, defense-first approach that strongly favors the 'Under'.",
            formAnalysis: { teamA: 'WWWDW', teamB: 'WWDWL' },
            playerAnalysis: [
                { name: 'Lautaro Martínez', team: 'A', impact: 'Inter\'s captain and top scorer, a clinical finisher.' },
                { name: 'Rafael Leão', team: 'B', impact: 'AC Milan\'s explosive winger, their main source of creativity and goals.' }
            ],
            gameScenario: {
                narrative: "Expect a tactical chess match with both teams prioritizing defensive structure. The midfield battle will be intense and crucial. Chances will be few and far between, with the game likely being decided by a single moment of brilliance or a mistake. A 1-0 or 1-1 scoreline is the most probable outcome.",
                scorePrediction: "1-0",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'The match will feature a high number of tackles and fouls in midfield.' },
                    { eventType: 'Key Score', likelihood: 'Medium', description: 'A goal from a set-piece could be the decider.' }
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 2.3, avgGoalsConceded: 0.6, daysSinceLastMatch: 8 },
                teamB: { avgGoalsScored: 2.0, avgGoalsConceded: 1.1, daysSinceLastMatch: 7 }
            },
            keyPositives: ["6 of last 7 H2H games under 2.5 goals", "Both teams have top-tier defenses in Serie A", "High stakes of the derby promote cautious play", "Strong goalkeeping on both sides"],
            keyNegatives: ["Elite attacking players on both teams can score at any moment", "An early goal could open the game up"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 55, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 20, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 15, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 13.5,
            kellyStakePercentage: 3.8,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 70, significantOddsMovement: false },
            riskLevel: RiskLevel.Conservative,
            decisionFlow: [
                { step: 'H2H Goal Trend', status: 'pass', reason: 'Strong historical trend for low-scoring games.' },
                { step: 'Tactical Analysis', status: 'pass', reason: 'Derby intensity favors defensive play.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 13.5%, excellent value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Negative,
                newsSummary: "Italian press is predicting a tight, tactical battle for city bragging rights. Both managers have emphasized the importance of 'balance and concentration'.",
                socialMediaKeywords: ["#SerieA", "#MilanDerby", "#Inter", "#ACMilan"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "API-Football", status: DataSourceStatus.PreMatch, metrics: [{name: "Goals Conceded/G", value: "0.7 - 0.9"}, {name: "H2H Under 2.5 %", value: "85.7%"}] },
            ]
        }
    },
    {
        id: "ligue1-psg-om",
        sport: "Soccer",
        teamA: "PSG",
        teamAId: 85,
        teamB: "Marseille",
        teamBId: 81,
        league: "Ligue 1",
        matchDate: formatDate(fifteenDaysOut),
        prediction: "PSG to Win & BTTS",
        marketType: "Combo Bet",
        confidence: ConfidenceTier.Medium,
        odds: 2.85,
        reasoning: "The AI model finds value in this combo bet for 'Le Classique'. PSG's overwhelming home dominance should secure the win, but their defense has been surprisingly leaky, and Marseille's high-intensity attack has scored in 5 of their last 6 visits to Paris.",
        stadium: "Parc des Princes",
        aiAnalysis: {
            bettingAngle: "While a PSG win is highly likely, the odds are low. The model identifies that the market is underestimating Marseille's ability to score in this fixture. The probability of both events occurring (PSG win + BTTS) is calculated at 40%, making the 2.85 odds a strong value proposition.",
            formAnalysis: { teamA: 'WWDWW', teamB: 'LWWWD' },
            playerAnalysis: [
                { name: 'Kylian Mbappé', team: 'A', impact: 'One of the best players in the world, his speed and finishing are virtually unstoppable.' },
                { name: 'Pierre-Emerick Aubameyang', team: 'B', impact: 'A veteran striker with a proven goalscoring record, Marseille\'s main threat.' }
            ],
            gameScenario: {
                narrative: "An intense and hostile atmosphere is guaranteed. PSG will dominate possession and create numerous chances with their superstar attack. Marseille will defend deep and look to hit on the counter-attack with pace. PSG's defensive vulnerabilities will likely be exposed at least once, but their firepower should be too much for Marseille to handle over 90 minutes.",
                scorePrediction: "3-1",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Kylian Mbappé is projected to have a goal contribution.' },
                    { eventType: 'Discipline', likelihood: 'High', description: 'This derby is known for yellow and red cards.' }
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 2.9, avgGoalsConceded: 1.0, daysSinceLastMatch: 6 },
                teamB: { avgGoalsScored: 1.8, avgGoalsConceded: 1.2, daysSinceLastMatch: 8 }
            },
            keyPositives: ["PSG's unbeaten home record", "Mbappé's incredible goalscoring form", "Marseille's strong attacking record", "PSG's tendency to concede goals"],
            keyNegatives: ["Derby matches are unpredictable", "Marseille's defense can be organized"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 40, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 25, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 20, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 15, color: 'bg-amber-500' }],
            expectedValue: 14.8,
            kellyStakePercentage: 3.2,
            marketInsights: { sharpMoneyAlignment: false, publicBettingPercentage: 78, significantOddsMovement: false },
            riskLevel: RiskLevel.Aggressive,
            decisionFlow: [
                { step: 'Home Dominance Check', status: 'pass', reason: 'PSG is nearly unbeatable at home.' },
                { step: 'BTTS History Check', status: 'pass', reason: 'Marseille consistently scores in this fixture.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 14.8%, great value on the combo.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "The French media is hyping 'Le Classique' as the biggest match in French football. The focus is on Mbappé's form and whether Marseille's passionate defense can stop him.",
                socialMediaKeywords: ["#Ligue1", "#LeClassique", "#PSGOM", "Mbappe"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "API-Football", status: DataSourceStatus.PreMatch, metrics: [{name: "PSG Home Win %", value: "88%"}, {name: "Marseille Goals/G", value: "1.8"}] },
            ]
        }
    },
    // NEWLY ADDED & RESEARCHED DATA
    {
        id: "afl-col-ess",
        sport: "Aussie Rules",
        teamA: "Collingwood",
        teamAId: 1501,
        teamB: "Essendon",
        teamBId: 1502,
        league: "AFL",
        matchDate: formatDate(sixteenDaysOut),
        prediction: "Collingwood -12.5",
        marketType: "Handicap",
        confidence: ConfidenceTier.High,
        odds: 1.91,
        reasoning: "The ANZAC Day clash is a blockbuster. AI analysis favors Collingwood's superior midfield depth and clearance efficiency to control the game and cover the spread at the MCG.",
        stadium: "MCG",
        aiAnalysis: {
            bettingAngle: "The model's simulation, which heavily weights 'clearance differential' and 'inside 50 efficiency', projects Collingwood winning by an average of 22 points.",
            formAnalysis: { teamA: 'WWLWW', teamB: 'WLWWL' },
            playerAnalysis: [
                { name: 'Nick Daicos', team: 'A', impact: 'A generational talent who dominates the midfield with his skill and football IQ.' },
                { name: 'Zach Merrett', team: 'B', impact: 'Essendon\'s captain and prime mover in the midfield.' }
            ],
            gameScenario: {
                narrative: "A passionate and contested game is expected. Collingwood will aim to win the contested ball and dominate territory. Essendon will rely on their fast-paced, high-handball game to break through. The key will be Collingwood's ability to shut down Merrett's influence, which they are statistically favored to do.",
                scorePrediction: "95-72",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Nick Daicos is projected for 30+ disposals.' },
                    { eventType: 'Pace Change', likelihood: 'Medium', description: 'The game will be played at high intensity, with momentum swings in the third quarter.' }
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 88.5, avgGoalsConceded: 75.2, daysSinceLastMatch: 9 },
                teamB: { avgGoalsScored: 82.1, avgGoalsConceded: 80.5, daysSinceLastMatch: 9 }
            },
            keyPositives: ["Dominant midfield", "Higher clearance rate", "Strong home ground advantage at MCG", "More efficient forward line"],
            keyNegatives: ["Essendon's leg speed can be dangerous", "High-pressure nature of ANZAC Day"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 50, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 20, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 20, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 9.8,
            kellyStakePercentage: 2.9,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 75, significantOddsMovement: false },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Midfield Matchup', status: 'pass', reason: 'Collingwood has a clear statistical advantage.' },
                { step: 'Venue Analysis', status: 'pass', reason: 'Strong record at the MCG.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 9.8%, good value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "AFL media is highlighting the midfield battle as the key to the game. Most experts are tipping Collingwood to win comfortably.",
                socialMediaKeywords: ["#AFL", "#ANZACDay", "#GoPies", "#GoDons"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "AFL Stats API", status: DataSourceStatus.PreMatch, metrics: [{name: "Clearance Diff.", value: "+5.2"}, {name: "Inside 50 Diff.", value: "+8.1"}] },
            ]
        }
    },
    {
        id: "nascar-daytona",
        sport: "Motorsport",
        teamA: "Denny Hamlin",
        teamAId: 1601,
        teamB: "Rest of Field",
        teamBId: 1602,
        league: "NASCAR",
        matchDate: formatDate(seventeenDaysOut),
        prediction: "Denny Hamlin to Win",
        marketType: "Race Winner",
        confidence: ConfidenceTier.Low,
        odds: 11.00,
        reasoning: "The Daytona 500 is notoriously unpredictable. However, the AI's superspeedway model identifies Denny Hamlin as having the best 'drafting efficiency' and 'late-race pass' statistics, making him a value pick at these odds.",
        stadium: "Daytona International Speedway",
        aiAnalysis: {
            bettingAngle: "Superspeedway racing is chaotic, but Hamlin's historical performance in the draft and his ability to make moves in the final laps give him a 12% win probability in the model's simulations, far exceeding the 9% implied by the odds.",
            formAnalysis: { teamA: '3, 1, 1, 5', teamB: 'N/A' },
            playerAnalysis: [
                { name: 'Denny Hamlin', team: 'A', impact: 'One of the best superspeedway racers of all time, a 3-time Daytona 500 winner.' },
                { name: 'Chase Elliott', team: 'B', impact: 'NASCAR\'s most popular driver and a perennial threat.' }
            ],
            gameScenario: {
                narrative: "Expect pack racing for 500 miles, with multiple lead changes and the constant threat of a multi-car crash ('The Big One'). The race will be decided in the final 10 laps. Hamlin's strategy will be to stay in the lead draft, avoid trouble, and position himself perfectly for a last-lap slingshot move.",
                keyEvents: [
                    { eventType: 'Discipline', likelihood: 'High', description: 'A major crash involving 10+ cars is highly probable.' },
                    { eventType: 'Key Performer', likelihood: 'High', description: 'The race winner will lead fewer than 20 laps.' }
                ]
            },
            keyPositives: ["Elite superspeedway race craft", "Multiple Daytona 500 wins", "Strong Joe Gibbs Racing equipment", "Excellent at managing the draft"],
            keyNegatives: ["High likelihood of being caught in a crash", "Extreme unpredictability of the race"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 20, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 30, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 20, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 30, color: 'bg-amber-500' }],
            expectedValue: 32.0,
            kellyStakePercentage: 1.5,
            marketInsights: { sharpMoneyAlignment: false, publicBettingPercentage: 8, significantOddsMovement: false },
            riskLevel: RiskLevel.Aggressive,
            decisionFlow: [
                { step: 'Driver Skill Analysis', status: 'pass', reason: 'Hamlin is a top-tier superspeedway driver.' },
                { step: 'Chaos Factor', status: 'neutral', reason: 'High chance of random events impacting the outcome.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is extremely high due to long odds.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Neutral,
                newsSummary: "The focus is on the start of the new NASCAR season. Hamlin is consistently mentioned as one of the favorites for the 500.",
                socialMediaKeywords: ["#NASCAR", "#Daytona500", "DennyHamlin", "Racing"]
            },
            dataSources: [
                 { category: "Driver Stats", provider: "NASCAR API", status: DataSourceStatus.PreMatch, metrics: [{name: "Daytona Wins", value: "3"}, {name: "Avg. Finish", value: "15.8"}] },
            ]
        }
    },
    {
        id: "dota2-ti-final",
        sport: "Esports",
        teamA: "Team Spirit",
        teamAId: 1701,
        teamB: "Gaimin Gladiators",
        teamBId: 1702,
        league: "The International",
        matchDate: formatDate(eighteenDaysOut),
        prediction: "Team Spirit -1.5 Maps",
        marketType: "Handicap",
        confidence: ConfidenceTier.Medium,
        odds: 2.20,
        reasoning: "In this Grand Final rematch, the AI's meta-analysis favors Team Spirit's wider hero pool and superior late-game decision-making, predicting a 3-0 or 3-1 victory.",
        stadium: "Climate Pledge Arena",
        aiAnalysis: {
            bettingAngle: "The AI model identifies that Gaimin Gladiators' win condition is heavily reliant on early-game aggression. Team Spirit's 80% win rate in games lasting over 45 minutes gives them a significant advantage in a Best-of-5 series, making the -1.5 handicap a value bet.",
            formAnalysis: { teamA: 'WWWWW', teamB: 'WWWLW' },
            playerAnalysis: [
                { name: 'Yatoro', team: 'A', impact: 'A versatile and clutch carry player for Team Spirit, known for his incredible late-game performances.' },
                { name: 'Quinn', team: 'B', impact: 'An aggressive and dominant mid-laner for Gaimin Gladiators.' }
            ],
            gameScenario: {
                narrative: "A battle of styles. Gaimin will try to win early with constant pressure and aggression. Team Spirit will look to weather the storm, secure farm for Yatoro, and win through superior team fights in the mid to late game. The AI predicts Spirit will lose one early game but adapt their draft and strategy to win the next three games convincingly.",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'The team that secures Roshan first in the late game will likely win that map.' },
                    { eventType: 'Pace Change', likelihood: 'High', description: 'The pace of the games will be dictated by Gaimin\'s early aggression.' }
                ]
            },
            keyPositives: ["Wider hero pool", "Better late-game macro play", "Proven winners on the biggest stage", "Psychological edge from previous wins"],
            keyNegatives: ["Can be vulnerable to early aggression", "Gaimin's mid-laner is a formidable opponent"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 40, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 30, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 20, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 16.2,
            kellyStakePercentage: 3.5,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 60, significantOddsMovement: true },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Meta Analysis', status: 'pass', reason: 'Spirit\'s style is favored in the current patch.' },
                { step: 'Player Matchups', status: 'pass', reason: 'Spirit has advantages in the side lanes.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 16.2%, excellent value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "The Dota 2 community is hyped for the rematch. Most analysts favor Team Spirit, citing their championship pedigree and unflappable composure.",
                socialMediaKeywords: ["#TI13", "#Dota2", "#TeamSpirit", "#GaiminGladiators"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "DotaBuff API", status: DataSourceStatus.PreMatch, metrics: [{name: "Avg. Game Time", value: "42.5m - 35.8m"}, {name: "Win Rate > 45m", value: "80% - 45%"}] },
            ]
        }
    },
    {
        id: "lol-worlds-final",
        sport: "Esports",
        teamA: "T1",
        teamAId: 1801,
        teamB: "JD Gaming",
        teamBId: 1802,
        league: "League of Legends Worlds",
        matchDate: formatDate(nineteenDaysOut),
        prediction: "Total Maps Over 4.5",
        marketType: "Total Maps",
        confidence: ConfidenceTier.High,
        odds: 2.50,
        reasoning: "The two titans of League of Legends clash. The AI's stylistic analysis predicts a very close series, with both teams having distinct strengths that will lead to traded games, pushing the series to a deciding fifth map.",
        stadium: "Gocheok Sky Dome",
        aiAnalysis: {
            bettingAngle: "The AI model simulates this matchup 10,000 times. In 58% of simulations, the series goes to five maps, regardless of the winner. This makes the 'Over 4.5' a significant value bet at 2.50 odds.",
            formAnalysis: { teamA: 'WWWWW', teamB: 'WWWWW' },
            playerAnalysis: [
                { name: 'Faker', team: 'A', impact: 'The greatest player of all time, his experience and clutch play are legendary.' },
                { name: 'Ruler', team: 'B', impact: 'A world-class ADC, known for his impeccable team fighting and positioning.' }
            ],
            gameScenario: {
                narrative: "This will be a chess match of the highest order. T1 (Korea) will favor a scaling, team-fight-oriented style, while JDG (China) will look for aggressive early-game plays and skirmishes. Expect both teams to win games where they can execute their preferred style, leading to a back-and-forth series that goes the distance.",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'The team that secures the third Dragon (Soul Point) will have a massive advantage.' },
                    { eventType: 'Discipline', likelihood: 'Medium', description: 'A failed Baron Nashor attempt could be the turning point of the series.' }
                ]
            },
            keyPositives: ["Both teams are at the peak of their powers", "Stylistic differences lead to traded maps", "Both teams have shown resilience in previous series", "The pressure of the final often leads to closer games"],
            keyNegatives: ["One team could simply be on better form on the day and sweep", "A strange draft could give one team a huge advantage"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 40, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 30, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 20, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 45.0,
            kellyStakePercentage: 5.0,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 65, significantOddsMovement: true },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Stylistic Matchup', status: 'pass', reason: 'Styles are different, favoring map trades.' },
                { step: 'Player Form', status: 'pass', reason: 'All players are in world-class form.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is exceptionally high.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "The LoL community is calling this the 'dream final'. Analysts are struggling to pick a clear winner, with most predicting a 3-2 series for either team.",
                socialMediaKeywords: ["#Worlds2024", "#LoL", "#T1WIN", "#JDGWIN", "Faker"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "Oracle's Elixir", status: DataSourceStatus.PreMatch, metrics: [{name: "Avg. Game Time", value: "32:15 - 29:45"}, {name: "First Blood %", value: "48% - 62%"}] },
            ]
        }
    },
    {
        id: "rwc-sa-nz",
        sport: "Rugby",
        teamA: "South Africa",
        teamAId: 1901,
        teamB: "New Zealand",
        teamBId: 1902,
        league: "Rugby World Cup Final",
        matchDate: formatDate(twentyDaysOut),
        prediction: "South Africa to Win by 1-5",
        marketType: "Winning Margin",
        confidence: ConfidenceTier.Medium,
        odds: 5.50,
        reasoning: "The two most successful nations in rugby history. The AI predicts an incredibly tight, low-scoring, and physical final. South Africa's 'Bomb Squad' (powerful bench) is modeled to be the deciding factor in the final 20 minutes, securing a narrow victory.",
        stadium: "Twickenham",
        aiAnalysis: {
            bettingAngle: "Standard 'Win' odds are too short. The AI's analysis of historical World Cup finals shows that 60% are decided by 7 points or less. The model gives South Africa a 55% win probability, with the most likely outcome being a 3-point win. This makes the '1-5 point margin' a huge value bet.",
            formAnalysis: { teamA: 'WWWWW', teamB: 'WWWLW' },
            playerAnalysis: [
                { name: 'Siya Kolisi', team: 'A', impact: 'The inspirational captain of South Africa, his leadership and breakdown work are world-class.' },
                { name: 'Ardie Savea', team: 'B', impact: 'New Zealand\'s dynamic number 8, a constant threat with the ball in hand.' }
            ],
            gameScenario: {
                narrative: "A brutal war of attrition. The game will be dominated by tactical kicking, set-piece battles, and ferocious defense. Neither team will give an inch. The game will be decided by a late penalty or drop goal. South Africa's strategy of bringing on a fresh, massive forward pack in the second half will wear down the All Blacks.",
                scorePrediction: "19-16",
                keyEvents: [
                    { eventType: 'Discipline', likelihood: 'High', description: 'A yellow card is almost guaranteed and could be match-defining.' },
                    { eventType: 'Key Score', likelihood: 'High', description: 'The match-winning points will likely come from the kicking tee.' }
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 28.4, avgGoalsConceded: 12.1, daysSinceLastMatch: 10 },
                teamB: { avgGoalsScored: 35.8, avgGoalsConceded: 15.4, daysSinceLastMatch: 10 }
            },
            keyPositives: ["Dominant set-piece (scrum and maul)", "The 'Bomb Squad' impact from the bench", "Unmatched physicality in defense", "Proven ability to win tight knockout games"],
            keyNegatives: ["Less creative in attack than New Zealand", "Can be vulnerable to quick-tempo attacks"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 50, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 20, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 20, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 21.0,
            kellyStakePercentage: 2.5,
            marketInsights: { sharpMoneyAlignment: false, publicBettingPercentage: 45, significantOddsMovement: false },
            riskLevel: RiskLevel.Aggressive,
            decisionFlow: [
                { step: 'Bench Impact Analysis', status: 'pass', reason: 'South Africa has a clear advantage.' },
                { step: 'Finals History Analysis', status: 'pass', reason: 'Data shows finals are typically close.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is excellent on the margin bet.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Neutral,
                newsSummary: "The rugby world is expecting a titanic clash between the two old rivals. The debate is centered on whether New Zealand's flair can overcome South Africa's power.",
                socialMediaKeywords: ["#RWC2024", "#Springboks", "#AllBlacks", "Rugby"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "World Rugby API", status: DataSourceStatus.PreMatch, metrics: [{name: "Scrum Win %", value: "95% - 88%"}, {name: "Tackle Success %", value: "92% - 89%"}] },
            ]
        }
    },
    {
        id: "ncaaf-bama-uga",
        sport: "American Football",
        teamA: "Alabama",
        teamAId: 2001,
        teamB: "Georgia",
        teamBId: 2002,
        league: "NCAA Football",
        matchDate: formatDate(twentyOneDaysOut),
        prediction: "Under 58.5 Points",
        marketType: "Total Points",
        confidence: ConfidenceTier.High,
        odds: 1.91,
        reasoning: "The SEC Championship game is a clash of two elite defenses. The AI model's analysis of 'yards per play allowed' and 'red zone defense percentage' projects a physical, low-scoring affair where points are at a premium.",
        stadium: "Mercedes-Benz Stadium",
        aiAnalysis: {
            bettingAngle: "The market often inflates totals for high-profile college games. The AI's pace-of-play projection shows both teams will favor a run-heavy, clock-controlling style, which leads to fewer possessions and a lower final score. The model projects a total of 51 points.",
            formAnalysis: { teamA: 'WWWWW', teamB: 'WWWWW' },
            playerAnalysis: [
                { name: 'Jalen Milroe', team: 'A', impact: 'A dual-threat QB for Alabama, his running ability is a key part of their offense.' },
                { name: 'Brock Bowers', team: 'B', impact: 'A generational talent at Tight End for Georgia, a matchup nightmare for any defense.' }
            ],
            gameScenario: {
                narrative: "This will be a trench war. Both teams will try to establish the run and control the line of scrimmage. Expect long, grinding drives and a lot of punts. Big plays will be rare against these two defenses. The game will be decided by field position and which offense can avoid making a critical mistake.",
                scorePrediction: "27-24",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Both defenses are projected to have multiple sacks.' },
                    { eventType: 'Turnover', likelihood: 'Medium', description: 'A turnover in the red zone will be a massive momentum swing.' }
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 37.2, avgGoalsConceded: 17.9, daysSinceLastMatch: 12 },
                teamB: { avgGoalsScored: 40.1, avgGoalsConceded: 15.8, daysSinceLastMatch: 12 }
            },
            keyPositives: ["Two top-5 ranked defenses", "Both teams have strong run games to control the clock", "Historically, these championship games are tighter and lower scoring", "Excellent special teams play"],
            keyNegatives: ["Both offenses have explosive playmakers", "A defensive or special teams touchdown could ruin the under"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 60, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 15, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 15, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 10.5,
            kellyStakePercentage: 3.2,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 62, significantOddsMovement: true },
            riskLevel: RiskLevel.Conservative,
            decisionFlow: [
                { step: 'Defensive Matchup', status: 'pass', reason: 'Both units are elite.' },
                { step: 'Pace Projection', status: 'pass', reason: 'Slow, run-heavy pace expected.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 10.5%, good value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Negative,
                newsSummary: "College football media is billing this as a 'heavyweight fight' and a 'defensive slugfest'. The narrative is all about which team is tougher in the trenches.",
                socialMediaKeywords: ["#CFB", "#SECChampionship", "#RollTide", "#GoDawgs"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "ESPN Stats API", status: DataSourceStatus.PreMatch, metrics: [{name: "Yards/Play Allowed", value: "4.5 - 4.2"}, {name: "Red Zone Def %", value: "70% - 65%"}] },
            ]
        }
    },
    // NEW SOCCER LEAGUES
    {
        id: "bra-fla-pal",
        sport: "Soccer",
        teamA: "Flamengo",
        teamAId: 121,
        teamB: "Palmeiras",
        teamBId: 127,
        league: "Brasileirão Série A",
        matchDate: formatDate(twentyTwoDaysOut),
        prediction: "Draw",
        marketType: "Match Winner",
        confidence: ConfidenceTier.Medium,
        odds: 3.20,
        reasoning: "A top-of-the-table clash between two evenly matched Brazilian powerhouses. The AI's model projects a tight, tactical stalemate, with neither side wanting to concede ground in the title race.",
        stadium: "Maracanã",
        aiAnalysis: {
            bettingAngle: "The model identifies that in the last 10 meetings between these two sides, 6 have ended in a draw. The market often underestimates the draw probability in high-stakes games, creating a value opportunity.",
            formAnalysis: { teamA: 'WWDWW', teamB: 'WDWWW' },
            playerAnalysis: [
                { name: 'Gabriel Barbosa', team: 'A', impact: 'Flamengo\'s talismanic striker, a proven goalscorer in big matches.' },
                { name: 'Raphael Veiga', team: 'B', impact: 'Palmeiras\' creative midfielder and set-piece specialist.' }
            ],
            gameScenario: {
                narrative: "A tense and strategic battle is expected. Both teams will be well-organized defensively, looking to exploit the other on the counter-attack. The midfield battle will be key, and the game is likely to be a low-scoring affair decided by fine margins.",
                scorePrediction: "1-1",
                keyEvents: [
                    { eventType: 'Key Score', likelihood: 'Medium', description: 'A goal from a set-piece is a likely scenario.' },
                    { eventType: 'Discipline', likelihood: 'High', description: 'Expect a high number of yellow cards.' }
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 1.8, avgGoalsConceded: 0.9, daysSinceLastMatch: 5 },
                teamB: { avgGoalsScored: 1.7, avgGoalsConceded: 0.8, daysSinceLastMatch: 5 }
            },
            keyPositives: ["Two of the best teams in South America", "Historically close and hard-fought encounters", "Strong defensive records", "High stakes often lead to cautious play"],
            keyNegatives: ["Both teams possess incredible attacking talent", "Home advantage for Flamengo is significant"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 35, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 30, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 20, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 15, color: 'bg-amber-500' }],
            expectedValue: 15.6,
            kellyStakePercentage: 3.3,
            marketInsights: { sharpMoneyAlignment: false, publicBettingPercentage: 25, significantOddsMovement: false },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'H2H Analysis', status: 'pass', reason: 'High frequency of draws in past meetings.' },
                { step: 'Team Strength Parity', status: 'pass', reason: 'Models show teams are very evenly matched.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 15.6%, excellent value on the draw.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Neutral,
                newsSummary: "Brazilian media is billing this as a potential title decider. Both coaches have stressed the importance of not losing the match.",
                socialMediaKeywords: ["#Brasileirao", "#FLAxPAL", "Futebol", "Maracanã"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "API-Football", status: DataSourceStatus.PreMatch, metrics: [{name: "Goals Conceded/G", value: "0.8 - 0.7"}, {name: "H2H Draws", value: "60%"}] },
            ]
        }
    },
    {
        id: "arg-riv-boc",
        sport: "Soccer",
        teamA: "River Plate",
        teamAId: 435,
        teamB: "Boca Juniors",
        teamBId: 451,
        league: "Liga Profesional",
        matchDate: formatDate(twentyThreeDaysOut),
        prediction: "Over 8.5 Cards",
        marketType: "Cards",
        confidence: ConfidenceTier.High,
        odds: 2.00,
        reasoning: "The Superclásico is arguably the most intense and hostile derby in world football. The AI's historical analysis of this fixture shows an average of 9.8 cards per game over the last 10 meetings, making this a strong statistical bet.",
        stadium: "El Monumental",
        aiAnalysis: {
            bettingAngle: "The model, which includes referee strictness and player foul data, projects a 75% probability of 9 or more cards being shown. This market is often driven by pure emotion and historical precedent, which the AI is designed to capture.",
            formAnalysis: { teamA: 'WWLWD', teamB: 'WDLWW' },
            playerAnalysis: [
                { name: 'Enzo Pérez', team: 'A', impact: 'River\'s experienced and combative midfielder, always in the heart of the battle.' },
                { name: 'Marcos Rojo', team: 'B', impact: 'Boca\'s aggressive center-back, known for his hard tackles and disciplinary record.' }
            ],
            gameScenario: {
                narrative: "An explosive and chaotic atmosphere is guaranteed. The game will be defined by hard tackles, player confrontations, and constant pressure on the referee. Football will be secondary to the battle for dominance. Expect multiple flashpoints and at least one red card.",
                keyEvents: [
                    { eventType: 'Discipline', likelihood: 'High', description: 'A red card is highly probable in this fixture.' },
                    { eventType: 'Key Performer', likelihood: 'High', description: 'The referee will be one of the most influential figures in the match.' }
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 1.9, avgGoalsConceded: 0.7, daysSinceLastMatch: 6 },
                teamB: { avgGoalsScored: 1.5, avgGoalsConceded: 0.9, daysSinceLastMatch: 6 }
            },
            keyPositives: ["Most intense derby in the world", "Average of 9.8 cards in last 10 H2H", "Aggressive and passionate players", "High-pressure environment for the referee"],
            keyNegatives: ["A referee might try to 'let the game flow'", "An early blowout could reduce the tension (unlikely)"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 60, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 15, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 15, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 50.0,
            kellyStakePercentage: 6.0,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 80, significantOddsMovement: true },
            riskLevel: RiskLevel.Conservative,
            decisionFlow: [
                { step: 'Derby Intensity Analysis', status: 'pass', reason: 'Historical data confirms extreme card counts.' },
                { step: 'Referee Profile', status: 'pass', reason: 'The assigned referee averages 5.5 cards/game.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is exceptionally high.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Negative,
                newsSummary: "Argentinian media is focused entirely on the passion, the rivalry, and the potential for controversy. The football itself is almost an afterthought.",
                socialMediaKeywords: ["#Superclasico", "#VamosRiver", "#VamosBoca", "FutbolArgentino"]
            },
            dataSources: [
                 { category: "Discipline Stats", provider: "API-Football", status: DataSourceStatus.PreMatch, metrics: [{name: "Avg. Cards H2H", value: "9.8"}, {name: "Red Cards H2H (L10)", value: "7"}] },
            ]
        }
    },
    {
        id: "ere-aja-fey",
        sport: "Soccer",
        teamA: "Ajax",
        teamAId: 194,
        teamB: "Feyenoord",
        teamBId: 197,
        league: "Eredivisie",
        matchDate: formatDate(twentyFourDaysOut),
        prediction: "Both Teams to Score & Over 2.5",
        marketType: "Combo Bet",
        confidence: ConfidenceTier.High,
        odds: 1.80,
        reasoning: "'De Klassieker' is the Netherlands' biggest derby and is famous for goals. The AI highlights that this has landed in 8 of the last 10 meetings, with both teams prioritizing attacking football.",
        stadium: "Johan Cruyff Arena",
        aiAnalysis: {
            bettingAngle: "The model's analysis of both teams' 'expected goals' (xG) for and against shows a combined xG of 3.8 for this fixture, indicating that the market line is too low and the combo bet holds significant value.",
            formAnalysis: { teamA: 'WWDWL', teamB: 'WWWWW' },
            playerAnalysis: [
                { name: 'Brian Brobbey', team: 'A', impact: 'Ajax\'s strong and fast striker, their primary goal threat.' },
                { name: 'Santiago Giménez', team: 'B', impact: 'Feyenoord\'s clinical finisher, leading the league in scoring.' }
            ],
            gameScenario: {
                narrative: "An open, end-to-end game is expected. Both teams play a high defensive line and are committed to attacking football, which will leave plenty of space for the forwards to exploit. A high-scoring game is almost a certainty.",
                scorePrediction: "2-2",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Both Brobbey and Giménez are projected to get on the scoresheet.' },
                    { eventType: 'Pace Change', likelihood: 'High', description: 'The game will be played at a high tempo from start to finish.' }
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 2.6, avgGoalsConceded: 1.8, daysSinceLastMatch: 7 },
                teamB: { avgGoalsScored: 3.0, avgGoalsConceded: 0.9, daysSinceLastMatch: 7 }
            },
            keyPositives: ["Historically high-scoring derby", "Both teams have elite attacks and average over 2.5 goals/game", "Attacking philosophies of both managers", "8 of last 10 H2H saw this bet win"],
            keyNegatives: ["Derby pressure can sometimes lead to mistakes", "Goalkeepers are in good form"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 50, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 25, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 15, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 12.0,
            kellyStakePercentage: 4.1,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 90, significantOddsMovement: false },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'H2H Goal Trend', status: 'pass', reason: 'Very strong trend for goals.' },
                { step: 'Tactical Analysis', status: 'pass', reason: 'Both teams play attacking styles.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 12.0%, good value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "Dutch media is expecting a 'football festival' with plenty of goals. The focus is on the battle between the two star strikers.",
                socialMediaKeywords: ["#Eredivisie", "#DeKlassieker", "#Ajax", "#Feyenoord"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "TheSportsDB", status: DataSourceStatus.PreMatch, metrics: [{name: "Avg. Goals H2H", value: "3.9"}, {name: "BTTS & O2.5 %", value: "80%"}] },
            ]
        }
    },
    {
        id: "por-ben-por",
        sport: "Soccer",
        teamA: "Benfica",
        teamAId: 211,
        teamB: "Porto",
        teamBId: 212,
        league: "Primeira Liga",
        matchDate: formatDate(twentyFiveDaysOut),
        prediction: "Benfica to Win",
        marketType: "Match Winner",
        confidence: ConfidenceTier.Medium,
        odds: 2.15,
        reasoning: "In 'O Clássico', home advantage is a massive factor. The AI's model gives a 55% win probability to Benfica at the Estádio da Luz, where they have been nearly perfect this season.",
        stadium: "Estádio da Luz",
        aiAnalysis: {
            bettingAngle: "The model heavily weights home-field advantage in the Primeira Liga, especially in games between the 'Big Three'. Benfica's statistical dominance at home makes them a value bet at odds over 2.00.",
            formAnalysis: { teamA: 'WWWLW', teamB: 'WWLWW' },
            playerAnalysis: [
                { name: 'Ángel Di María', team: 'A', impact: 'The veteran winger is still world-class, providing goals and assists for Benfica.' },
                { name: 'Mehdi Taremi', team: 'B', impact: 'Porto\'s powerful and intelligent striker, a constant goal threat.' }
            ],
            gameScenario: {
                narrative: "A passionate and high-quality affair. Benfica will look to use their home crowd to build momentum and dominate possession. Porto will be organized and dangerous on the counter. The first goal will be crucial, and the AI favors Benfica to get it, forcing Porto to open up and leaving them vulnerable.",
                scorePrediction: "2-1",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Di María is projected to have a key role in the outcome.' },
                    { eventType: 'Discipline', likelihood: 'Medium', description: 'A late red card is a possibility as the tension rises.' }
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 2.5, avgGoalsConceded: 0.8, daysSinceLastMatch: 8 },
                teamB: { avgGoalsScored: 2.1, avgGoalsConceded: 0.7, daysSinceLastMatch: 9 }
            },
            keyPositives: ["Incredible home record (14W-1D-0L)", "Stronger offensive metrics than Porto", "Di María in excellent form", "Porto have struggled in their last few away games"],
            keyNegatives: ["Porto is a very experienced and resilient team", "'O Clássico' is always a tight affair"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 45, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 25, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 15, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 15, color: 'bg-amber-500' }],
            expectedValue: 9.5,
            kellyStakePercentage: 2.8,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 65, significantOddsMovement: false },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Home/Away Analysis', status: 'pass', reason: 'Benfica\'s home form is a massive factor.' },
                { step: 'Key Player Analysis', status: 'pass', reason: 'Benfica\'s key attackers are in better form.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 9.5%, good value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "The Portuguese press is expecting Benfica to take a huge step towards the title with a win. The atmosphere at the Estádio da Luz is expected to be electric.",
                socialMediaKeywords: ["#LigaPortugal", "#OClássico", "#SLBenfica", "#FCPorto"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "API-Football", status: DataSourceStatus.PreMatch, metrics: [{name: "Home Win %", value: "93%"}, {name: "Away Win %", value: "65%"}] },
            ]
        }
    },
    {
        id: "tur-gal-fen",
        sport: "Soccer",
        teamA: "Galatasaray",
        teamAId: 611,
        teamB: "Fenerbahçe",
        teamBId: 610,
        league: "Süper Lig",
        matchDate: formatDate(twentySixDaysOut),
        prediction: "Galatasaray to Win",
        marketType: "Match Winner",
        confidence: ConfidenceTier.High,
        odds: 2.05,
        reasoning: "The Intercontinental Derby. Galatasaray's home stadium, 'RAMS Park', is one of the most intimidating in the world. The AI's model, which weights crowd influence heavily, gives Galatasaray a decisive edge in this title-deciding match.",
        stadium: "RAMS Park",
        aiAnalysis: {
            bettingAngle: "The AI identifies a 15% increase in home team win probability for this specific derby compared to a standard league match, due to the extreme crowd hostility. This factor is not fully priced into the market, creating value.",
            formAnalysis: { teamA: 'WWWWW', teamB: 'WWWDW' },
            playerAnalysis: [
                { name: 'Mauro Icardi', team: 'A', impact: 'Galatasaray\'s star striker, a clinical finisher who thrives in big games.' },
                { name: 'Edin Džeko', team: 'B', impact: 'Fenerbahçe\'s veteran forward, his experience and goalscoring are crucial.' }
            ],
            gameScenario: {
                narrative: "An incredibly hostile and passionate atmosphere will greet Fenerbahçe. Galatasaray will feed off this energy, pressing high and playing aggressively from the start. Fenerbahçe will need to weather an early storm. The AI predicts Galatasaray will score early and use their defensive organization to see out a narrow, hard-fought victory.",
                scorePrediction: "2-1",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Mauro Icardi is projected to be the match-winner.' },
                    { eventType: 'Discipline', likelihood: 'High', description: 'A red card is a very strong possibility.' }
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 2.8, avgGoalsConceded: 0.7, daysSinceLastMatch: 7 },
                teamB: { avgGoalsScored: 2.7, avgGoalsConceded: 0.8, daysSinceLastMatch: 7 }
            },
            keyPositives: ["Massive home-field advantage ('Hell')", "Better current form", "Icardi's clutch goalscoring record", "Fenerbahçe's poor record in this fixture away from home"],
            keyNegatives: ["Fenerbahçe has a squad full of experienced stars", "Derbies are always unpredictable"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 55, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 20, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 15, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 18.2,
            kellyStakePercentage: 4.5,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 70, significantOddsMovement: true },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Venue/Crowd Analysis', status: 'pass', reason: 'One of the strongest home advantages in football.' },
                { step: 'Key Player Matchup', status: 'pass', reason: 'Icardi is in better form than Džeko.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 18.2%, excellent value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "Turkish media is consumed by the derby. All narratives point towards a Galatasaray victory, sealing the league title in front of their fanatical supporters.",
                socialMediaKeywords: ["#SüperLig", "#GALvFEN", "Galatasaray", "Fenerbahçe"]
            },
            dataSources: [
                 { category: "Venue Stats", provider: "TFF.org", status: DataSourceStatus.PreMatch, metrics: [{name: "Home Win %", value: "89%"}, {name: "Away Losses (Fener)", value: "4 of last 5 at Gala"}] },
            ]
        }
    },
    {
        id: "sco-cel-ran",
        sport: "Soccer",
        teamA: "Celtic",
        teamAId: 247,
        teamB: "Rangers",
        teamBId: 262,
        league: "Scottish Premiership",
        matchDate: formatDate(twentySevenDaysOut),
        prediction: "Celtic -1.0 (Asian Handicap)",
        marketType: "Handicap",
        confidence: ConfidenceTier.Medium,
        odds: 2.10,
        reasoning: "The Old Firm derby at Celtic Park. The AI's analysis of 'chances created' in home vs. away scenarios shows Celtic creates 60% more high-quality chances at home, predicting they will win by at least two goals.",
        stadium: "Celtic Park",
        aiAnalysis: {
            bettingAngle: "The model indicates that while a simple win is likely, the true value lies in the handicap market. Celtic's offensive output explodes at home, particularly in this fixture, giving them a high probability of covering the -1.0 spread (win by 2+).",
            formAnalysis: { teamA: 'WWWDW', teamB: 'WLWWW' },
            playerAnalysis: [
                { name: 'Kyogo Furuhashi', team: 'A', impact: 'Celtic\'s dynamic Japanese forward, his movement and finishing are top class.' },
                { name: 'James Tavernier', team: 'B', impact: 'Rangers\' captain and right-back, an incredible source of goals and assists from defense.' }
            ],
            gameScenario: {
                narrative: "Celtic will dominate the ball and play with high intensity, roared on by their home crowd. Rangers will look to stay compact and hit on the counter-attack. The AI predicts Celtic's relentless pressure will eventually break Rangers down, leading to a comfortable victory in the second half.",
                scorePrediction: "3-1",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Kyogo is projected to score.' },
                    { eventType: 'Pace Change', likelihood: 'High', description: 'Celtic will play at a very high tempo.' }
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 3.1, avgGoalsConceded: 0.8, daysSinceLastMatch: 7 },
                teamB: { avgGoalsScored: 2.5, avgGoalsConceded: 0.6, daysSinceLastMatch: 8 }
            },
            keyPositives: ["Dominant home record", "Superior attacking metrics", "Rangers have struggled defensively in recent away games", "Strong record against Rangers at Celtic Park"],
            keyNegatives: ["Rangers' threat from set-pieces (Tavernier)", "The 'anything can happen' nature of a derby"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 45, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 25, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 15, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 15, color: 'bg-amber-500' }],
            expectedValue: 11.5,
            kellyStakePercentage: 3.1,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 75, significantOddsMovement: false },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Home Offensive Analysis', status: 'pass', reason: 'Celtic\'s home attack is statistically dominant.' },
                { step: 'H2H at Venue', status: 'pass', reason: 'Celtic has won 4 of the last 5 at home.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 11.5%, good value on the handicap.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "The Scottish press is building up the title-deciding Old Firm. Most pundits are backing Celtic's firepower at home to be too much for Rangers.",
                socialMediaKeywords: ["#OldFirm", "#CelticFC", "#RangersFC", "ScottishFootball"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "SPFL API", status: DataSourceStatus.PreMatch, metrics: [{name: "Home Goals/G", value: "3.1"}, {name: "Away Goals Conceded/G", value: "1.2"}] },
            ]
        }
    },
    {
        id: "efl-lee-lei",
        sport: "Soccer",
        teamA: "Leeds United",
        teamAId: 341,
        teamB: "Leicester City",
        teamBId: 46,
        league: "EFL Championship",
        matchDate: formatDate(twentyEightDaysOut),
        prediction: "Over 2.5 Goals",
        marketType: "Total Goals",
        confidence: ConfidenceTier.High,
        odds: 1.75,
        reasoning: "A promotion six-pointer between the two best attacking teams in the Championship. The AI model projects a combined xG of 3.4, as both teams' attacking styles and defensive vulnerabilities point to a high-scoring game.",
        stadium: "Elland Road",
        aiAnalysis: {
            bettingAngle: "The model identifies that when two top-6 Championship teams with high offensive ratings meet, the 'Over 2.5 Goals' bet has a historical hit rate of 72%. The market odds of 1.75 (57% implied probability) offer significant value.",
            formAnalysis: { teamA: 'WWWWW', teamB: 'WWWLW' },
            playerAnalysis: [
                { name: 'Crysencio Summerville', team: 'A', impact: 'Leeds\' tricky and prolific winger, one of the best players in the league.' },
                { name: 'Jamie Vardy', team: 'B', impact: 'The veteran Leicester striker is still a clinical finisher at this level.' }
            ],
            gameScenario: {
                narrative: "An end-to-end, high-tempo match is guaranteed. Both teams will play on the front foot, creating numerous chances. The atmosphere at Elland Road will be electric, pushing Leeds forward. Expect both teams to score in an entertaining game that could decide automatic promotion.",
                scorePrediction: "2-2",
                keyEvents: [
                    { eventType: 'Key Score', likelihood: 'High', description: 'A goal from a fast counter-attack is highly probable.' },
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Summerville is projected to have a goal or an assist.' }
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 2.1, avgGoalsConceded: 0.9, daysSinceLastMatch: 6 },
                teamB: { avgGoalsScored: 2.0, avgGoalsConceded: 1.0, daysSinceLastMatch: 6 }
            },
            keyPositives: ["#1 and #2 attacks in the league", "Both teams average over 1.8 goals per game", "Both teams play an open, attacking style", "Key attacking players are in top form"],
            keyNegatives: ["High stakes could lead to a more cautious approach", "Both teams have quality goalkeepers"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 50, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 25, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 15, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 10.2,
            kellyStakePercentage: 3.9,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 85, significantOddsMovement: false },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Offensive Metrics Analysis', status: 'pass', reason: 'Both teams are elite offensively for the league.' },
                { step: 'Tactical Matchup', status: 'pass', reason: 'Styles of play favor an open game.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 10.2%, good value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "The English football media is billing this as the 'Championship game of the season'. A high-scoring, exciting match is the consensus prediction.",
                socialMediaKeywords: ["#LUFC", "#LCFC", "#EFL", "Championship"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "EFL API", status: DataSourceStatus.PreMatch, metrics: [{name: "Goals For", value: "75 (1st) - 72 (2nd)"}, {name: "xG/90", value: "1.9 - 1.8"}] },
            ]
        }
    },
    {
        id: "sau-nas-hil",
        sport: "Soccer",
        teamA: "Al-Nassr",
        teamAId: 2084,
        teamB: "Al-Hilal",
        teamBId: 2093,
        league: "Saudi Pro League",
        matchDate: formatDate(twentyNineDaysOut),
        prediction: "Al-Hilal to Win",
        marketType: "Match Winner",
        confidence: ConfidenceTier.Medium,
        odds: 2.20,
        reasoning: "While Al-Nassr has Ronaldo, Al-Hilal has been the far more dominant and complete team this season. The AI model highlights Al-Hilal's superior defensive record and midfield control as the key factors for a victory.",
        stadium: "KSU Stadium",
        aiAnalysis: {
            bettingAngle: "The model's analysis of 'team chemistry' and 'tactical balance' gives a significant edge to Al-Hilal, who play a more cohesive style. The market is slightly overvaluing the 'Ronaldo factor', creating value on the away win.",
            formAnalysis: { teamA: 'WWLWW', teamB: 'WWWWW' },
            playerAnalysis: [
                { name: 'Cristiano Ronaldo', team: 'A', impact: 'One of the greatest goalscorers of all time, Al-Nassr\'s entire attack flows through him.' },
                { name: 'Sergej Milinković-Savić', team: 'B', impact: 'Al-Hilal\'s dominant central midfielder, he controls the tempo of the game.' }
            ],
            gameScenario: {
                narrative: "A star-studded affair. Al-Nassr will be direct, looking to get the ball to Ronaldo as quickly as possible. Al-Hilal will be more patient, controlling possession through their dominant midfield and using their wingers to create chances. The AI predicts Al-Hilal's midfield will starve Ronaldo of service and their balanced attack will be too much for Al-Nassr's defense.",
                scorePrediction: "1-2",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Milinković-Savić is projected to dominate the midfield battle.' },
                    { eventType: 'Key Score', likelihood: 'Medium', description: 'A goal from outside the box is a possibility with the talent on display.' }
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 2.9, avgGoalsConceded: 1.2, daysSinceLastMatch: 6 },
                teamB: { avgGoalsScored: 3.1, avgGoalsConceded: 0.5, daysSinceLastMatch: 6 }
            },
            keyPositives: ["Unbeaten all season", "Far superior defensive record", "More balanced and cohesive team", "Dominant midfield"],
            keyNegatives: ["Facing Cristiano Ronaldo", "Playing away from home in a derby environment"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 40, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 30, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 20, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 8.5,
            kellyStakePercentage: 2.5,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 55, significantOddsMovement: true },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Team Cohesion Analysis', status: 'pass', reason: 'Al-Hilal is a more balanced unit.' },
                { step: 'Defensive Matchup', status: 'pass', reason: 'Al-Hilal has a clear defensive advantage.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 8.5%, good value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "The focus is on the star power, particularly Ronaldo vs. the unbeaten Al-Hilal. Most neutral analysts favor Al-Hilal as the better overall team.",
                socialMediaKeywords: ["#RoshnSaudiLeague", "#AlNassr", "#AlHilal", "Ronaldo"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "SPL API", status: DataSourceStatus.PreMatch, metrics: [{name: "Goals Conceded", value: "34 - 15"}, {name: "Winning Streak", value: "3 - 24"}] },
            ]
        }
    },
    {
        id: "uel-rom-b04",
        sport: "Soccer",
        teamA: "AS Roma",
        teamAId: 497,
        teamB: "Bayer Leverkusen",
        teamBId: 168,
        league: "UEFA Europa League",
        matchDate: formatDate(thirtyDaysOut),
        prediction: "Leverkusen to Win",
        marketType: "Match Winner",
        confidence: ConfidenceTier.Medium,
        odds: 2.00,
        reasoning: "Bayer Leverkusen's incredible unbeaten season is a key factor. The AI's model highlights their superior tactical system and late-game resilience, predicting they will overcome Roma's strong home atmosphere.",
        stadium: "Stadio Olimpico",
        aiAnalysis: {
            bettingAngle: "The market is giving too much weight to Roma's home advantage under De Rossi. Leverkusen's statistical dominance across all metrics (xG, xGA, possession) this season makes them a value bet to win, even away from home in a European semi-final.",
            formAnalysis: { teamA: 'WDLWW', teamB: 'WWWWW' },
            playerAnalysis: [
                { name: 'Paulo Dybala', team: 'A', impact: 'Roma\'s creative spark, his left foot can unlock any defense.' },
                { name: 'Florian Wirtz', team: 'B', impact: 'Leverkusen\'s generational young talent, the key to their fluid attacking system.' }
            ],
            gameScenario: {
                narrative: "A fascinating tactical battle between De Rossi's passionate Roma and Xabi Alonso's invincible Leverkusen. Roma will be compact and look to counter. Leverkusen will dominate possession and methodically probe for openings. The AI predicts Leverkusen's patience and superior quality will shine through, likely with a late winner, as has been their trademark all season.",
                scorePrediction: "1-2",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Florian Wirtz is projected to be the most influential player on the pitch.' },
                    { eventType: 'Key Score', likelihood: 'Medium', description: 'A goal after the 85th minute is a distinct possibility for Leverkusen.' }
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 1.9, avgGoalsConceded: 1.1, daysSinceLastMatch: 4 },
                teamB: { avgGoalsScored: 2.8, avgGoalsConceded: 0.8, daysSinceLastMatch: 4 }
            },
            keyPositives: ["Unbeaten in all competitions", "Tactically superior system under Xabi Alonso", "Incredible team spirit and belief", "Deeper and more talented squad"],
            keyNegatives: ["Playing in the intimidating Stadio Olimpico", "Roma's strong record in European home games"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 45, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 25, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 15, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 15, color: 'bg-amber-500' }],
            expectedValue: 10.0,
            kellyStakePercentage: 3.0,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 60, significantOddsMovement: true },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Form & Momentum', status: 'pass', reason: 'Leverkusen\'s historic season is a key factor.' },
                { step: 'Tactical Analysis', status: 'pass', reason: 'Alonso\'s system is superior.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 10.0%, good value.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "European football media is captivated by Leverkusen's unbeaten run. While acknowledging Roma's threat, most pundits are backing Leverkusen to continue their historic season.",
                socialMediaKeywords: ["#UEL", "#RomaB04", "#ForzaRoma", "#Bayer04"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "UEFA API", status: DataSourceStatus.PreMatch, metrics: [{name: "Unbeaten Streak", value: "4 - 45+"}, {name: "Goals For (UEL)", value: "22 - 28"}] },
            ]
        }
    },
    {
        id: "lib-flu-ldu",
        sport: "Soccer",
        teamA: "Fluminense",
        teamAId: 131,
        teamB: "LDU Quito",
        teamBId: 2351,
        league: "Copa Libertadores",
        matchDate: formatDate(twentyDaysOut),
        prediction: "Fluminense -1.5 (Asian Handicap)",
        marketType: "Handicap",
        confidence: ConfidenceTier.Medium,
        odds: 2.30,
        reasoning: "LDU Quito's performance drops significantly when playing away from their high-altitude home. The AI model highlights Fluminense's technical superiority and strong home form at the Maracanã to win comfortably.",
        stadium: "Maracanã",
        aiAnalysis: {
            bettingAngle: "The model applies a significant negative adjustment to LDU Quito's power rating for sea-level away games. This adjustment projects a 2-goal victory margin for Fluminense, making the -1.5 handicap a strong value bet.",
            formAnalysis: { teamA: 'WLDWW', teamB: 'WWDLW' },
            playerAnalysis: [
                { name: 'Germán Cano', team: 'A', impact: 'Fluminense\'s veteran Argentine striker, a lethal finisher in the box.' },
                { name: 'Alexander Alvarado', team: 'B', impact: 'LDU Quito\'s creative attacker and primary playmaker.' }
            ],
            gameScenario: {
                narrative: "Fluminense will dominate possession from the start, utilizing their patient, technical build-up play. LDU Quito will likely sit deep, absorb pressure, and hope to score on a counter-attack or set-piece. The AI predicts Fluminense's quality and home advantage will be too much, with them scoring in both halves to secure a convincing win.",
                scorePrediction: "3-0",
                keyEvents: [
                    { eventType: 'Key Performer', likelihood: 'High', description: 'Fluminense is projected to have over 65% possession.' },
                    { eventType: 'Key Score', likelihood: 'Medium', description: 'A goal from Germán Cano is highly probable.' }
                ]
            },
            statisticalProfile: {
                teamA: { avgGoalsScored: 2.0, avgGoalsConceded: 1.0, daysSinceLastMatch: 4 },
                teamB: { avgGoalsScored: 1.5, avgGoalsConceded: 0.8, daysSinceLastMatch: 5 }
            },
            keyPositives: ["LDU Quito's terrible away record at sea-level", "Fluminense's strong home form at the Maracanã", "Technical and tactical superiority", "Defending Copa Libertadores champions"],
            keyNegatives: ["LDU Quito is a resilient and well-coached team", "Fluminense can sometimes be wasteful in front of goal"],
            confidenceBreakdown: [{ model: 'XGBoost', weight: 50, color: 'bg-green-500' }, { model: 'LSTM Network', weight: 20, color: 'bg-sky-500' }, { model: 'Graph Network', weight: 20, color: 'bg-purple-500' }, { model: 'Bayesian Net', weight: 10, color: 'bg-amber-500' }],
            expectedValue: 15.0,
            kellyStakePercentage: 3.8,
            marketInsights: { sharpMoneyAlignment: true, publicBettingPercentage: 70, significantOddsMovement: false },
            riskLevel: RiskLevel.Moderate,
            decisionFlow: [
                { step: 'Altitude Adjustment', status: 'pass', reason: 'LDU Quito\'s power rating is significantly downgraded.' },
                { step: 'Home/Away Form', status: 'pass', reason: 'Strong contrast in form for both teams.' },
                { step: 'Value Check (EV > 5%)', status: 'pass', reason: 'EV is 15.0%, excellent value on the handicap.' },
                { step: 'Final Output', status: 'pass', reason: 'Recommendation generated.' }
            ],
            sentimentAnalysis: {
                overallSentiment: Sentiment.Positive,
                newsSummary: "South American football experts are heavily backing Fluminense to win at home, citing LDU Quito's well-documented struggles away from the altitude of Quito.",
                socialMediaKeywords: ["#Libertadores", "#Fluminense", "#LDU", "GloriaEterna"]
            },
            dataSources: [
                 { category: "Team Stats", provider: "CONMEBOL API", status: DataSourceStatus.PreMatch, metrics: [{name: "LDU Away Wins (Sea Level)", value: "1 of last 10"}, {name: "Flu Home Wins", value: "8 of last 10"}] },
            ]
        }
    }
// FIX: Add 'as const' to ensure TypeScript infers literal types for properties like 'status',
// satisfying the strict union types defined in 'types.ts' and resolving the type error.
] as const;

const mockPredictions: MatchPrediction[] = rawPredictions.map(p => ({
    ...p,
    aiAnalysis: {
        ...p.aiAnalysis,
        estimatedWinProbability: calculateProbFromEV(p.aiAnalysis.expectedValue, p.odds),
    }
}));


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
    
    // FIX: Declare the 'variations' array, which was previously used without being initialized.
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