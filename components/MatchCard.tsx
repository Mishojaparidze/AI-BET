
import React, { useState, useEffect } from 'react';
import { type MatchPrediction, type LiveMatchPrediction } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';
import * as websocketService from '../services/websocketService';

interface MatchCardProps {
  prediction: MatchPrediction;
  onViewAnalysis: () => void;
  onAddToTicket: () => void;
  isTicketed: boolean;
}

// Icons
const ChartBarIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
    </svg>
);

const TicketIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9a3 3 0 0 1 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>
    </svg>
);

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

const ChevronDownIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const ArrowUpIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline>
    </svg>
);

const ArrowDownIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline>
    </svg>
);

const StadiumIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 10.31V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8.69"/><path d="M20 10.31V5s-4-2-8-2-8 2-8 2v5.31"/><ellipse cx="12" cy="14" rx="8" ry="4"/>
    </svg>
);

const WhistleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m11 5 3.3 3.3a1 1 0 0 1-1.4 1.4L10 7.1V17a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-2.5"/><path d="m11 5-4.3 4.3c-1 1-1 2.5 0 3.5l0 0c1 1 2.5 1 3.5 0L13 10"/><path d="M12 18a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z"/>
    </svg>
);

const UsersIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
);

const StarIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

const AlertTriangleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
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


