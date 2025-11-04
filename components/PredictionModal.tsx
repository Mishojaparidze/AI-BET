import React from 'react';
import { type MatchPrediction, RiskLevel, type AIDecisionFlowStep } from '../types';
import { Accordion } from './Accordion';

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

interface PredictionModalProps {
    prediction: MatchPrediction;
    bankroll: number;
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

export const PredictionModal: React.FC<PredictionModalProps> = ({ prediction, bankroll, onClose, onPlaceBet }) => {
    const { teamA, teamB, league, matchDate, prediction: bet, odds, aiAnalysis } = prediction;
    
    const suggestedStake = bankroll * (aiAnalysis.kellyStakePercentage / 100);
    const isBetBlocked = aiAnalysis.decisionFlow.some(step => step.status === 'fail');

    const handleBetClick = () => {
      onPlaceBet(prediction, suggestedStake);
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

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

                             <div className="bg-brand-bg-dark rounded-lg p-4">
                                <p className="text-sm font-medium text-brand-text-secondary mb-3">Market Intelligence</p>
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

                             <div className="bg-brand-bg-dark rounded-lg p-4">
                                <p className="text-sm font-medium text-brand-text-secondary mb-3">Ensemble Model Confidence</p>
                                <div className="space-y-2">
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

                        {/* Right Column: Key Factors & Decision Flow */}
                        <div className="space-y-4 lg:col-span-2">
                             <Accordion title="Key Factor Analysis" startOpen={true}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            </Accordion>

                             <Accordion title="AI Decision Flow">
                                <ul className="space-y-4">
                                    {aiAnalysis.decisionFlow.map(item => <DecisionFlowItem key={item.step} item={item} />)}
                                </ul>
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
                            disabled={bankroll < suggestedStake || isBetBlocked}
                            className="flex items-center justify-center px-6 py-3 bg-brand-green text-brand-bg-dark font-bold rounded-lg transition-colors duration-300 hover:bg-brand-green/80 disabled:bg-brand-border disabled:text-brand-text-secondary disabled:cursor-not-allowed"
                            title={isBetBlocked ? 'Betting blocked by AI due to low value or high risk.' : ''}
                        >
                            {isBetBlocked ? <XCircleIcon className="w-5 h-5 mr-2" /> : <BetIcon className="w-5 h-5 mr-2" />}
                            {isBetBlocked ? 'Bet Blocked by AI' : 'Place Bet (Simulated)'}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};