// types.ts
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
    PreMatch = 'Pre-Match',
    Error = 'Error',
}

export type GameEventType = 'Key Score' | 'Discipline' | 'Turnover' | 'Injury' | 'Pace Change' | 'Key Performer';

export interface GameScenario {
    narrative: string;
    scorePrediction?: string;
    // FIX: Use readonly array to match 'as const' inference from apiService.ts
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
    // FIX: Use readonly array to match 'as const' inference from apiService.ts
    metrics: readonly DataSourceMetric[];
}

export interface SentimentAnalysis {
    overallSentiment: Sentiment;
    newsSummary: string;
    // FIX: Use readonly array to match 'as const' inference from apiService.ts
    socialMediaKeywords: readonly string[];
}

export interface AIDecisionFlowStep {
    step: string;
    status: 'pass' | 'fail' | 'neutral';
    reason: string;
}

export interface AIAnalysis {
    // FIX: Use readonly array to match 'as const' inference from apiService.ts
    keyPositives: readonly string[];
    // FIX: Use readonly array to match 'as const' inference from apiService.ts
    keyNegatives: readonly string[];
    // FIX: Use readonly array to match 'as const' inference from apiService.ts
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
    };
    riskLevel: RiskLevel;
    // FIX: Use readonly array to match 'as const' inference from apiService.ts
    decisionFlow: readonly AIDecisionFlowStep[];
    sentimentAnalysis: SentimentAnalysis;
    // FIX: Use readonly array to match 'as const' inference from apiService.ts
    dataSources: readonly DataSource[];
    formAnalysis: { 
        teamA: string; 
        teamB: string; 
    };
    // FIX: Use readonly array to match 'as const' inference from apiService.ts
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
    sport: string; 
    teamA: string;
    teamAId: number;
    teamB: string;
    teamBId: number;
    league: string;
    matchDate: string;
    prediction: string;
    marketType: string;
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
    sortBy: 'matchDate' | 'highestOdds' | 'highestEV';
}