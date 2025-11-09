import React, { useEffect } from 'react';
import { LiveMatchPrediction } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { MomentumTracker } from './MomentumTracker';
import { ValueAlertBadge } from './ValueAlertBadge';
import { subscribe, unsubscribe } from '../services/websocketService';


interface LiveMatchCardProps {
    match: LiveMatchPrediction;
    onBetNow: (match: LiveMatchPrediction) => void;
    onDetails: (match: LiveMatchPrediction) => void;
    onUpdate: (match: LiveMatchPrediction) => void;
}

export const LiveMatchCard: React.FC<LiveMatchCardProps> = ({ match, onBetNow, onDetails, onUpdate }) => {
    useEffect(() => {
        const callback = (updatedMatch: LiveMatchPrediction) => {
            onUpdate(updatedMatch);
        };
        subscribe(match.id, callback as any);
        return () => unsubscribe(match.id, callback as any);
    }, [match.id, onUpdate]);

    const { teamA, teamB, league, confidence, scoreA, scoreB, matchTime, momentum, liveOdds, hasValueAlert, cashOutRecommendation } = match;

    const renderCashOut = () => {
        if (!cashOutRecommendation.isRecommended || !cashOutRecommendation.value) return null;

        return (
            <div className="bg-brand-yellow/10 border-t-2 border-brand-yellow/30 p-3 mt-4 text-center">
                <p className="text-sm font-bold text-brand-yellow">Cash Out Recommended: ${cashOutRecommendation.value.toFixed(2)}</p>
                <p className="text-xs text-brand-text-secondary">{cashOutRecommendation.reason}</p>
            </div>
        );
    };

    return (
        <div className="bg-brand-bg-light border-2 border-brand-red/70 rounded-lg shadow-lg shadow-brand-red/10 transition-transform duration-300 hover:scale-[1.02]">
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-brand-text-secondary">{league}</p>
                        <h3 className="text-lg font-bold text-brand-text-primary">{teamA} vs {teamB}</h3>
                    </div>
                    <ConfidenceBadge confidence={confidence} />
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="text-center">
                        <p className="text-3xl font-bold">{scoreA}</p>
                        <p className="text-sm font-semibold">{teamA}</p>
                    </div>
                     <div className="text-center px-2">
                        <p className="text-2xl font-mono font-bold text-brand-red animate-pulse">{matchTime}'</p>
                        <p className="text-xs text-brand-text-secondary uppercase">Live</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold">{scoreB}</p>
                        <p className="text-sm font-semibold">{teamB}</p>
                    </div>
                </div>

                <MomentumTracker momentum={momentum} teamA={teamA} teamB={teamB} />
            </div>

             <div className="border-t border-brand-border px-4 py-3 flex justify-between items-center bg-brand-bg-dark/50 rounded-b-lg">
                <button 
                    onClick={() => onDetails(match)}
                    className="text-sm font-semibold text-brand-text-secondary hover:text-brand-text-primary transition-colors"
                >
                    Analysis
                </button>
                <button
                    onClick={() => onBetNow(match)}
                    className="px-4 py-2 rounded-md text-sm font-bold bg-brand-red text-white hover:bg-opacity-80 transition-colors flex items-center gap-2"
                >
                    Bet Now @ {liveOdds.toFixed(2)}
                    {hasValueAlert && <ValueAlertBadge />}
                </button>
            </div>
            {renderCashOut()}
        </div>
    );
};