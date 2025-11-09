import React, { useEffect } from 'react';
import { LiveMatchPrediction } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { MomentumTracker } from './MomentumTracker';
import { ValueAlertBadge } from './ValueAlertBadge';
import { subscribe, unsubscribe } from '../services/websocketService';
import { useStore } from '../store/useStore';
import { TeamLogo } from './TeamLogo';


interface LiveMatchCardProps {
    match: LiveMatchPrediction;
}

export const LiveMatchCard: React.FC<LiveMatchCardProps> = ({ match }) => {
    const { updateMatchData, setSelectedLiveMatchForBet, setSelectedMatch } = useStore(state => ({
        updateMatchData: state.updateMatchData,
        setSelectedLiveMatchForBet: state.setSelectedLiveMatchForBet,
        setSelectedMatch: state.setSelectedMatch,
    }));

    useEffect(() => {
        const callback = (updatedMatch: LiveMatchPrediction) => {
            updateMatchData(updatedMatch);
        };
        subscribe(match.id, callback as any);
        return () => unsubscribe(match.id, callback as any);
    }, [match.id, updateMatchData]);

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
        <div className="bg-brand-bg-light border-2 border-brand-red/70 rounded-lg shadow-lg shadow-brand-red/10 group transition-all duration-300 hover:shadow-2xl hover:shadow-brand-red/20">
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <p className="text-sm text-brand-text-secondary">{league}</p>
                    <ConfidenceBadge confidence={confidence} />
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="text-center w-1/3">
                        <TeamLogo teamName={teamA} size="w-10 h-10 mx-auto mb-2"/>
                        <p className="text-lg font-bold">{scoreA}</p>
                        <p className="text-sm font-semibold truncate">{teamA}</p>
                    </div>
                     <div className="text-center px-2">
                         <div className="flex items-center justify-center gap-2">
                             <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-red"></span>
                            </span>
                            <p className="text-2xl font-mono font-bold text-brand-red">{matchTime}'</p>
                        </div>
                        <p className="text-xs text-brand-text-secondary uppercase">Live</p>
                    </div>
                    <div className="text-center w-1/3">
                        <TeamLogo teamName={teamB} size="w-10 h-10 mx-auto mb-2"/>
                        <p className="text-lg font-bold">{scoreB}</p>
                        <p className="text-sm font-semibold truncate">{teamB}</p>
                    </div>
                </div>

                <MomentumTracker momentum={momentum} teamA={teamA} teamB={teamB} />
            </div>

             <div className="border-t border-brand-border px-4 py-3 flex justify-between items-center bg-brand-bg-dark/50 rounded-b-lg">
                <button 
                    onClick={() => setSelectedMatch(match)}
                    className="text-sm font-semibold text-brand-text-secondary hover:text-brand-text-primary transition-colors"
                >
                    Analysis
                </button>
                <button
                    onClick={() => setSelectedLiveMatchForBet(match)}
                    className="px-4 py-2 rounded-md text-sm font-bold bg-brand-red text-white hover:bg-opacity-80 transition-colors flex items-center gap-2 transform active:scale-95"
                >
                    Bet Now @ {liveOdds.toFixed(2)}
                    {hasValueAlert && <ValueAlertBadge />}
                </button>
            </div>
            {renderCashOut()}
        </div>
    );
};