import React from 'react';
import { useStore } from '../store/useStore';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

const DollarSignIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>);
const PercentIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>);
const TargetIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>);
const HashIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>);


const KpiCard: React.FC<{ title: string; value: string; description: string; colorClass?: string; icon: React.ReactNode }> = ({ title, value, description, colorClass = 'text-brand-text-primary', icon }) => (
    <div className="bg-brand-bg-light p-6 rounded-lg border border-brand-border shadow-lg">
        <div className="flex justify-between items-start">
            <p className="text-sm text-brand-text-secondary font-medium">{title}</p>
            <div className="text-brand-text-secondary">{icon}</div>
        </div>
        <p className={`text-4xl font-bold mt-2 ${colorClass}`}>{value}</p>
        <p className="text-xs text-brand-text-secondary mt-1">{description}</p>
    </div>
);

export const PerformanceKpis: React.FC = () => {
    const kpis = useStore(state => state.getDashboardKpis());

    const { totalProfitLoss, roi, winRate, totalBets, avgOdds, wins, losses } = kpis;
    
    const profitColor = totalProfitLoss > 0 ? 'text-brand-green' : totalProfitLoss < 0 ? 'text-brand-red' : 'text-brand-text-primary';
    const roiColor = roi > 0 ? 'text-brand-green' : roi < 0 ? 'text-brand-red' : 'text-brand-text-primary';

    if (totalBets === 0) {
        return (
            <div className="bg-brand-bg-light p-8 rounded-lg border border-brand-border text-center">
                <p className="text-brand-text-secondary">No settled bets match the current filters. Settle some bets or adjust filters to see your performance.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard 
                title="Total P/L"
                value={formatCurrency(totalProfitLoss)}
                description="Total profit or loss from settled bets."
                colorClass={profitColor}
                icon={<DollarSignIcon className="w-6 h-6"/>}
            />
            <KpiCard 
                title="ROI"
                value={`${roi.toFixed(1)}%`}
                description="Return on Investment on total wagered."
                colorClass={roiColor}
                icon={<PercentIcon className="w-6 h-6" />}
            />
            <KpiCard 
                title="Win Rate"
                value={`${winRate.toFixed(0)}%`}
                description={`${wins} Wins / ${losses} Losses`}
                icon={<TargetIcon className="w-6 h-6" />}
            />
            <KpiCard 
                title="Average Odds"
                value={avgOdds.toFixed(2)}
                description={`Across ${totalBets} total bets.`}
                icon={<HashIcon className="w-6 h-6" />}
            />
        </div>
    );
};