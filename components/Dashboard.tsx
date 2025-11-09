import React from 'react';
import { BankrollChart } from './BankrollChart';
import { BetHistoryTable } from './BetHistoryTable';
import { DashboardFilterBar } from './DashboardFilterBar';
import { PerformanceKpis } from './PerformanceKpis';
import { ProfitBySportChart } from './ProfitBySportChart';

export const Dashboard: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-brand-text-primary">Performance Dashboard</h1>
                <p className="text-brand-text-secondary mt-1">Analyze your betting history and track your performance.</p>
            </div>
            
            <DashboardFilterBar />

            <PerformanceKpis />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-brand-bg-light p-6 rounded-lg border border-brand-border shadow-lg">
                    <h2 className="text-xl font-bold text-brand-text-primary mb-4">Bankroll History</h2>
                    <BankrollChart />
                </div>
                <div className="bg-brand-bg-light p-6 rounded-lg border border-brand-border shadow-lg">
                    <h2 className="text-xl font-bold text-brand-text-primary mb-4">Profit by Sport</h2>
                    <ProfitBySportChart />
                </div>
            </div>
            
            <div className="bg-brand-bg-light p-6 rounded-lg border border-brand-border shadow-lg">
                <h2 className="text-xl font-bold text-brand-text-primary mb-4">Filtered Bet History</h2>
                <BetHistoryTable />
            </div>

        </div>
    );
};