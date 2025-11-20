
import React, { useEffect } from 'react';
import { MatchPrediction } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { useStore } from '../store/useStore';
import { generateMatchInsight } from '../services/geminiService';

interface BetOfTheDayCardProps {
    prediction: MatchPrediction;
}

const StarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

export const BetOfTheDayCard: React.FC<BetOfTheDayCardProps> = ({ prediction }) => {
    const { teamA, teamB, league, prediction: bet, odds, confidence, aiAnalysis } = prediction;
    const { setSelectedMatch, updateMatchData } = useStore(state => ({
        setSelectedMatch: state.setSelectedMatch,
        updateMatchData: state.updateMatchData
    }));

    // Auto-upgrade the Bet of the Day with real AI analysis if it's still using the mock generic string
    useEffect(() => {
        if (aiAnalysis.bettingAngle.startsWith("AI Model initialized")) {
            generateMatchInsight(prediction).then(insight => {
                if (insight && Object.keys(insight).length > 0) {
                    updateMatchData({
                        ...prediction,
                        aiAnalysis: { ...prediction.aiAnalysis, ...insight }
                    });
                }
            });
        }
    }, [prediction.id, aiAnalysis.bettingAngle, updateMatchData]);
    
    return (
        <section className="bg-gradient-to-br from-brand-green/20 to-brand-bg-light p-6 rounded-lg border-2 border-brand-green shadow-lg shadow-green-900/20 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-brand-green/20 rounded-full blur-2xl"></div>
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
                <StarIcon className="w-6 h-6 text-brand-yellow drop-shadow-lg" />
                <h2 className="text-2xl font-bold text-brand-text-primary">Bet of the Day</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 items-center relative z-10">
                <div className="md:col-span-2">
                    <p className="text-sm text-brand-text-secondary uppercase tracking-wide font-bold">{league}</p>
                    <h3 className="text-xl font-bold text-brand-text-primary mt-1">{teamA} vs {teamB}</h3>
                    <div className="mt-4 bg-brand-bg-dark/80 backdrop-blur-sm p-4 rounded-lg border border-brand-border/50">
                        <p className="text-lg font-bold text-brand-green">{bet}</p>
                        <p className="text-sm text-brand-text-secondary mt-1 leading-relaxed">{aiAnalysis.bettingAngle}</p>
                    </div>
                </div>
                <div className="text-center bg-brand-bg-light/50 p-4 rounded-lg border border-brand-border backdrop-blur-sm">
                    <p className="text-xs text-brand-text-secondary uppercase font-bold">Best Odds</p>
                    <p className="text-5xl font-bold text-brand-yellow my-2 tracking-tighter">{odds.toFixed(2)}</p>
                    <div className="flex justify-center mb-4">
                        <ConfidenceBadge confidence={confidence} />
                    </div>
                    <button
                        onClick={() => setSelectedMatch(prediction)}
                        className="w-full bg-brand-green text-white font-bold py-2.5 rounded-lg hover:bg-opacity-90 transition-all active:scale-95 shadow-lg shadow-brand-green/20"
                    >
                        View Full Analysis
                    </button>
                </div>
            </div>
        </section>
    );
};
