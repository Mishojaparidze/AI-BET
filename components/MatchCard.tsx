import React from 'react';
import { MatchPrediction } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';

const ClockIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const PlusCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
);
const CheckCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);


interface MatchCardProps {
    prediction: MatchPrediction;
    onSelect: (prediction: MatchPrediction) => void;
    onAddToTicket: (prediction: MatchPrediction) => void;
    isSelectedOnTicket: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ prediction, onSelect, onAddToTicket, isSelectedOnTicket }) => {
    const { teamA, teamB, league, matchDate, prediction: bet, odds, confidence, aiAnalysis } = prediction;
    const date = new Date(matchDate);

    return (
        <div className="bg-brand-bg-light border border-brand-border rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-green-900/20 hover:border-brand-green/30">
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-brand-text-secondary">{league}</p>
                        <h3 className="text-lg font-bold text-brand-text-primary">{teamA} vs {teamB}</h3>
                         <div className="flex items-center text-xs text-brand-text-secondary mt-1">
                            <ClockIcon className="w-4 h-4 mr-2"/>
                            <span>{date.toLocaleDateString()} - {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                    <ConfidenceBadge confidence={confidence} />
                </div>

                <div className="mt-4 bg-brand-bg-dark p-4 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-brand-text-primary">{bet}</p>
                        <p className="text-xs text-brand-text-secondary">Market: {prediction.marketType}</p>
                        <p className="text-xs text-brand-text-secondary">Expected Value: <span className={`font-bold ${aiAnalysis.expectedValue > 0 ? 'text-brand-green' : 'text-brand-red'}`}>{aiAnalysis.expectedValue.toFixed(1)}%</span></p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-brand-yellow">{odds.toFixed(2)}</p>
                        <p className="text-xs text-brand-text-secondary">Odds</p>
                    </div>
                </div>
            </div>
            <div className="border-t border-brand-border px-4 py-3 flex justify-end items-center gap-4 bg-brand-bg-light/50 rounded-b-lg">
                <button 
                    onClick={() => onSelect(prediction)}
                    className="text-sm font-semibold text-brand-text-secondary hover:text-brand-text-primary transition-colors"
                >
                    View Analysis
                </button>
                <button
                    onClick={() => onAddToTicket(prediction)}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2 ${
                        isSelectedOnTicket 
                        ? 'bg-brand-green/20 text-brand-green' 
                        : 'bg-brand-green/80 text-white hover:bg-brand-green'
                    }`}
                >
                    {isSelectedOnTicket ? <CheckCircleIcon className="w-5 h-5"/> : <PlusCircleIcon className="w-5 h-5"/>}
                    {isSelectedOnTicket ? 'Added' : 'Add to Ticket'}
                </button>
            </div>
        </div>
    );
};