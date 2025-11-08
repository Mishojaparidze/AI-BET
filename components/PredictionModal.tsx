import React, { useState, useEffect } from 'react';
import { type MatchPrediction, RiskLevel, type AIDecisionFlowStep, Sentiment, type DataSource, DataSourceStatus, type UserSettings, type BankrollState, type HeadToHeadFixture, type GameScenario, type GameEventType } from '../types';
import * as apiService from '../services/apiService';
import { Accordion } from './Accordion';
import { LiveIntelligenceFeed } from './LiveIntelligenceFeed';
import { HeadToHeadAnalysis } from './HeadToHeadAnalysis';

// Icons
const CheckCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
);

const XCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
);

const AlertCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

const BetIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
);

const ThumbsUpIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a2 2 0 0 1 3 3.88Z" />
    </svg>
);

const ThumbsDownIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a2 2 0 0 1-3-3.88Z" />
    </svg>
);

const MinusCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="8" y1="12" x2="16" y2="12" />
    </svg>
);

const StarIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

const TrophyIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M9.17 9a3 3 0 0 0 5.66 0"/></svg>
);

const AlertTriangleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);

const RefreshCwIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v6h6"/><path d="M21 12A9 9 0 0 0 6 5.3L3 8"/><path d="M21 22v-6h-6"/><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"/></svg>
);

const HeartPulseIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.7-1 2.1 4.4 3-5.5H21"/></svg>
);

const ZapIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

const TrendingUpIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

const TrendingDownIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline>
    </svg>
);

const CalendarIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

const DatabaseIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
);

const MessageSquareIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

const CalculatorIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="12" y1="10" x2="12" y2="18"/><line x1="8" y1="14" x2="16" y2="14"/></svg>
);

const CpuIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
);

const TagIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
);

const ScaleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path><path d="M12 22V12"></path></svg>
);

const DollarSignIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);

const HistoryIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);

const ShieldCheckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

const LayersIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
);


interface PredictionModalProps {
    prediction: MatchPrediction;
    bankrollState: BankrollState;
    userSettings: UserSettings;
    onClose: () => void;
    onPlaceBet: (prediction: MatchPrediction, stake: number) => void;
}

const RiskBadge: React.FC<{riskLevel: RiskLevel}> = ({ riskLevel }) => {
    const styles = {
        [RiskLevel.Conservative]: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
        [RiskLevel.Moderate]: 'bg-brand-yellow/20 text-brand-yellow border-brand-yellow/30',
        [RiskLevel.Aggressive]: 'bg-brand-red/20 text-brand-red border-brand-red/30',
    };
    return (
        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${styles[riskLevel]}`}>
            {riskLevel} Risk
        </span>
    );
};

const DecisionFlowItem: React.FC<{item: AIDecisionFlowStep}> = ({ item }) => {
    const icons = {
        pass: <CheckCircleIcon className="w-5 h-5 text-brand-green" />,
        fail: <XCircleIcon className="w-5 h-5 text-brand-red" />,
        neutral: <AlertCircleIcon className="w-5 h-5 text-brand-yellow" />,
    };

    const colors = {
        pass: 'text-brand-text-primary',
        fail: 'text-brand-red/80',
        neutral: 'text-brand-yellow/90',
    };

    return (
         <li className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">{icons[item.status]}</div>
            <div>
                <p className={`font-semibold ${colors[item.status]}`}>{item.step}</p>
                <p className="text-xs text-brand-text-secondary">{item.reason}</p>
            </div>
        </li>
    );
};

const SentimentBadge: React.FC<{sentiment: Sentiment}> = ({ sentiment }) => {
    const config = {
        [Sentiment.Positive]: {
            icon: <ThumbsUpIcon className="w-4 h-4 mr-2" />,
            text: 'Positive',
            style: 'text-brand-green'
        },
        [Sentiment.Negative]: {
            icon: <ThumbsDownIcon className="w-4 h-4 mr-2" />,
            text: 'Negative',
            style: 'text-brand-red'
        },
        [Sentiment.Neutral]: {
            icon: <MinusCircleIcon className="w-4 h-4 mr-2" />,
            text: 'Neutral',
            style: 'text-brand-yellow'
        }
    }
    const { icon, text, style } = config[sentiment];
    return (
        <div className={`flex items-center text-lg font-bold ${style}`}>
            {icon}
            <span>{text}</span>
        </div>
    );
}

const FormDisplay: React.FC<{form: string}> = ({ form }) => {
    const items = form.split('');
    return (
        <div className="flex items-center gap-1.5">
            {items.map((result, index) => {
                let color = '';
                if (result === 'W') color = 'bg-brand-green';
                else if (result === 'D') color = 'bg-brand-yellow';
                else if (result === 'L') color = 'bg-brand-red';
                else color = 'bg-brand-border';
                return <span key={index} className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-md ${color} text-brand-bg-dark`}>{result}</span>
            })}
        </div>
    );
};