export const MatchCard: React.FC<MatchCardProps> = ({ prediction, onViewAnalysis, onAddToTicket, isTicketed }) => {
  const [currentPrediction, setCurrentPrediction] = useState(prediction);
  const [oddsMovement, setOddsMovement] = useState<'up' | 'down' | 'none'>('none');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let timeoutId: number;
    const handleUpdate = (updatedPrediction: MatchPrediction | LiveMatchPrediction) => {
        if ('liveOdds' in updatedPrediction) return;

        setCurrentPrediction(prev => {
            if (updatedPrediction.odds > prev.odds) {
                setOddsMovement('up');
            } else if (updatedPrediction.odds < prev.odds) {
                setOddsMovement('down');
            }
            
            clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => setOddsMovement('none'), 1500);

            return updatedPrediction;
        });
    };

    websocketService.subscribe(prediction.id, handleUpdate);

    return () => {
        websocketService.unsubscribe(prediction.id, handleUpdate);
        clearTimeout(timeoutId);
    };
  }, [prediction.id]);

  const { teamA, teamB, league, matchDate, prediction: bet, confidence, odds, aiAnalysis, reasoning, stadium, referee, attendance } = currentPrediction;

  const oddsColor = oddsMovement === 'up' ? 'text-brand-green' : oddsMovement === 'down' ? 'text-brand-red' : 'text-brand-text-primary';
  const movementClass = oddsMovement !== 'none' ? 'animate-pulse' : '';

  return (
    <div className="bg-brand-bg-light rounded-xl shadow-md overflow-hidden border border-brand-border flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-brand-green/50 hover:-translate-y-1">
      <div className="p-6">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-brand-text-secondary uppercase tracking-wider">{league}</p>
                <p className="text-xs text-brand-text-secondary">{new Date(matchDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <ConfidenceBadge confidence={confidence} />
        </div>

        <div className="my-4 text-center">
            <p className="text-xl font-bold text-brand-text-primary truncate" title={teamA}>{teamA}</p>
            <p className="text-sm text-brand-text-secondary my-1">vs</p>
            <p className="text-xl font-bold text-brand-text-primary truncate" title={teamB}>{teamB}</p>
        </div>

        <div className="bg-brand-bg-dark rounded-lg p-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-xs text-brand-text-secondary">AI Prediction</p>
                    <p className="text-lg font-bold text-brand-green">{bet}</p>
                </div>
                <div className="text-right">
                     <p className="text-xs text-brand-text-secondary">Odds</p>
                     <div className={`flex items-center justify-end gap-2 transition-colors duration-300 ${oddsColor} ${movementClass}`}>
                        {oddsMovement === 'up' && <ArrowUpIcon className="w-4 h-4" />}
                        {oddsMovement === 'down' && <ArrowDownIcon className="w-4 h-4" />}
                        <p className="text-2xl font-black">{odds.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="text-center mt-4">
            <p className="text-xs text-brand-text-secondary italic">"{reasoning}"</p>
            <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="text-xs font-bold text-brand-green hover:text-brand-green/80 mt-2 flex items-center justify-center mx-auto"
            >
                {isExpanded ? 'Hide Details' : 'Show Details'}
                <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
        </div>

        {/* EXPANDABLE SECTION */}
        <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden space-y-2">
                <div className="bg-brand-bg-dark rounded-lg p-4 text-left border border-brand-border">
                     <h4 className="text-sm font-bold text-brand-text-primary mb-3">Key Factors</h4>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold text-brand-green text-xs mb-1">Positives</p>
                            <ul className="space-y-1">
                                {aiAnalysis.keyPositives.slice(0, 2).map((factor, i) => {
                                    const isImpactful = i === 0;
                                    return (
                                         <li key={i} className="flex items-start text-xs">
                                            {isImpactful ? (
                                                <StarIcon className="w-3 h-3 mr-1.5 mt-0.5 text-brand-yellow flex-shrink-0"/>
                                            ) : (
                                                <CheckCircleIcon className="w-3 h-3 mr-1.5 mt-0.5 text-brand-green flex-shrink-0"/>
                                            )}
                                            <span 
                                                className={`truncate ${isImpactful ? 'font-bold text-brand-text-primary' : 'text-brand-text-secondary'}`} 
                                                title={factor}
                                            >
                                                {factor}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-brand-red text-xs mb-1">Negatives</p>
                            <ul className="space-y-1">
                                {aiAnalysis.keyNegatives.slice(0, 2).map((factor, i) => {
                                    const isImpactful = i === 0;
                                    return (
                                        <li key={i} className="flex items-start text-xs">
                                             {isImpactful ? (
                                                <AlertTriangleIcon className="w-3 h-3 mr-1.5 mt-0.5 text-brand-yellow flex-shrink-0"/>
                                            ) : (
                                                <XCircleIcon className="w-3 h-3 mr-1.5 mt-0.5 text-brand-red flex-shrink-0"/>
                                            )}
                                            <span
                                                className={`truncate ${isImpactful ? 'font-bold text-brand-text-primary' : 'text-brand-text-secondary'}`}
                                                title={factor}
                                            >
                                                {factor}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
                 <div className="bg-brand-bg-dark rounded-lg p-4 text-left border border-brand-border">
                    <h4 className="text-sm font-bold text-brand-text-primary mb-2">Expected Value (EV)</h4>
                    <div className={`flex items-center text-xl font-bold ${aiAnalysis.expectedValue > 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                        {aiAnalysis.expectedValue > 0 ? <TrendingUpIcon className="w-5 h-5 mr-2" /> : <TrendingDownIcon className="w-5 h-5 mr-2" />}
                        <span>{aiAnalysis.expectedValue > 0 ? '+' : ''}{aiAnalysis.expectedValue.toFixed(1)}%</span>
                    </div>
                    <p className="text-xs text-brand-text-secondary mt-1">
                        Indicates the expected profit margin on this bet.
                    </p>
                </div>
                {(stadium || referee || attendance) && (
                     <div className="bg-brand-bg-dark rounded-lg p-4 text-left border border-brand-border">
                         <h4 className="text-sm font-bold text-brand-text-primary mb-3">Match Details</h4>
                         <ul className="space-y-2">
                             {stadium && (
                                <li className="flex items-center text-xs text-brand-text-secondary">
                                    <StadiumIcon className="w-4 h-4 mr-2 flex-shrink-0"/>
                                    <span>{stadium}</span>
                                </li>
                             )}
                             {referee && (
                                <li className="flex items-center text-xs text-brand-text-secondary">
                                    <WhistleIcon className="w-4 h-4 mr-2 flex-shrink-0"/>
                                    <span>Referee: {referee}</span>
                                </li>
                             )}
                             {attendance && (
                                <li className="flex items-center text-xs text-brand-text-secondary">
                                    <UsersIcon className="w-4 h-4 mr-2 flex-shrink-0"/>
                                    <span>Attendance: {attendance.toLocaleString()}</span>
                                </li>
                             )}
                         </ul>
                    </div>
                )}
                 <div className="bg-brand-bg-dark rounded-lg p-4 text-left border border-brand-border">
                    <h4 className="text-sm font-bold text-brand-text-primary mb-3">AI Model Confidence</h4>
                    <div className="space-y-2">
                        {aiAnalysis.confidenceBreakdown.map(model => (
                            <div key={model.model}>
                                <div className="flex justify-between text-xs text-brand-text-secondary mb-1">
                                    <span>{model.model}</span>
                                    <span>{model.weight}%</span>
                                </div>
                                <div className="w-full bg-brand-border rounded-full h-1.5">
                                    <div className={`${model.color} h-1.5 rounded-full`} style={{ width: `${model.weight}%`}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      <div className="bg-brand-bg-dark/50 px-6 py-4 mt-auto flex items-center gap-2">
         <button 
            onClick={onViewAnalysis}
            className="w-full flex items-center justify-center px-4 py-2 bg-brand-green/90 text-brand-bg-dark font-bold rounded-lg transition-colors duration-300 hover:bg-brand-green/80"
        >
            <ChartBarIcon className="w-5 h-5 mr-2" />
            View Analysis
        </button>
        <button 
            onClick={onAddToTicket}
            className={`flex-shrink-0 px-4 py-2 font-bold rounded-lg transition-colors duration-300 ${isTicketed ? 'bg-brand-yellow text-brand-bg-dark' : 'bg-brand-border/50 text-brand-text-primary hover:bg-brand-border'}`}
            title={isTicketed ? 'Selected for Ticket' : 'Add to Ticket'}
        >
            <TicketIcon className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
