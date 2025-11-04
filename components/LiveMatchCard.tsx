import React, { useState, useEffect } from 'react';
import { type LiveMatchPrediction, Momentum } from '../types';
import { MomentumTracker } from './MomentumTracker';
import { ValueAlertBadge } from './ValueAlertBadge';
import * as websocketService from '../services/websocketService';

interface LiveMatchCardProps {
  initialPrediction: LiveMatchPrediction;
}

const ClockIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

export const LiveMatchCard: React.FC<LiveMatchCardProps> = ({ initialPrediction }) => {
  const [prediction, setPrediction] = useState<LiveMatchPrediction>(initialPrediction);

  useEffect(() => {
    // Connect to the WebSocket service for this specific match
    const handleUpdate = (updatedPrediction: LiveMatchPrediction) => {
        setPrediction(updatedPrediction);
    };
    
    websocketService.connectToMatch(initialPrediction.id, initialPrediction, handleUpdate);

    // Disconnect when the component unmounts
    return () => {
        websocketService.disconnectFromMatch(initialPrediction.id);
    };
  }, [initialPrediction.id]); // Re-connect if the match ID were to change


  const { teamA, teamB, scoreA, scoreB, matchTime, league, matchDate, momentum, liveOdds, cashOutRecommendation, hasValueAlert } = prediction;
  
  return (
    <div className="bg-brand-bg-light border-2 border-brand-green/50 rounded-xl shadow-lg shadow-brand-green/10 flex flex-col p-6 space-y-4 relative overflow-hidden">
       <div className="absolute top-2 right-2 text-xs uppercase font-bold text-brand-green bg-brand-green/10 px-2 py-1 rounded-full animate-pulse">
        ● Live
      </div>

      <div className="text-center pt-2">
        <p className="text-sm font-medium text-brand-text-secondary">{league}</p>
        <p className="text-xs text-brand-text-secondary">{matchDate}</p>
      </div>

      <div className="flex items-center justify-between text-center py-2">
        <div className="w-1/3">
          <p className="text-lg font-bold text-brand-text-primary truncate">{teamA}</p>
        </div>
        <div className="w-1/3 flex items-center justify-center space-x-3">
          <p className="text-4xl font-black text-brand-text-primary">{scoreA}</p>
          <p className="text-2xl text-brand-text-secondary">-</p>
          <p className="text-4xl font-black text-brand-text-primary">{scoreB}</p>
        </div>
        <div className="w-1/3">
          <p className="text-lg font-bold text-brand-text-primary truncate">{teamB}</p>
        </div>
      </div>
      
       <div className="flex items-center justify-center space-x-2 text-brand-green">
            <ClockIcon className="w-5 h-5" />
            <p className="text-lg font-semibold">{matchTime}'</p>
       </div>
      
      <MomentumTracker momentum={momentum} teamA={teamA} teamB={teamB} />

      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="bg-brand-bg-dark rounded-lg p-4 text-center flex flex-col justify-center items-center">
            <div className="flex items-center gap-2">
                <p className="text-sm text-brand-text-secondary">Live Odds</p>
                {hasValueAlert && <ValueAlertBadge />}
            </div>
            <p className="text-3xl font-black text-brand-text-primary mt-1">{liveOdds.toFixed(2)}</p>
            <p className="text-xs text-brand-text-secondary mt-1">{prediction.prediction}</p>
        </div>
         <div className="bg-brand-bg-dark rounded-lg p-4 text-center flex flex-col justify-center items-center">
            <p className="text-sm text-brand-text-secondary">AI Recommendation</p>
            {cashOutRecommendation.isRecommended ? (
                <div>
                     <p className="text-lg font-bold text-brand-yellow">Cash Out</p>
                     <p className="text-2xl font-black text-brand-text-primary mt-1">${cashOutRecommendation.value?.toFixed(2)}</p>
                </div>
            ) : (
                 <p className="text-lg font-bold text-brand-text-primary mt-1">Hold Bet</p>
            )}
        </div>
      </div>
      
      {cashOutRecommendation.isRecommended && cashOutRecommendation.reason && (
         <div className="pt-2">
             <p className="text-sm text-brand-yellow/80 italic bg-brand-yellow/10 p-3 rounded-md border-l-2 border-brand-yellow/50 text-center">
                <strong>Reason:</strong> {cashOutRecommendation.reason}
             </p>
         </div>
      )}

    </div>
  );
};