const getKeyEventIcon = (eventType: GameEventType) => {
    const iconClass = "w-4 h-4 mr-2 mt-0.5 flex-shrink-0";
    switch(eventType) {
        case 'Key Score': return <TrophyIcon className={`${iconClass} text-brand-green`} />;
        case 'Discipline': return <AlertTriangleIcon className={`${iconClass} text-brand-red`} />;
        case 'Turnover': return <RefreshCwIcon className={`${iconClass} text-brand-yellow`} />;
        case 'Injury': return <HeartPulseIcon className={`${iconClass} text-brand-red`} />;
        case 'Pace Change': return <ZapIcon className={`${iconClass} text-sky-400`} />;
        case 'Key Performer': return <StarIcon className={`${iconClass} text-brand-yellow`} />;
        default: return null;
    }
}

const KeyEvent: React.FC<{ event: GameScenario['keyEvents'][0] }> = ({ event }) => {
    const likelihoodStyles = {
        High: 'border-brand-green/50',
        Medium: 'border-brand-yellow/50',
        Low: 'border-brand-border',
    }
    
    return (
        <li className={`flex items-start text-sm bg-brand-bg-dark p-3 rounded-md border-l-4 ${likelihoodStyles[event.likelihood]}`}>
            {getKeyEventIcon(event.eventType)}
            <div>
                <span className="font-bold">{event.eventType}</span>
                <span className="text-brand-text-secondary"> - {event.description}</span>
                <span className="text-xs font-bold text-brand-text-secondary ml-2">({event.likelihood})</span>
            </div>
        </li>
    );
};

