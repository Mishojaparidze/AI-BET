import React from 'react';
import { useStore } from '../store/useStore';

export const BetPerformance: React.FC = () => {
    const { kpis, settledBetsCount } = useStore(state => ({
        kpis: state.getOverallPerformanceKpis(),
        settledBetsCount: state.userBets.filter(b => b.status === 'won' || b.status === 'lost').length,
    }));
    
    const { roi, winRate, wins, losses } = kpis;

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
                    <p className="text-xl font-bold text-brand-text-primary">{settledBetsCount > 0 ? `${winRate.toFixed(0)}%` : '--%'}</p>
                    <p className="text-xs text-brand-text-secondary">{settledBetsCount > 0 ? `${wins}W - ${losses}L` : '(no settled bets)'}</p>
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