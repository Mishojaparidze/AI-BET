

import React, { useMemo } from 'react';
// Import MarketType as well for the new filter
import { FilterState, ConfidenceTier, MarketType } from '../types';
import { useStore } from '../store/useStore';

// FilterSelect can remain as a local helper component
const FilterSelect: React.FC<{
    label: string;
    value: string;
    options: string[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ label, value, options, onChange }) => (
    <div>
        <label className="block text-xs font-medium text-brand-text-secondary mb-1">{label}</label>
        <select 
            value={value}
            onChange={onChange}
            className="w-full bg-brand-bg-dark border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text-primary focus:ring-2 focus:ring-brand-green focus:border-brand-green"
        >
            <option value="All">All</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

// This is the new button-based UI for the Confidence filter
const ConfidenceButtonGroup: React.FC<{
    value: ConfidenceTier | 'All';
    onChange: (value: ConfidenceTier | 'All') => void;
}> = ({ value, onChange }) => {
    const options = [
        { value: 'All', label: 'All' },
        { value: ConfidenceTier.High, label: 'High' },
        { value: ConfidenceTier.Medium, label: 'Medium' },
        { value: ConfidenceTier.Low, label: 'Low' }
    ] as const;

    const getButtonStyles = (optionValue: ConfidenceTier | 'All', currentValue: ConfidenceTier | 'All') => {
        const isActive = optionValue === currentValue;
        const baseStyle = 'w-full text-center px-2 py-1.5 text-xs font-bold rounded-md transition-colors border';
        
        if (isActive) {
            switch (optionValue) {
                case ConfidenceTier.High: return `${baseStyle} bg-brand-green text-white border-brand-green`;
                case ConfidenceTier.Medium: return `${baseStyle} bg-brand-yellow text-white border-brand-yellow`;
                case ConfidenceTier.Low: return `${baseStyle} bg-brand-red text-white border-brand-red`;
                default: return `${baseStyle} bg-brand-green text-white border-brand-green`; // 'All' is active
            }
        } else {
             switch (optionValue) {
                case ConfidenceTier.High: return `${baseStyle} bg-transparent text-brand-green border-brand-green/50 hover:bg-brand-green/20`;
                case ConfidenceTier.Medium: return `${baseStyle} bg-transparent text-brand-yellow border-brand-yellow/50 hover:bg-brand-yellow/20`;
                case ConfidenceTier.Low: return `${baseStyle} bg-transparent text-brand-red border-brand-red/50 hover:bg-brand-red/20`;
                default: return `${baseStyle} bg-transparent text-brand-text-secondary border-brand-border hover:bg-brand-border`; // 'All' is inactive
            }
        }
    };

    return (
        <div>
            <label className="block text-xs font-medium text-brand-text-secondary mb-2">Confidence</label>
            <div className="flex bg-brand-bg-dark p-1 rounded-lg gap-2">
                {options.map(opt => (
                    <button 
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={getButtonStyles(opt.value, value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
};


export const FilterBar: React.FC = () => {
    const { filters, setFilters, predictions } = useStore(state => ({
        filters: state.filters,
        setFilters: state.setFilters,
        predictions: state.predictions
    }));
    
    // Create context-aware dropdown options
    const uniqueOptions = useMemo(() => {
        const sports = [...new Set(predictions.map(p => p.sport))];
        
        // Filter predictions based on the selected sport before extracting leagues and market types
        const relevantPredictions = predictions.filter(p => filters.sport === 'All' || p.sport === filters.sport);
        
        const leagues = [...new Set(relevantPredictions.map(p => p.league))];
        const marketTypes = [...new Set(relevantPredictions.map(p => p.marketType))].filter(mt => mt !== MarketType.Parlay);

        return { sports, leagues, marketTypes };
    }, [predictions, filters.sport]); // Re-calculate when predictions or the selected sport changes

    // Update the handler to accept ConfidenceTier enum values directly
    const handleFilterChange = (key: keyof FilterState, value: string | ConfidenceTier) => {
        setFilters({ ...filters, [key]: value });
    };

    return (
        <div className="bg-brand-bg-light p-4 rounded-lg border border-brand-border">
            {/* Using a more responsive grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-1 sm:col-span-2 md:col-span-4">
                    <label htmlFor="search-teams" className="block text-xs font-medium text-brand-text-secondary mb-1">Search Teams</label>
                    <input 
                        id="search-teams"
                        type="text"
                        placeholder="e.g., Arsenal, Real Madrid..."
                        value={filters.searchTerm}
                        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                        className="w-full bg-brand-bg-dark border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text-primary focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    />
                </div>
                
                <FilterSelect 
                    label="Sport" 
                    value={filters.sport} 
                    options={uniqueOptions.sports} 
                    onChange={(e) => handleFilterChange('sport', e.target.value)}
                />
                 <FilterSelect 
                    label="League" 
                    value={filters.league} 
                    options={uniqueOptions.leagues} 
                    onChange={(e) => handleFilterChange('league', e.target.value)}
                />
                {/* Adding the missing Market Type filter */}
                 <FilterSelect 
                    label="Market Type" 
                    value={filters.marketType} 
                    options={uniqueOptions.marketTypes} 
                    onChange={(e) => handleFilterChange('marketType', e.target.value)}
                />
                 <div>
                    <label className="block text-xs font-medium text-brand-text-secondary mb-1">Sort By</label>
                    <select 
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value as FilterState['sortBy'])}
                        className="w-full bg-brand-bg-dark border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text-primary focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    >
                        <option value="matchDate">Match Date</option>
                        <option value="highestConfidence">Highest Confidence</option>
                        <option value="highestEV">Highest EV</option>
                        <option value="highestOdds">Highest Odds</option>
                        <option value="lowestOdds">Lowest Odds</option>
                    </select>
                </div>
                
                {/* Replacing the old dropdown with the new button group for Confidence */}
                <div className="col-span-1 sm:col-span-2 md:col-span-4">
                   <ConfidenceButtonGroup
                        value={filters.confidence}
                        onChange={(value) => handleFilterChange('confidence', value)}
                   />
                </div>
            </div>
        </div>
    );
};