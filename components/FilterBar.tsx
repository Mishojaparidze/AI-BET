
import React, { useMemo } from 'react';
import { FilterState, ConfidenceTier, MarketType } from '../types';
import { useStore } from '../store/useStore';

const SearchIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const SlidersIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
);

const FilterPill: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
    <button 
        onClick={onClick}
        className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${active ? 'bg-brand-text-primary text-brand-bg-dark' : 'bg-brand-bg-elevated text-brand-text-secondary border border-brand-border hover:border-brand-text-secondary'}`}
    >
        {label}
    </button>
);

export const FilterBar: React.FC = () => {
    const { filters, setFilters, predictions } = useStore(state => ({
        filters: state.filters,
        setFilters: state.setFilters,
        predictions: state.predictions
    }));
    
    const uniqueOptions = useMemo(() => {
        const sports = [...new Set(predictions.map(p => p.sport))];
        return { sports };
    }, [predictions]);

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters({ ...filters, [key]: value });
    };

    return (
        <div className="space-y-3">
            {/* AI Command Input */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-brand-green group-focus-within:text-brand-green transition-colors" />
                </div>
                <input 
                    type="text"
                    placeholder="Ask BetGenius (e.g. 'Lakers', 'High Confidence', 'NBA')"
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-brand-border rounded-xl leading-5 bg-brand-bg-light text-brand-text-primary placeholder-brand-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green sm:text-sm shadow-sm transition-all"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <SlidersIcon className="h-5 w-5 text-brand-text-secondary" />
                </div>
            </div>

            {/* Quick Filter Pills */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                <FilterPill 
                    active={filters.confidence === ConfidenceTier.High} 
                    onClick={() => handleFilterChange('confidence', filters.confidence === ConfidenceTier.High ? 'All' : ConfidenceTier.High)} 
                    label="High Confidence" 
                />
                <FilterPill 
                    active={filters.sortBy === 'highestEV'} 
                    onClick={() => handleFilterChange('sortBy', 'highestEV')} 
                    label="High EV+" 
                />
                {uniqueOptions.sports.slice(0, 4).map(sport => (
                    <FilterPill 
                        key={sport}
                        active={filters.sport === sport}
                        onClick={() => handleFilterChange('sport', filters.sport === sport ? 'All' : sport)}
                        label={sport}
                    />
                ))}
            </div>
        </div>
    );
};
