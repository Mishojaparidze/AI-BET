import React from 'react';
import { useStore } from '../store/useStore';

const formatCurrency = (amount: number, compact = false) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: compact ? 'compact' : 'standard',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};


export const BankrollChart: React.FC = () => {
    const data = useStore(state => state.getBankrollHistory());
    
    if (!data || data.length < 2) {
        return (
            <div className="h-48 flex items-center justify-center text-brand-text-secondary text-sm">
                Place and settle some bets to see your bankroll history.
            </div>
        );
    }

    const width = 300;
    const height = 150;
    const padding = 20;

    const bankrollValues = data.map(d => d.bankroll);
    const minBankroll = Math.min(...bankrollValues);
    const maxBankroll = Math.max(...bankrollValues);
    const timeValues = data.map(d => d.date.getTime());
    const minTime = Math.min(...timeValues);
    const maxTime = Math.max(...timeValues);

    const getX = (time: number) => {
        if (maxTime === minTime) return padding;
        return ((time - minTime) / (maxTime - minTime)) * (width - padding * 2) + padding;
    };

    const getY = (bankroll: number) => {
        if (maxBankroll === minBankroll) return height - padding;
        return height - (((bankroll - minBankroll) / (maxBankroll - minBankroll)) * (height - padding * 2) + padding);
    };

    const path = data.map((d, i) => {
        const x = getX(d.date.getTime());
        const y = getY(d.bankroll);
        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');

    const initialValue = data[0]?.bankroll ?? 0;
    const finalValue = data[data.length - 1]?.bankroll ?? 0;
    const isProfitable = finalValue >= initialValue;

    return (
        <div className="bg-brand-bg-dark p-4 rounded-lg">
            <div className="w-full" style={{ aspectRatio: '2 / 1' }}>
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                    {/* Y-Axis Labels */}
                    <text x={padding - 5} y={padding} textAnchor="end" fontSize="8" fill="#9ca3af">{formatCurrency(maxBankroll, true)}</text>
                    <text x={padding - 5} y={height - padding + 3} textAnchor="end" fontSize="8" fill="#9ca3af">{formatCurrency(minBankroll, true)}</text>
                    
                    {/* Grid Lines */}
                    <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#374151" strokeWidth="0.5" strokeDasharray="2" />
                    <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#374151" strokeWidth="0.5" strokeDasharray="2" />
                    <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#374151" strokeWidth="0.5" strokeDasharray="2" />

                    {/* Gradient */}
                    <defs>
                        <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={isProfitable ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={isProfitable ? '#10b981' : '#ef4444'} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={`${path} V ${height - padding} H ${getX(data[0].date.getTime())} Z`} fill="url(#chart-gradient)" />
                    
                    {/* Line Path */}
                    <path d={path} fill="none" stroke={isProfitable ? '#10b981' : '#ef4444'} strokeWidth="2" />

                     {/* End Point Circle */}
                    <circle cx={getX(data[data.length - 1].date.getTime())} cy={getY(data[data.length - 1].bankroll)} r="3" fill={isProfitable ? '#10b981' : '#ef4444'} />
                </svg>
            </div>
            <div className="flex justify-between text-xs text-brand-text-secondary mt-2 px-1">
                <span>{data[0].date.toLocaleDateString()}</span>
                <span>{data[data.length - 1].date.toLocaleDateString()}</span>
            </div>
        </div>
    );
};
