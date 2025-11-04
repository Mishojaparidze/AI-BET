import React from 'react';
import { type FilterState, ConfidenceTier } from '../types';

interface FilterBarProps {
    leagues: string[];
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

const ALL_CONFIDENCES: (ConfidenceTier | 'All')[] = ['All', ConfidenceTier.High, ConfidenceTier.Medium, ConfidenceTier.Low];
const SORT_OPTIONS = [
    { value: 'matchDate', label: 'Match Date' },
    { value: 'highestOdds', label: 'Highest Odds' },
    { value: 'highestEV', label: 'Highest EV' },
];

export const FilterBar: React.FC<FilterBarProps> = ({ leagues, filters, onFilterChange }) => {
    
    const handleFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const handleReset = () => {
        onFilterChange({
            league: 'All',
            confidence: 'All',
            sortBy: 'matchDate',
        });
    };

    return (
        <div className="bg-brand-bg-light p-4 rounded-xl border border-brand-border flex flex-col md:flex-row items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                {/* League Filter */}
                <div className="w-full md:w-auto">
                    <label htmlFor="league-filter" className="sr-only">Filter by League</label>
                    <select
                        id="league-filter"
                        value={filters.league}
                        onChange={(e) => handleFilter('league', e.target.value)}
                        className="w-full bg-brand-bg-dark border border-brand-border rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none"
                    >
                        {leagues.map(league => (
                            <option key={league} value={league}>{league === 'All' ? 'All Sports' : league}</option>
                        ))}
                    </select>
                </div>

                {/* Confidence Filter */}
                <div className="flex-shrink-0 bg-brand-bg-dark p-1 rounded-lg border border-brand-border flex items-center gap-1">
                    {ALL_CONFIDENCES.map(level => (
                        <button
                            key={level}
                            onClick={() => handleFilter('confidence', level)}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${filters.confidence === level ? 'bg-brand-green text-brand-bg-dark' : 'text-brand-text-secondary hover:bg-brand-border'}`}
                        >
                            {level}
                        </button>
                    ))}
                </div>

                 {/* Sort By */}
                <div className="w-full md:w-auto">
                    <label htmlFor="sort-by" className="sr-only">Sort by</label>
                    <select
                        id="sort-by"
                        value={filters.sortBy}
                        onChange={(e) => handleFilter('sortBy', e.target.value as FilterState['sortBy'])}
                        className="w-full bg-brand-bg-dark border border-brand-border rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none"
                    >
                         {SORT_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>Sort by: {opt.label}</option>
                        ))}
                    </select>
                </div>

            </div>
            <button
                onClick={handleReset}
                className="w-full md:w-auto flex-shrink-0 px-4 py-2 text-sm font-bold text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-border rounded-lg transition-colors"
            >
                Reset
            </button>
        </div>
    );
};
