import React from 'react';
import { type MatchPrediction } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';

// Icons
const StarIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);
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
const TrendingUpIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

interface BetOfTheDayCardProps {
    prediction: MatchPrediction;
    onViewAnalysis: () => void;
    onAddToTicket: () => void;
    isTicketed: boolean;
}

export const BetOfTheDayCard: React.FC<BetOfTheDayCardProps> = ({ prediction, onViewAnalysis, onAddToTicket, isTicketed }) => {
    const { teamA, teamB, league, prediction: bet, odds, confidence, aiAnalysis } = prediction;

    return (
        <section className="mb-12">
            <div className="bg-gradient-to-br from-brand-green/10 via-brand-bg-light to-brand-bg-light rounded-2xl border-2 border-brand-green/50 p-6 shadow-2xl shadow-brand-green/10 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <StarIcon className="w-7 h-7 text-brand-yellow" />
                        <h2 className="text-3xl font-bold text-brand-text-primary">AI Bet of the Day</h2>
                    </div>
                    <ConfidenceBadge confidence={confidence} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Match Info */}
                    <div className="md:col-span-4 text-center md:text-left">
                        <p className="text-sm font-medium text-brand-text-secondary">{league}</p>
                        <p className="text-2xl font-bold text-brand-text-primary mt-1">{teamA}</p>
                        <p className="text-sm text-brand-text-secondary my-1">vs</p>
                        <p className="text-2xl font-bold text-brand-text-primary">{teamB}</p>
                    </div>

                    {/* Prediction & Odds */}
                    <div className="md:col-span-4 bg-brand-bg-dark rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-brand-text-secondary">AI Prediction</p>
                                <p className="text-2xl font-bold text-brand-green">{bet}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-brand-text-secondary">Odds</p>
                                <p className="text-3xl font-black">{odds.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* EV */}
                    <div className="md:col-span-4 bg-brand-bg-dark rounded-lg p-4 text-center">
                         <p className="text-sm font-medium text-brand-text-secondary">Expected Value (EV)</p>
                         <div className={`mt-1 flex items-center justify-center text-3xl font-bold text-brand-green`}>
                            <TrendingUpIcon className="w-6 h-6 mr-2" />
                            <span>+{aiAnalysis.expectedValue.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-brand-bg-dark/50 p-4 rounded-lg border-l-4 border-brand-yellow">
                    <p className="text-sm font-semibold text-brand-yellow mb-1">AI's Angle:</p>
                    <p className="text-sm text-brand-text-primary italic">"{aiAnalysis.bettingAngle}"</p>
                </div>
                
                <div className="mt-6 flex items-center gap-4">
                    <button 
                        onClick={onViewAnalysis}
                        className="w-full flex items-center justify-center px-4 py-3 bg-brand-green/90 text-brand-bg-dark font-bold rounded-lg transition-colors duration-300 hover:bg-brand-green"
                    >
                        <ChartBarIcon className="w-5 h-5 mr-2" />
                        View Full Analysis
                    </button>
                    <button 
                        onClick={onAddToTicket}
                        className={`w-full flex items-center justify-center px-4 py-3 font-bold rounded-lg transition-colors duration-300 ${isTicketed ? 'bg-brand-yellow text-brand-bg-dark' : 'bg-brand-border text-brand-text-primary hover:bg-brand-border/80'}`}
                    >
                        <TicketIcon className="w-5 h-5 mr-2" />
                        {isTicketed ? 'Added to Ticket' : 'Add to Ticket'}
                    </button>
                </div>
            </div>
        </section>
    );
};