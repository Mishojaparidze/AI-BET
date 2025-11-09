import React from 'react';
import { MatchPrediction } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { useStore } from '../store/useStore';
import { Tooltip } from './Tooltip';
import { TeamLogo } from './TeamLogo';

const ClockIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const PlusCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
);
const CheckCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
const InfoIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);
const TrendingUpIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);
const TrendingDownIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
);


interface MatchCardProps {
    prediction: MatchPrediction;
    isSelected: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ prediction, isSelected }) => {
    const { teamA, teamB, league, matchDate, prediction: bet, odds, confidence, aiAnalysis, reasoning } = prediction;
    const { significantOddsMovement, oddsMovementDirection } = aiAnalysis.marketInsights;
    const date = new Date(matchDate);
    
    const { handleAddToTicket, setSelectedMatch } = useStore(state => ({
        handleAddToTicket: state.handleAddToTicket,
        setSelectedMatch: state.setSelectedMatch,
    }));

    return (
        <div className="bg-brand-bg-light border border-brand-border rounded-lg shadow-lg group transition-all duration-300 hover:shadow-2xl hover:border-brand-green/30 hover:shadow-brand-green/10">
            <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-brand-text-secondary">{league}</p>
                    <ConfidenceBadge confidence={confidence} />
                </div>

                <div className="flex justify-between items-center text-brand-text-primary text-lg font-bold mb-3">
                    <div className="flex items-center gap-3">
                        <TeamLogo teamName={teamA} size="w-8 h-8"/>
                        <span>{teamA}</span>
                    </div>
                    <span className="text-brand-text-secondary text-sm font-mono">vs</span>
                     <div className="flex items-center gap-3">
                        <span>{teamB}</span>
                        <TeamLogo teamName={teamB} size="w-8 h-8"/>
                    </div>
                </div>

                 <div className="flex items-center text-xs text-brand-text-secondary mb-4">
                    <ClockIcon className="w-4 h-4 mr-2"/>
                    <span>{date.toLocaleDateString()} - {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="mt-4 bg-brand-bg-dark p-4 rounded-lg flex items-center justify-between gap-4">
                    <div className="min-w-0"> {/* Allow content to truncate */}
                        <p className="text-sm font-bold text-brand-text-primary truncate" title={bet}>{bet}</p>
                        <p className="text-xs text-brand-text-secondary">Market: {prediction.marketType}</p>
                        <Tooltip content={reasoning}>
                            <p className="text-xs text-brand-text-secondary truncate mt-1 cursor-help">
                                {reasoning}
                            </p>
                        </Tooltip>
                        <div className="flex items-center gap-1 text-xs text-brand-text-secondary mt-1">
                            Expected Value: 
                            <span className={`font-bold ${aiAnalysis.expectedValue > 0 ? 'text-brand-green' : 'text-brand-red'}`}>{aiAnalysis.expectedValue.toFixed(1)}%</span>
                            <Tooltip content="Expected Value (EV) shows the projected profit/loss from a bet. A positive EV suggests a valuable, long-term profitable betting opportunity.">
                                <InfoIcon className="w-4 h-4 text-brand-text-secondary cursor-help" />
                            </Tooltip>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {significantOddsMovement && oddsMovementDirection && (
                            <Tooltip content={`Odds have recently moved significantly ${oddsMovementDirection}.`}>
                                <div className={oddsMovementDirection === 'up' ? 'text-brand-green' : 'text-brand-red'}>
                                    {oddsMovementDirection === 'up' 
                                        ? <TrendingUpIcon className="w-5 h-5" /> 
                                        : <TrendingDownIcon className="w-5 h-5" />}
                                </div>
                            </Tooltip>
                        )}
                        <div className="text-right">
                            <p className="text-2xl font-bold text-brand-yellow">{odds.toFixed(2)}</p>
                            <p className="text-xs text-brand-text-secondary">Odds</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t border-brand-border px-4 py-3 flex justify-end items-center bg-brand-bg-dark/20 rounded-b-lg">
                <button 
                    onClick={() => setSelectedMatch(prediction)}
                    className="text-sm font-semibold text-brand-text-secondary hover:text-brand-text-primary transition-colors"
                >
                    View Analysis
                </button>
                <button
                    onClick={() => handleAddToTicket(prediction)}
                    className={`ml-4 px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 flex items-center gap-2 transform active:scale-95 ${
                        isSelected 
                        ? 'bg-brand-green/20 text-brand-green' 
                        : 'bg-brand-green text-white hover:bg-opacity-90'
                    }`}
                >
                    {isSelected ? <CheckCircleIcon className="w-5 h-5"/> : <PlusCircleIcon className="w-5 h-5"/>}
                    {isSelected ? 'Added' : 'Add to Ticket'}
                </button>
            </div>
        </div>
    );
};