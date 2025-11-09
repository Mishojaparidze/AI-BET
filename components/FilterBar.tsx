import React, { useMemo } from 'react';
import { FilterState, MatchPrediction, ConfidenceTier } from '../types';

interface FilterBarProps {
    filters: FilterState;
    onFilterChange: React.Dispatch<React.SetStateAction<FilterState>>;
    predictions: MatchPrediction[];
}

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


export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, predictions }) => {
    
    const uniqueOptions = useMemo(() => {
        const sports = [...new Set(predictions.map(p => p.sport))];
        const leagues = [...new Set(predictions.map(p => p.league))];
        const marketTypes = [...new Set(predictions.map(p => p.marketType))];
        return { sports, leagues, marketTypes };
    }, [predictions]);

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        onFilterChange(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="bg-brand-bg-light p-4 rounded-lg border border-brand-border">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
                 <FilterSelect 
                    label="Market Type" 
                    value={filters.marketType} 
                    options={uniqueOptions.marketTypes} 
                    onChange={(e) => handleFilterChange('marketType', e.target.value)}
                />
                <FilterSelect 
                    label="Confidence" 
                    value={filters.confidence} 
                    options={Object.values(ConfidenceTier)}
                    onChange={(e) => handleFilterChange('confidence', e.target.value)}
                />
                 <div>
                    <label className="block text-xs font-medium text-brand-text-secondary mb-1">Sort By</label>
                    <select 
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="w-full bg-brand-bg-dark border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text-primary focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    >
                        <option value="matchDate">Match Date</option>
                        <option value="highestOdds">Highest Odds</option>
                        <option value="highestEV">Highest EV</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
