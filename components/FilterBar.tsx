import React from 'react';
import { type FilterState, ConfidenceTier } from '../types';

interface FilterBarProps {
    sportsAndLeagues: Record<string, string[]>;
    marketTypes: string[];
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

const ALL_CONFIDENCES: (ConfidenceTier | 'All')[] = ['All', ConfidenceTier.High, ConfidenceTier.Medium, ConfidenceTier.Low];
const SORT_OPTIONS = [
    { value: 'matchDate', label: 'Match Date' },
    { value: 'highestOdds', label: 'Highest Odds' },
    { value: 'highestEV', label: 'Highest EV' },
];

export const FilterBar: React.FC<FilterBarProps> = ({ sportsAndLeagues, marketTypes, filters, onFilterChange }) => {
    
    const handleFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        const newFilters = { ...filters, [key]: value };
        // If sport changes, reset league
        if (key === 'sport') {
            newFilters.league = 'All';
        }
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        onFilterChange({
            sport: 'All',
            league: 'All',
            marketType: 'All',
            confidence: 'All',
            sortBy: 'matchDate',
        });
    };
    
    const availableLeagues = filters.sport === 'All' ? [] : sportsAndLeagues[filters.sport] || [];

    return (
        <div className="bg-brand-bg-light p-4 rounded-xl border border-brand-border w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Sport Filter */}
                 <div>
                    <label htmlFor="sport-filter" className="text-xs font-bold text-brand-text-secondary mb-1 block">Sport</label>
                    <select
                        id="sport-filter"
                        value={filters.sport}
                        onChange={(e) => handleFilter('sport', e.target.value)}
                        className="w-full bg-brand-bg-dark border border-brand-border rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none"
                    >
                        <option value="All">All Sports</option>
                        {Object.keys(sportsAndLeagues).sort().map(sport => (
                            <option key={sport} value={sport}>{sport}</option>
                        ))}
                    </select>
                </div>

                {/* League Filter */}
                <div>
                    <label htmlFor="league-filter" className="text-xs font-bold text-brand-text-secondary mb-1 block">League</label>
                    <select
                        id="league-filter"
                        value={filters.league}
                        onChange={(e) => handleFilter('league', e.target.value)}
                        disabled={filters.sport === 'All'}
                        className="w-full bg-brand-bg-dark border border-brand-border rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none disabled:bg-brand-border/30 disabled:cursor-not-allowed"
                    >
                        <option value="All">All Leagues</option>
                        {availableLeagues.map(league => (
                            <option key={league} value={league}>{league}</option>
                        ))}
                    </select>
                </div>

                {/* Market Type Filter */}
                 <div>
                    <label htmlFor="market-filter" className="text-xs font-bold text-brand-text-secondary mb-1 block">Bet Type</label>
                    <select
                        id="market-filter"
                        value={filters.marketType}
                        onChange={(e) => handleFilter('marketType', e.target.value)}
                        className="w-full bg-brand-bg-dark border border-brand-border rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none"
                    >
                        {marketTypes.map(type => (
                            <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
                        ))}
                    </select>
                </div>

                 {/* Sort By */}
                <div>
                    <label htmlFor="sort-by" className="text-xs font-bold text-brand-text-secondary mb-1 block">Sort By</label>
                    <select
                        id="sort-by"
                        value={filters.sortBy}
                        onChange={(e) => handleFilter('sortBy', e.target.value as FilterState['sortBy'])}
                        className="w-full bg-brand-bg-dark border border-brand-border rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none"
                    >
                         {SORT_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {/* Confidence Filter */}
                <div className="sm:col-span-2 lg:col-span-1">
                    <label className="text-xs font-bold text-brand-text-secondary mb-1 block">Confidence</label>
                    <div className="flex-shrink-0 bg-brand-bg-dark h-10 p-1 rounded-lg border border-brand-border flex items-center gap-1">
                        {ALL_CONFIDENCES.map(level => (
                            <button
                                key={level}
                                onClick={() => handleFilter('confidence', level)}
                                className={`w-full h-full text-xs font-bold rounded-md transition-colors ${filters.confidence === level ? 'bg-brand-green text-brand-bg-dark' : 'text-brand-text-secondary hover:bg-brand-border'}`}
                            >
                                {level === 'All' ? 'All' : level.slice(0,1)}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
             <button
                onClick={handleReset}
                className="w-full mt-4 px-4 py-2 text-sm font-bold text-brand-text-secondary hover:text-brand-text-primary bg-brand-bg-dark hover:bg-brand-border rounded-lg transition-colors border border-brand-border"
            >
                Reset All Filters
            </button>
        </div>
    );
};