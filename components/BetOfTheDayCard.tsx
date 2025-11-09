import React from 'react';
import { MatchPrediction } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';

interface BetOfTheDayCardProps {
    prediction: MatchPrediction;
    onSelect: (prediction: MatchPrediction) => void;
}

const StarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

export const BetOfTheDayCard: React.FC<BetOfTheDayCardProps> = ({ prediction, onSelect }) => {
    const { teamA, teamB, league, prediction: bet, odds, confidence, aiAnalysis } = prediction;
    
    return (
        <section className="bg-gradient-to-br from-brand-green/20 to-brand-bg-light p-6 rounded-lg border-2 border-brand-green shadow-lg shadow-green-900/20">
            <div className="flex items-center gap-3 mb-4">
                <StarIcon className="w-6 h-6 text-brand-yellow" />
                <h2 className="text-2xl font-bold text-brand-text-primary">Bet of the Day</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2">
                    <p className="text-sm text-brand-text-secondary">{league}</p>
                    <h3 className="text-xl font-bold text-brand-text-primary">{teamA} vs {teamB}</h3>
                    <div className="mt-4 bg-brand-bg-dark p-4 rounded-lg">
                        <p className="text-lg font-bold">{bet}</p>
                        <p className="text-sm text-brand-text-secondary">{aiAnalysis.bettingAngle}</p>
                    </div>
                </div>
                <div className="text-center bg-brand-bg-light p-4 rounded-lg border border-brand-border">
                    <p className="text-sm text-brand-text-secondary">Odds</p>
                    <p className="text-5xl font-bold text-brand-yellow my-1">{odds.toFixed(2)}</p>
                    <ConfidenceBadge confidence={confidence} />
                    <button
                        onClick={() => onSelect(prediction)}
                        className="w-full mt-4 bg-brand-green text-white font-bold py-2 rounded-md hover:bg-opacity-90 transition-colors"
                    >
                        View Full Analysis
                    </button>
                </div>
            </div>
        </section>
    );
};
