import React, { useMemo } from 'react';
import { useStore, type DashboardFilterState } from '../store/useStore';
import { MarketType } from '../types';

export const DashboardFilterBar: React.FC = () => {
    const { filters, setFilters, allBets } = useStore(state => ({
        filters: state.dashboardFilters,
        setFilters: state.setDashboardFilters,
        allBets: state.userBets
    }));

    const uniqueOptions = useMemo(() => {
        const settledBets = allBets.filter(b => b.status !== 'pending');
        const sports = [...new Set(settledBets.map(b => b.match.sport))];
        const marketTypes = [...new Set(settledBets.map(b => b.match.marketType))];
        return { sports, marketTypes };
    }, [allBets]);

    const handleFilterChange = <K extends keyof typeof filters>(key: K, value: (typeof filters)[K]) => {
        setFilters({ ...filters, [key]: value });
    };

    return (
        <div className="bg-brand-bg-light p-4 rounded-lg border border-brand-border">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                    <label className="block text-xs font-medium text-brand-text-secondary mb-1">Date Range</label>
                    <select
                        value={filters.dateRange}
                        onChange={(e) => handleFilterChange('dateRange', e.target.value as '7d' | '30d' | 'all')}
                        className="w-full bg-brand-bg-dark border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text-primary focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    >
                        <option value="all">All Time</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="7d">Last 7 Days</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-xs font-medium text-brand-text-secondary mb-1">Sport</label>
                    <select
                        value={filters.sport}
                        onChange={(e) => handleFilterChange('sport', e.target.value)}
                        className="w-full bg-brand-bg-dark border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text-primary focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    >
                        <option value="All">All Sports</option>
                        {uniqueOptions.sports.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-xs font-medium text-brand-text-secondary mb-1">Market Type</label>
                    <select
                         value={filters.marketType}
                        onChange={(e) => handleFilterChange('marketType', e.target.value)}
                        className="w-full bg-brand-bg-dark border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text-primary focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    >
                        <option value="All">All Markets</option>
                         {uniqueOptions.marketTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-brand-text-secondary mb-1">Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value as 'all' | 'won' | 'lost')}
                        className="w-full bg-brand-bg-dark border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text-primary focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    >
                        <option value="all">All</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-brand-text-secondary mb-1">Sort By</label>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value as DashboardFilterState['sortBy'])}
                        className="w-full bg-brand-bg-dark border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text-primary focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    >
                        <option value="placedAt_desc">Newest First</option>
                        <option value="placedAt_asc">Oldest First</option>
                        <option value="pnl_desc">Highest Profit</option>
                        <option value="pnl_asc">Biggest Loss</option>
                        <option value="odds_desc">Highest Odds</option>
                        <option value="odds_asc">Lowest Odds</option>
                    </select>
                </div>
            </div>
        </div>
    );
};