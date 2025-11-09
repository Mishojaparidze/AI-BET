import React from 'react';
import { BankrollState } from '../types';

interface BetPerformanceProps {
    bankroll: BankrollState;
}

export const BetPerformance: React.FC<BetPerformanceProps> = ({ bankroll }) => {
    const { totalWagered, totalReturned } = bankroll;

    const roi = totalWagered > 0 ? ((totalReturned - totalWagered) / totalWagered) * 100 : 0;
    
    // Note: Win rate cannot be calculated from bankroll alone.
    // This would require iterating through all settled bets.
    // For this component, we'll focus on ROI.

    const getRoiColor = () => {
        if (roi > 10) return 'text-brand-green';
        if (roi < -10) return 'text-brand-red';
        return 'text-brand-yellow';
    };

    return (
        <div>
            <h3 className="text-sm font-bold uppercase text-brand-text-secondary tracking-wider mb-2">Performance</h3>
            <div className="bg-brand-bg-dark p-4 rounded-lg flex justify-around text-center">
                <div>
                    <p className="text-xs text-brand-text-secondary">Win Rate</p>
                    <p className="text-xl font-bold text-brand-text-primary">--%</p>
                    <p className="text-xs text-brand-text-secondary">(coming soon)</p>
                </div>
                 <div className="border-l border-brand-border"></div>
                <div>
                    <p className="text-xs text-brand-text-secondary">ROI</p>
                    <p className={`text-xl font-bold ${getRoiColor()}`}>{roi.toFixed(1)}%</p>
                    <p className="text-xs text-brand-text-secondary">Return on Investment</p>
                </div>
            </div>
        </div>
    );
};
