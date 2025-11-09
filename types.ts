// types.ts
export enum MarketType {
    MatchWinner = 'Match Winner',
    TotalGoals = 'Total Goals (O/U)',
    PointSpread = 'Point Spread',
    PlayerProp = 'Player Prop',
    Parlay = 'Parlay', // Internal type for ticket variations
}

export enum ConfidenceTier {
    High = 'High',
    Medium = 'Medium',
    Low = 'Low',
}

export enum Momentum {
    TeamA = 'TeamA',
    TeamB = 'TeamB',
    Neutral = 'Neutral',
}

export enum RiskLevel {
    Conservative = 'Conservative',
    Moderate = 'Moderate',
    Aggressive = 'Aggressive',
}

export enum Sentiment {
    Positive = 'Positive',
    Negative = 'Negative',
    Neutral = 'Neutral',
}

export enum DataSourceStatus {
    Live = 'Live',
    // FIX: Changed value from 'Error' to 'Pre-Match' to prevent duplicate enum values.
    PreMatch = 'Pre-Match',
    Error = 'Error',
}

export type GameEventType = 'Key Score' | 'Discipline' | 'Turnover' | 'Injury' | 'Pace Change' | 'Key Performer';

export interface GameScenario {
    narrative: string;
    scorePrediction?: string;
    keyEvents: readonly {
        eventType: GameEventType;
        likelihood: 'High' | 'Medium' | 'Low';
        description: string;
    }[];
}

export interface DataSourceMetric {
    name: string;
    value: string;
}

export interface DataSource {
    category: string;
    provider: string;
    status: DataSourceStatus;
    metrics: readonly DataSourceMetric[];
}

export interface SentimentAnalysis {
    overallSentiment: Sentiment;
    newsSummary: string;
    socialMediaKeywords: readonly string[];
}

export interface AIDecisionFlowStep {
    step: string;
    status: 'pass' | 'fail' | 'neutral';
    reason: string;
}

export interface AIAnalysis {
    keyPositives: readonly string[];
    keyNegatives: readonly string[];
    confidenceBreakdown: readonly {
        model: string;
        weight: number;
        color: string;
    }[];
    expectedValue: number;
    estimatedWinProbability: number;
    kellyStakePercentage: number;
    marketInsights: {
        sharpMoneyAlignment: boolean;
        publicBettingPercentage: number;
        significantOddsMovement: boolean;
        oddsMovementDirection?: 'up' | 'down';
    };
    riskLevel: RiskLevel;
    decisionFlow: readonly AIDecisionFlowStep[];
    sentimentAnalysis: SentimentAnalysis;
    dataSources: readonly DataSource[];
    formAnalysis: { 
        teamA: string; 
        teamB: string; 
    };
    playerAnalysis: readonly { 
        name: string;
        team: 'A' | 'B';
        impact: string;
    }[];
    bettingAngle: string;
    gameScenario: GameScenario;
    statisticalProfile?: {
        teamA: {
            avgGoalsScored: number;
            avgGoalsConceded: number;
            daysSinceLastMatch: number;
        };
        teamB: {
            avgGoalsScored: number;
            avgGoalsConceded: number;
            daysSinceLastMatch: number;
        };
    };
}

export interface MatchPrediction {
    id: string;
    matchId: string; // New field to group markets for the same game
    sport: string; 
    teamA: string;
    teamAId: number;
    teamB: string;
    teamBId: number;
    league: string;
    matchDate: string;
    prediction: string;
    marketType: MarketType;
    marketValue?: number; // e.g. 2.5 for O/U, -1.5 for spread
    confidence: ConfidenceTier;
    odds: number;
    reasoning: string;
    aiAnalysis: AIAnalysis;
    stadium?: string;
    referee?: string;
    attendance?: number;
}

export interface LiveMatchPrediction extends MatchPrediction {
    scoreA: number;
    scoreB: number;
    matchTime: number;
    momentum: Momentum;
    liveOdds: number;
    cashOutRecommendation: {
        isRecommended: boolean;
        value: number | null;
        reason: string | null;
    };
    hasValueAlert: boolean;
}

export interface HeadToHeadFixture {
    fixtureId: number;
    date: string;
    homeTeam: string;
    awayTeam: string;
    goals: {
        home: number | null;
        away: number | null;
    };
}

export interface OddsHistoryPoint {
    date: string;
    oddsA: number;
    oddsB: number;
    oddsDraw: number;
}

export interface UserSettings {
    maxStakePerBet: number;
    maxDailyStake: number;
}

export interface BankrollState {
    initial: number;
    current: number;
    totalWagered: number;
    totalReturned: number;
    dailyWagered: number;
}

export interface UserBet {
    id: string;
    match: MatchPrediction;
    stake: number;
    odds: number;
    status: 'pending' | 'won' | 'lost' | 'cashed-out';
    payout: number | null;
    placedAt: Date;
    selections?: MatchPrediction[];
    cashedOutAmount?: number;
}

export type TicketSelection = MatchPrediction;

export interface TicketVariation {
    title: string;
    description: string;
    bets: {
        prediction: MatchPrediction;
        stake: number;
    }[];
    totalStake: number;
    potentialReturn: number;
    winProbability: number;
    totalEV: number;
}

export interface FilterState {
    sport: string; 
    league: string;
    marketType: string;
    confidence: ConfidenceTier | 'All';
    sortBy: 'matchDate' | 'highestOdds' | 'lowestOdds' | 'highestEV' | 'highestConfidence';
    searchTerm: string;
}

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}