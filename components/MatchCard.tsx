
import React from 'react';
import { MatchPrediction } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { useStore } from '../store/useStore';
import { TeamLogo } from './TeamLogo';
import { ProbabilityGauge } from './ProbabilityGauge';

const ChevronRightIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
);

const FireIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8.5 14.5A2.5 2.5 0 0011 17c1.38 0 2.5-1.12 2.5-2.5 0-1.38-1.12-2.5-2.5-2.5a2.5 2.5 0 00-2.5 2.5m2.36-10.36a11.64 11.64 0 016.69 6.09 1.5 1.5 0 01-1.41 2.27h-1.14v.17a4.17 4.17 0 00-6.17 3.75A6.5 6.5 0 012 14.5a6.48 6.48 0 015-6.33V8a6.48 6.48 0 013.86-5.86z"/></svg>
);

interface MatchCardProps {
    prediction: MatchPrediction;
    isSelected: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ prediction, isSelected }) => {
    const { teamA, teamB, league, matchDate, prediction: bet, odds, confidence, aiAnalysis, streak } = prediction;
    const date = new Date(matchDate);
    const winProb = Math.round(aiAnalysis.estimatedWinProbability * 100);
    
    const { handleAddToTicket, setSelectedMatch } = useStore(state => ({
        handleAddToTicket: state.handleAddToTicket,
        setSelectedMatch: state.setSelectedMatch,
    }));

    return (
        <div className="bg-brand-bg-light rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform duration-200 border border-brand-border/30">
            <div 
                className="p-4 cursor-pointer" 
                onClick={() => setSelectedMatch(prediction)}
            >
                {/* Header Row */}
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">{league}</span>
                        <span className="text-xs text-brand-text-secondary">•</span>
                        <span className="text-xs text-brand-text-secondary">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {streak && streak >= 3 && (
                            <div className="flex items-center gap-1 bg-orange-500/10 px-1.5 py-0.5 rounded-full">
                                <FireIcon className="w-3 h-3 text-orange-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-orange-500">Hot Streak</span>
                            </div>
                        )}
                    </div>
                    <ProbabilityGauge percentage={winProb} />
                </div>

                {/* Teams Row */}
                <div className="flex justify-between items-center mb-4">
                    <div className="space-y-2">
                         <div className="flex items-center gap-3">
                            <TeamLogo teamName={teamA} size="w-6 h-6"/>
                            <span className="text-[15px] font-semibold text-brand-text-primary">{teamA}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <TeamLogo teamName={teamB} size="w-6 h-6"/>
                            <span className="text-[15px] font-semibold text-brand-text-primary">{teamB}</span>
                        </div>
                    </div>
                    <div className="text-brand-text-secondary pl-4">
                         <ChevronRightIcon className="w-5 h-5 opacity-50" />
                    </div>
                </div>

                {/* Prediction Action Row */}
                <div 
                    className="bg-brand-bg-elevated rounded-xl p-3 flex justify-between items-center"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent opening modal when clicking the bet button area
                        handleAddToTicket(prediction);
                    }}
                >
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-brand-text-secondary">AI Prediction</span>
                            <ConfidenceBadge confidence={confidence} />
                        </div>
                        <span className="text-sm font-medium text-brand-blue mt-0.5">{bet}</span>
                    </div>
                    
                    <div className={`
                        flex flex-col items-center justify-center min-w-[70px] h-10 rounded-lg transition-colors
                        ${isSelected ? 'bg-brand-green shadow-lg shadow-brand-green/20' : 'bg-brand-blue/10'}
                    `}>
                        <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-brand-blue'}`}>
                            {odds.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
