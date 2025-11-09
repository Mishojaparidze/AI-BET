import React from 'react';
import { BetPerformance } from './BetPerformance';
import { useStore } from '../store/useStore';
import { Accordion } from './Accordion';
import { BankrollChart } from './BankrollChart';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

const TrendingUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

const TrendingDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
);

export const BankrollManager: React.FC = () => {
    const { bankroll, userSettings } = useStore(state => ({
        bankroll: state.bankroll,
        userSettings: state.userSettings,
    }));

    if (!bankroll || !userSettings) return null;

    const { initial, current, totalWagered, dailyWagered } = bankroll;
    const profit = current - initial;
    const isProfitable = profit >= 0;

    const dailyLimitProgress = (dailyWagered / userSettings.maxDailyStake) * 100;

    return (
        <section className="bg-brand-bg-light p-6 rounded-lg border border-brand-border shadow-lg">
            <h2 className="text-xl font-bold text-brand-text-primary mb-1">Bankroll</h2>
            <p className="text-brand-text-secondary mb-4">Your betting finance overview.</p>
            
            <div className="mb-6">
                <p className="text-sm text-brand-text-secondary">Current Balance</p>
                <p className="text-4xl font-bold text-brand-text-primary">{formatCurrency(current)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div>
                    <p className="text-brand-text-secondary">Total Wagered</p>
                    <p className="font-semibold text-brand-text-primary">{formatCurrency(totalWagered)}</p>
                </div>
                <div className={`p-3 rounded-md ${isProfitable ? 'bg-brand-green/10' : 'bg-brand-red/10'}`}>
                    <p className={`flex items-center gap-1 font-bold ${isProfitable ? 'text-brand-green' : 'text-brand-red'}`}>
                        {isProfitable ? <TrendingUpIcon className="w-4 h-4" /> : <TrendingDownIcon className="w-4 h-4" />}
                        Profit / Loss
                    </p>
                    <p className={`font-bold text-lg ${isProfitable ? 'text-brand-green' : 'text-brand-red'}`}>{formatCurrency(profit)}</p>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center text-xs text-brand-text-secondary mb-1">
                    <span>Daily Wager Limit</span>
                    <span>{formatCurrency(dailyWagered)} / {formatCurrency(userSettings.maxDailyStake)}</span>
                </div>
                <div className="w-full bg-brand-bg-dark rounded-full h-2.5">
                    <div 
                        className="bg-brand-green h-2.5 rounded-full" 
                        style={{ width: `${dailyLimitProgress}%` }}
                    ></div>
                </div>
            </div>
            
            <div className="border-t border-brand-border pt-4 mt-4">
                 <BetPerformance />
            </div>
            
            <div className="mt-4">
                <Accordion title="Bankroll History">
                    <BankrollChart />
                </Accordion>
            </div>

        </section>
    );
};