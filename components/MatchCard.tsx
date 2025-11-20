import React from 'react';
import { MatchPrediction } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { useStore } from '../store/useStore';
import { Tooltip } from './Tooltip';
import { TeamLogo } from './TeamLogo';

const ChevronRightIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
);

interface MatchCardProps {
    prediction: MatchPrediction;
    isSelected: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ prediction, isSelected }) => {
    const { teamA, teamB, league, matchDate, prediction: bet, odds, confidence, aiAnalysis } = prediction;
    const date = new Date(matchDate);
    
    const { handleAddToTicket, setSelectedMatch } = useStore(state => ({
        handleAddToTicket: state.handleAddToTicket,
        setSelectedMatch: state.setSelectedMatch,
    }));

    return (
        <div className="bg-brand-bg-light rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform duration-200">
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
                    </div>
                    <ConfidenceBadge confidence={confidence} />
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
                    <div className="text-brand-text-secondary">
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
                        <span className="text-xs text-brand-text-secondary">AI Prediction</span>
                        <span className="text-sm font-medium text-brand-blue">{bet}</span>
                    </div>
                    
                    <div className={`
                        flex flex-col items-center justify-center min-w-[60px] h-10 rounded-lg transition-colors
                        ${isSelected ? 'bg-brand-green' : 'bg-brand-blue/10'}
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