export const PredictionModal: React.FC<PredictionModalProps> = ({ prediction, bankrollState, userSettings, onClose, onPlaceBet }) => {
    const { teamA, teamB, league, matchDate, prediction: bet, odds, aiAnalysis, teamAId, teamBId } = prediction;
    const [h2hData, setH2hData] = useState<HeadToHeadFixture[] | null>(null);
    const [isH2hLoading, setIsH2hLoading] = useState<boolean>(true);
    
    useEffect(() => {
        const loadH2hData = async () => {
            setIsH2hLoading(true);
            try {
                const data = await apiService.fetchHeadToHead(teamAId, teamBId);
                setH2hData(data);
            } catch (error) {
                console.error("Failed to fetch H2H data:", error);
                setH2hData([]); // Set to empty array on error to show 'No data' message
            } finally {
                setIsH2hLoading(false);
            }
        };
        loadH2hData();
    }, [teamAId, teamBId]);


    const suggestedStake = bankrollState.current * (aiAnalysis.kellyStakePercentage / 100);
    const isBetBlockedByAI = aiAnalysis.decisionFlow.some(step => step.status === 'fail');

    const remainingDailyLimit = userSettings.maxDailyStake - bankrollState.dailyWagered;
    const isOverSingleBetLimit = suggestedStake > userSettings.maxStakePerBet;
    const isOverDailyLimit = suggestedStake > remainingDailyLimit;
    const isBetDisabled = bankrollState.current < suggestedStake || isBetBlockedByAI || isOverSingleBetLimit || isOverDailyLimit;
    
    let disabledTitle = '';
    if (isBetBlockedByAI) disabledTitle = 'Betting blocked by AI due to low value or high risk.';
    else if (bankrollState.current < suggestedStake) disabledTitle = 'Insufficient bankroll.';
    else if (isOverSingleBetLimit) disabledTitle = `Stake exceeds your max bet limit of $${userSettings.maxStakePerBet.toFixed(2)}.`;
    else if (isOverDailyLimit) disabledTitle = `Stake exceeds your remaining daily limit of $${remainingDailyLimit.toFixed(2)}.`;


    const handleBetClick = () => {
      onPlaceBet(prediction, suggestedStake);
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Derived values for the new calculation section
    const impliedProbability = 1 / odds;
    const identifiedEdge = aiAnalysis.estimatedWinProbability - impliedProbability;

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={handleOverlayClick}
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-brand-bg-light w-full max-w-5xl max-h-[90vh] rounded-2xl border-2 border-brand-green/50 shadow-2xl shadow-brand-green/10 flex flex-col overflow-hidden">
                <header className="p-6 border-b border-brand-border flex justify-between items-center flex-shrink-0">
                    <div>
                        <p className="text-sm font-medium text-brand-text-secondary uppercase tracking-wider">{league} - {matchDate}</p>
                        <h2 className="text-2xl font-bold text-brand-text-primary">{teamA} vs {teamB}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-brand-border transition-colors">
                        <XCircleIcon className="w-6 h-6 text-brand-text-secondary"/>
                    </button>
                </header>

                <main className="p-6 overflow-y-auto flex-grow">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column: Prediction & Staking */}
                        <div className="space-y-6 lg:col-span-1">
                             <div className="bg-brand-bg-dark rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-brand-text-secondary">AI Prediction</p>
                                        <p className="text-2xl font-bold text-brand-green">{bet}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-brand-text-secondary">Odds</p>
                                        <p className="text-3xl font-black text-brand-text-primary">{odds.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-brand-bg-dark rounded-lg p-4 text-center border-l-4 border-brand-yellow">
                                <p className="text-sm font-semibold text-brand-text-secondary mb-2">AI Betting Angle</p>
                                <p className="text-sm text-brand-text-primary italic">"{aiAnalysis.bettingAngle}"</p>
                            </div>
                            
                             {aiAnalysis.gameScenario.scorePrediction && (
                                <div className="bg-brand-bg-dark rounded-lg p-4 text-center">
                                    <p className="text-sm font-semibold text-brand-text-secondary mb-2">AI Predicted Score</p>
                                    <p className="text-3xl font-black text-brand-green">
                                        {aiAnalysis.gameScenario.scorePrediction}
                                    </p>
                                </div>
                            )}

                            <div className="bg-brand-bg-dark rounded-lg p-4 grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-sm font-medium text-brand-text-secondary">Expected Value (EV)</p>
                                    <p className={`text-2xl font-bold ${aiAnalysis.expectedValue > 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                                        {aiAnalysis.expectedValue > 0 ? '+' : ''}{aiAnalysis.expectedValue.toFixed(1)}%
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-brand-text-secondary">Kelly Stake</p>
                                    <p className="text-2xl font-bold text-brand-yellow">{aiAnalysis.kellyStakePercentage.toFixed(1)}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: AI Analysis Accordions */}
                        <div className="space-y-4 lg:col-span-2">
                             <Accordion title="Team Analysis" startOpen={true}>
                                <div className="space-y-6">
                                    {/* Strengths & Weaknesses */}
                                    <div>
                                        <h4 className="text-sm font-bold text-brand-text-secondary mb-3">Strengths & Weaknesses</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-brand-bg-light p-3 rounded-lg">
                                            <div>
                                                <p className="font-semibold text-brand-green mb-2">Key Positives</p>
                                                <ul className="space-y-2">
                                                    {aiAnalysis.keyPositives.map((factor, i) => (
                                                        <li key={i} className="flex items-start text-sm">
                                                            <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 text-brand-green flex-shrink-0"/>
                                                            <span>{factor}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-brand-red mb-2">Key Negatives</p>
                                                <ul className="space-y-2">
                                                    {aiAnalysis.keyNegatives.map((factor, i) => (
                                                        <li key={i} className="flex items-start text-sm">
                                                            <XCircleIcon className="w-4 h-4 mr-2 mt-0.5 text-brand-red flex-shrink-0"/>
                                                            <span>{factor}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Statistical Profile */}
                                    {aiAnalysis.statisticalProfile && (
                                        <div>
                                            <h4 className="text-sm font-bold text-brand-text-secondary mb-3">Statistical Profile</h4>
                                            <div className="bg-brand-bg-light p-4 rounded-lg space-y-3">
                                                <div className="grid grid-cols-3 gap-2 text-center text-xs text-brand-text-secondary">
                                                    <div></div> {/* Spacer */}
                                                    <div className="font-bold text-brand-text-primary truncate">{teamA}</div>
                                                    <div className="font-bold text-brand-text-primary truncate">{teamB}</div>
                                                </div>
                                                
                                                <div className="grid grid-cols-3 gap-2 items-center">
                                                    <div className="flex items-center text-sm text-brand-text-secondary"><TrendingUpIcon className="w-4 h-4 mr-2 text-brand-green"/>Avg. Score For</div>
                                                    <div className="text-center font-bold text-lg text-brand-text-primary bg-brand-bg-dark py-1 rounded-md">{aiAnalysis.statisticalProfile.teamA.avgGoalsScored.toFixed(1)}</div>
                                                    <div className="text-center font-bold text-lg text-brand-text-primary bg-brand-bg-dark py-1 rounded-md">{aiAnalysis.statisticalProfile.teamB.avgGoalsScored.toFixed(1)}</div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-2 items-center">
                                                    <div className="flex items-center text-sm text-brand-text-secondary"><TrendingDownIcon className="w-4 h-4 mr-2 text-brand-red"/>Avg. Score Against</div>
                                                    <div className="text-center font-bold text-lg text-brand-text-primary bg-brand-bg-dark py-1 rounded-md">{aiAnalysis.statisticalProfile.teamA.avgGoalsConceded.toFixed(1)}</div>
                                                    <div className="text-center font-bold text-lg text-brand-text-primary bg-brand-bg-dark py-1 rounded-md">{aiAnalysis.statisticalProfile.teamB.avgGoalsConceded.toFixed(1)}</div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-2 items-center">
                                                    <div className="flex items-center text-sm text-brand-text-secondary"><CalendarIcon className="w-4 h-4 mr-2"/>Rest Days</div>
                                                    <div className="text-center font-bold text-lg text-brand-text-primary bg-brand-bg-dark py-1 rounded-md">{aiAnalysis.statisticalProfile.teamA.daysSinceLastMatch}</div>
                                                    <div className="text-center font-bold text-lg text-brand-text-primary bg-brand-bg-dark py-1 rounded-md">{aiAnalysis.statisticalProfile.teamB.daysSinceLastMatch}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Form & Key Players */}
                                    <div>
                                        <h4 className="text-sm font-bold text-brand-text-secondary mb-3">Form & Key Players</h4>
                                        <div className="space-y-4 bg-brand-bg-light p-3 rounded-lg">
                                            <div>
                                                <h5 className="text-xs font-bold text-brand-text-secondary mb-2">Recent Form (Last 5)</h5>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold text-sm">{teamA}</span>
                                                        <FormDisplay form={aiAnalysis.formAnalysis.teamA} />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold text-sm">{teamB}</span>
                                                        <FormDisplay form={aiAnalysis.formAnalysis.teamB} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h5 className="text-xs font-bold text-brand-text-secondary mb-2">Players to Watch</h5>
                                                <ul className="space-y-2">
                                                    {aiAnalysis.playerAnalysis.map(player => (
                                                        <li key={player.name} className="flex items-start text-sm bg-brand-bg-dark p-2 rounded-md">
                                                             <StarIcon className="w-4 h-4 mr-2 mt-0.5 text-brand-yellow flex-shrink-0"/>
                                                             <div>
                                                                <span className="font-bold">{player.name}</span>
                                                                <span className="text-brand-text-secondary"> - {player.impact}</span>
                                                             </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    {/* AI Model Confidence */}
                                    <div>
                                        <h4 className="text-sm font-bold text-brand-text-secondary mb-3">Ensemble Model Confidence</h4>
                                        <div className="bg-brand-bg-light p-3 rounded-lg space-y-2">
                                            {aiAnalysis.confidenceBreakdown.map(model => (
                                                <div key={model.model}>
                                                    <div className="flex justify-between text-xs text-brand-text-secondary mb-1">
                                                        <span>{model.model}</span>
                                                        <span>{model.weight}%</span>
                                                    </div>
                                                    <div className="w-full bg-brand-border rounded-full h-2">
                                                        <div className={`${model.color} h-2 rounded-full`} style={{ width: `${model.weight}%`}}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Accordion>

                             <Accordion title="Predicted Game Scenario">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-brand-text-secondary mb-2">Match Narrative</h4>
                                        <p className="text-sm italic bg-brand-bg-light p-4 rounded-lg border-l-2 border-brand-border">"{aiAnalysis.gameScenario.narrative}"</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-brand-text-secondary mb-2">Potential Key Events</h4>
                                        <ul className="space-y-2">
                                            {aiAnalysis.gameScenario.keyEvents.map((event, i) => (
                                                <KeyEvent key={i} event={event} />
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Accordion>

                            <Accordion title="Head-to-Head Analysis">
                                {isH2hLoading ? (
                                    <div className="text-center text-brand-text-secondary">Loading historical data...</div>
                                ) : (
                                    <HeadToHeadAnalysis h2hData={h2hData} teamA={teamA} teamB={teamB} />
                                )}
                            </Accordion>

                            <Accordion title="Market & Sentiment Analysis">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-brand-text-secondary mb-3">Market Factors</h4>
                                        <div className="bg-brand-bg-light p-3 rounded-lg">
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex items-center justify-between">
                                                    <span className="text-brand-text-secondary">Sharp Money</span>
                                                    <span className={`font-bold ${aiAnalysis.marketInsights.sharpMoneyAlignment ? 'text-brand-green' : 'text-brand-yellow'}`}>
                                                        {aiAnalysis.marketInsights.sharpMoneyAlignment ? 'Aligned' : 'Not Aligned'}
                                                    </span>
                                                </li>
                                                <li className="flex items-center justify-between">
                                                    <span className="text-brand-text-secondary">Public Betting</span>
                                                    <span className="font-bold text-brand-text-primary">{aiAnalysis.marketInsights.publicBettingPercentage}%</span>
                                                </li>
                                                <li className="flex items-center justify-between">
                                                    <span className="text-brand-text-secondary">Odds Movement</span>
                                                    <span className={`font-bold ${aiAnalysis.marketInsights.significantOddsMovement ? 'text-brand-red' : 'text-brand-text-primary'}`}>
                                                        {aiAnalysis.marketInsights.significantOddsMovement ? 'Significant' : 'Stable'}
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-brand-text-secondary mb-3">Media Sentiment</h4>
                                        <div className="bg-brand-bg-light p-3 rounded-lg">
                                            <div className="flex items-start justify-between mb-2">
                                                <SentimentBadge sentiment={aiAnalysis.sentimentAnalysis.overallSentiment} />
                                                <div className="flex flex-wrap gap-1 justify-end max-w-[120px]">
                                                    {aiAnalysis.sentimentAnalysis.socialMediaKeywords.slice(0, 3).map(keyword => (
                                                        <span key={keyword} className="bg-brand-bg-dark text-brand-text-secondary text-[10px] font-semibold px-2 py-1 rounded">
                                                            {keyword}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-xs text-brand-text-primary border-t border-brand-border pt-2 mt-2">
                                                {aiAnalysis.sentimentAnalysis.newsSummary}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Accordion>
                            
                            <Accordion title="AI Transparency Report">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-sm font-bold text-brand-text-secondary mb-3">Decision Flow</h4>
                                            <ul className="space-y-4">
                                                {aiAnalysis.decisionFlow.map(item => <DecisionFlowItem key={item.step} item={item} />)}
                                            </ul>
                                        </div>
                                        <div>
                                             <h4 className="text-sm font-bold text-brand-text-secondary mb-3">Live Intelligence Feed</h4>
                                            <LiveIntelligenceFeed sources={aiAnalysis.dataSources} />
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-brand-border">
                                        <h4 className="text-sm font-bold text-brand-text-secondary mb-3">Value & Staking Calculation</h4>
                                        <div className="bg-brand-bg-light p-4 rounded-lg space-y-4">
                                            <div className="flex items-start gap-4">
                                                <CalculatorIcon className="w-8 h-8 text-brand-green flex-shrink-0 mt-1" />
                                                <div>
                                                    <h5 className="font-bold text-brand-text-primary">Betting Logic Breakdown</h5>
                                                    <p className="text-xs text-brand-text-secondary">The AI recommends bets only when there is a positive Expected Value (EV), meaning the model has found an edge over the bookmaker's odds.</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3 pt-3 border-t border-brand-border/50">
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center text-brand-text-secondary"><CpuIcon className="w-4 h-4 mr-2" />AI Estimated Probability</div>
                                                    <div className="font-bold text-brand-text-primary bg-brand-bg-dark px-2 py-1 rounded-md">{(aiAnalysis.estimatedWinProbability * 100).toFixed(1)}%</div>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center text-brand-text-secondary"><TagIcon className="w-4 h-4 mr-2" />Implied Probability (Odds)</div>
                                                    <div className="font-bold text-brand-text-primary bg-brand-bg-dark px-2 py-1 rounded-md">{(impliedProbability * 100).toFixed(1)}%</div>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center text-brand-text-secondary"><ScaleIcon className="w-4 h-4 mr-2" />Identified Edge</div>
                                                    <div className={`font-bold px-2 py-1 rounded-md ${identifiedEdge > 0 ? 'text-brand-green bg-brand-green/10' : 'text-brand-red bg-brand-red/10'}`}>{identifiedEdge > 0 ? '+' : ''}{(identifiedEdge * 100).toFixed(1)}%</div>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center text-brand-text-secondary"><TrendingUpIcon className="w-4 h-4 mr-2" />Expected Value (EV)</div>
                                                    <div className="font-bold text-brand-green bg-brand-green/10 px-2 py-1 rounded-md">+{aiAnalysis.expectedValue.toFixed(1)}%</div>
                                                </div>
                                                 <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center text-brand-text-secondary"><DollarSignIcon className="w-4 h-4 mr-2" />Kelly Stake Suggestion</div>
                                                    <div className="font-bold text-brand-yellow bg-brand-yellow/10 px-2 py-1 rounded-md">{aiAnalysis.kellyStakePercentage.toFixed(1)}%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-brand-border">
                                        <h4 className="text-sm font-bold text-brand-text-secondary mb-3">Prediction Model Architecture</h4>
                                        <div className="bg-brand-bg-light p-4 rounded-lg space-y-4">
                                            <div className="flex items-start gap-4">
                                                <DatabaseIcon className="w-8 h-8 text-brand-green flex-shrink-0 mt-1" />
                                                <div>
                                                    <h5 className="font-bold text-brand-text-primary">Quantitative Prediction Engine</h5>
                                                    <p className="text-xs text-brand-text-secondary">Core predictions (e.g., win probability, EV, confidence) are generated by a suite of trained machine learning models (like Gradient Boosting, Neural Networks) that analyze historical and real-time statistical data. This is the data-driven brain of the operation.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <MessageSquareIcon className="w-8 h-8 text-sky-400 flex-shrink-0 mt-1" />
                                                <div>
                                                    <h5 className="font-bold text-brand-text-primary">Natural Language Layer (LLM)</h5>
                                                    <p className="text-xs text-brand-text-secondary">The LLM (Gemini) does <span className="font-bold">not</span> make quantitative predictions. Its role is to interpret the data from the prediction engine, provide textual summaries (like "AI's Angle"), and power the AI Chat for a conversational experience.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Accordion title="System Architecture & Principles">
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-sm font-bold text-brand-text-secondary mb-3">Validation & Backtesting</h4>
                                                <div className="bg-brand-bg-light p-4 rounded-lg flex items-start gap-4">
                                                    <HistoryIcon className="w-10 h-10 text-brand-green flex-shrink-0 mt-1" />
                                                    <div>
                                                        <h5 className="font-bold text-brand-text-primary">Walk-Forward Validation</h5>
                                                        <p className="text-xs text-brand-text-secondary">The model's performance is continuously validated using a rigorous walk-forward backtesting process on historical data. This simulates real-world performance by training on past data and testing on future, unseen data, ensuring the model's edge is robust and not a result of overfitting.</p>
                                                    </div>
                                                </div>
                                            </div>
                                             <div>
                                                <h4 className="text-sm font-bold text-brand-text-secondary mb-3">Core Principles</h4>
                                                <div className="bg-brand-bg-light p-4 rounded-lg space-y-3">
                                                    <div className="flex items-start gap-3">
                                                        <ShieldCheckIcon className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                                                        <p className="text-xs text-brand-text-secondary"><strong className="text-brand-text-primary">Focus on Expected Value (EV):</strong> We only recommend bets where our model finds a positive long-term edge over the market.</p>
                                                    </div>
                                                     <div className="flex items-start gap-3">
                                                        <ShieldCheckIcon className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                                                        <p className="text-xs text-brand-text-secondary"><strong className="text-brand-text-primary">Dynamic Staking:</strong> Bet sizing is determined by the Kelly Criterion to optimize bankroll growth and manage risk.</p>
                                                    </div>
                                                     <div className="flex items-start gap-3">
                                                        <ShieldCheckIcon className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                                                        <p className="text-xs text-brand-text-secondary"><strong className="text-brand-text-primary">Closing Line Value (CLV):</strong> We track our performance against the market's closing odds to ensure our edge is consistent.</p>
                                                    </div>
                                                </div>
                                            </div>
                                             <div>
                                                <h4 className="text-sm font-bold text-brand-text-secondary mb-3">System Architecture</h4>
                                                <div className="bg-brand-bg-light p-4 rounded-lg flex items-start gap-4">
                                                    <LayersIcon className="w-10 h-10 text-brand-green flex-shrink-0 mt-1" />
                                                    <div>
                                                        <h5 className="font-bold text-brand-text-primary">Multi-Layered Architecture</h5>
                                                        <p className="text-xs text-brand-text-secondary">Our system uses a multi-layered architecture for accuracy. A **Data Layer** (PostgreSQL) feeds a **Quantitative Prediction Engine** (Python/ML) which handles all statistical modeling. The **Gemini API** is used only as a **Natural Language Layer** to interpret and communicate these data-driven insights through the **Frontend**.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Accordion>
                                </div>
                             </Accordion>

                        </div>
                    </div>
                </main>
                
                <footer className="bg-brand-bg-dark/50 p-6 border-t border-brand-border mt-auto flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div>
                                <p className="text-xs text-brand-text-secondary">Suggested Stake</p>
                                <p className="text-2xl font-bold text-brand-text-primary">${suggestedStake.toFixed(2)}</p>
                            </div>
                            <RiskBadge riskLevel={aiAnalysis.riskLevel} />
                        </div>
                        <button 
                            onClick={handleBetClick}
                            disabled={isBetDisabled}
                            className="flex items-center justify-center px-6 py-3 bg-brand-green text-brand-bg-dark font-bold rounded-lg transition-colors duration-300 hover:bg-brand-green/80 disabled:bg-brand-border disabled:text-brand-text-secondary disabled:cursor-not-allowed"
                            title={disabledTitle}
                        >
                            {isBetBlockedByAI ? <XCircleIcon className="w-5 h-5 mr-2" /> : <BetIcon className="w-5 h-5 mr-2" />}
                            {isBetBlockedByAI ? 'Bet Blocked by AI' : 'Place Bet (Simulated)'}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};