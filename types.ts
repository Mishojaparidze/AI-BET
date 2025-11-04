// Fix: Removed circular import from './types' and all implementation code. This file should only contain type definitions.

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

export interface AIDecisionFlowStep {
    step: string;
    status: 'pass' | 'fail' | 'neutral';
    reason: string;
}

export interface AIAnalysis {
    keyPositives: string[];
    keyNegatives: string[];
    confidenceBreakdown: {
        model: string;
        weight: number;
        color: string;
    }[];
    expectedValue: number;
    kellyStakePercentage: number;
    marketInsights: {
        sharpMoneyAlignment: boolean;
        publicBettingPercentage: number;
        significantOddsMovement: boolean;
    };
    riskLevel: RiskLevel;
    decisionFlow: AIDecisionFlowStep[];
}

export interface MatchPrediction {
    teamA: string;
    teamB: string;
    league: string;
    matchDate: string;
    prediction: string;
    confidence: ConfidenceTier;
    odds: number;
    reasoning: string;
    aiAnalysis: AIAnalysis;
}

export interface LiveMatchPrediction extends MatchPrediction {
    id: number;
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

export interface BankrollState {
    initial: number;
    current: number;
    totalWagered: number;
    totalReturned: number;
}

export interface UserBet {
    id: string;
    match: MatchPrediction;
    stake: number;
    odds: number;
    status: 'pending' | 'won' | 'lost';
    payout: number | null;
    placedAt: Date;
    selections?: MatchPrediction[];
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
    league: string;
    confidence: ConfidenceTier | 'All';
    sortBy: 'matchDate' | 'highestOdds' | 'highestEV';
}
