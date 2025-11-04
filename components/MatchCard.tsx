import React, { useState } from 'react';
import { type MatchPrediction } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';

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


export const MatchCard: React.FC<MatchCardProps> = ({ prediction, onViewAnalysis, onAddToTicket, isTicketed }) => {
  const { teamA, teamB, league, matchDate, prediction: bet, confidence, odds, aiAnalysis } = prediction;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-brand-bg-light rounded-xl shadow-md overflow-hidden border border-brand-border flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-brand-green/50 hover:-translate-y-1">
      <div className="p-6">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-brand-text-secondary uppercase tracking-wider">{league}</p>
                <p className="text-xs text-brand-text-secondary">{matchDate}</p>
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
                     <p className="text-2xl font-black text-brand-text-primary">{odds.toFixed(2)}</p>
                </div>
            </div>
        </div>

        <div className="text-center mt-4">
            <p className="text-xs text-brand-text-secondary italic">"{prediction.reasoning}"</p>
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
            <div className="overflow-hidden">
                <div className="bg-brand-bg-dark rounded-lg p-4 text-left border border-brand-border">
                     <h4 className="text-sm font-bold text-brand-text-primary mb-3">Key Factors</h4>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold text-brand-green text-xs mb-1">Positives</p>
                            <ul className="space-y-1">
                                {aiAnalysis.keyPositives.slice(0, 2).map((factor, i) => (
                                    <li key={i} className="flex items-start text-xs text-brand-text-secondary">
                                        <CheckCircleIcon className="w-3 h-3 mr-1.5 mt-0.5 text-brand-green flex-shrink-0"/>
                                        <span className="truncate" title={factor}>{factor}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-brand-red text-xs mb-1">Negatives</p>
                            <ul className="space-y-1">
                                {aiAnalysis.keyNegatives.slice(0, 2).map((factor, i) => (
                                    <li key={i} className="flex items-start text-xs text-brand-text-secondary">
                                        <XCircleIcon className="w-3 h-3 mr-1.5 mt-0.5 text-brand-red flex-shrink-0"/>
                                        <span className="truncate" title={factor}>{factor}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
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