import React from 'react';
import { Momentum } from '../types';

interface MomentumTrackerProps {
  momentum: Momentum;
  teamA: string;
  teamB: string;
}

export const MomentumTracker: React.FC<MomentumTrackerProps> = ({ momentum, teamA, teamB }) => {
  const getMomentumWidth = (side: 'A' | 'B') => {
    if (momentum === Momentum.TeamA && side === 'A') return 'w-4/5';
    if (momentum === Momentum.TeamB && side === 'B') return 'w-4/5';
    if (momentum === Momentum.Neutral) return 'w-1/2';
    return 'w-1/5';
  };

  const getMomentumColor = (side: 'A' | 'B') => {
    if ((momentum === Momentum.TeamA && side === 'A') || (momentum === Momentum.TeamB && side === 'B')) {
      return 'bg-brand-green';
    }
    return 'bg-brand-border';
  }

  return (
    <div className="w-full pt-2">
        <p className="text-center text-xs text-brand-text-secondary mb-2 font-bold uppercase tracking-wider">Momentum</p>
        <div className="flex w-full h-2 rounded-full overflow-hidden bg-brand-bg-dark">
            <div className={`transition-all duration-500 ease-out ${getMomentumWidth('A')} ${getMomentumColor('A')}`}></div>
            <div className={`transition-all duration-500 ease-out ${getMomentumWidth('B')} ${getMomentumColor('B')}`}></div>
        </div>
        <div className="flex justify-between text-xs text-brand-text-secondary mt-1 px-1">
            <span>{teamA}</span>
            <span>{teamB}</span>
        </div>
    </div>
  );
};
