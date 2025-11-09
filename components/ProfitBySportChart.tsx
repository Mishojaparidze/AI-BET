import React from 'react';
import { useStore } from '../store/useStore';
import { Tooltip } from './Tooltip';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

export const ProfitBySportChart: React.FC = () => {
    const data = useStore(state => state.getProfitBySport());

    if (data.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-brand-text-secondary text-sm">
                No data available for the current filters.
            </div>
        );
    }

    const maxProfit = Math.max(...data.map(d => Math.abs(d.profit)), 1); // Avoid division by zero

    return (
        <div className="space-y-3 h-full flex flex-col justify-end">
            {data.map(({ sport, profit }) => {
                const isProfit = profit >= 0;
                const widthPercentage = (Math.abs(profit) / maxProfit) * 100;

                return (
                    <div key={sport} className="flex items-center gap-3 group">
                        <span className="text-sm text-brand-text-secondary w-28 text-right truncate">{sport}</span>
                        <div className="flex-1 bg-brand-bg-dark rounded-full h-8 flex items-center">
                            <Tooltip content={`${sport}: ${formatCurrency(profit)}`}>
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${isProfit ? 'bg-brand-green' : 'bg-brand-red'}`}
                                    style={{ width: `${widthPercentage}%` }}
                                ></div>
                            </Tooltip>
                        </div>
                         <span className={`w-20 text-sm font-mono font-semibold ${isProfit ? 'text-brand-green' : 'text-brand-red'}`}>
                            {formatCurrency(profit)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};