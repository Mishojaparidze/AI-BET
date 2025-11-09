import React, { useState, useMemo } from 'react';
import { TicketVariationCard } from './TicketVariationCard';
import { useStore } from '../store/useStore';
import { LoadingSpinner } from './LoadingSpinner';
import { TicketVariation, TicketSelection } from '../types';

const TrashIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);
const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L9.5 8.5 4 11l5.5 2.5L12 19l2.5-5.5L20 11l-5.5-2.5z"/></svg>
);

const RiskProfileSelector: React.FC = () => {
    const { riskProfile, setRiskProfile } = useStore(state => ({
        riskProfile: state.ticketRiskProfile,
        setRiskProfile: state.setTicketRiskProfile
    }));
    const options = [
        { value: 'Conservative', label: 'Conservative' },
        { value: 'Balanced', label: 'Balanced' },
        { value: 'Aggressive', label: 'Aggressive' }
    ] as const;

    return (
        <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-2">AI Strategy</label>
            <div className="flex bg-brand-bg-dark p-1 rounded-lg">
                {options.map(opt => (
                    <button 
                        key={opt.value}
                        onClick={() => setRiskProfile(opt.value)}
                        className={`w-full text-center px-2 py-1.5 text-sm font-bold rounded-md transition-colors ${riskProfile === opt.value ? 'bg-brand-green text-white' : 'text-brand-text-secondary hover:bg-brand-border'}`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export const TicketBuilder: React.FC = () => {
    const { 
        selections, onRemove, bankroll, userSettings, 
        generateVariations, variations, isGenerating, placeVariationBet,
        clearVariations, showConfirmation
    } = useStore(state => ({
        selections: state.ticketSelections,
        onRemove: state.handleAddToTicket,
        bankroll: state.bankroll,
        userSettings: state.userSettings,
        generateVariations: state.generateTicketVariations,
        variations: state.ticketVariations,
        isGenerating: state.isGeneratingTickets,
        placeVariationBet: state.placeVariationBet,
        clearVariations: state.clearTicketVariations,
        showConfirmation: state.showConfirmation,
    }));

    const [stake, setStake] = useState(50);

    const stakeError = useMemo(() => {
        if (stake <= 0) return "Stake must be positive.";
        if (bankroll && stake > bankroll.current) return "Stake exceeds current bankroll.";
        if (userSettings && stake > userSettings.maxDailyStake) return `Total stake exceeds daily limit of $${userSettings.maxDailyStake}.`;
        return null;
    }, [stake, bankroll, userSettings]);
    
    const handleGenerate = () => {
        if (stakeError) return;
        generateVariations(stake);
    };

    const handlePlaceBet = (variation: TicketVariation) => {
        showConfirmation(
            'Confirm Bet Placement',
            `Are you sure you want to place this bet? Total stake: $${variation.totalStake.toFixed(2)}`,
            () => {
                placeVariationBet(variation);
            }
        );
    };

    const groupedSelections = useMemo(() => {
        // FIX: Explicitly typing the accumulator of the reduce function ensures that TypeScript correctly infers the type of `groupedSelections`. This resolves errors where properties like `.length` and `.map` were not found on the `group` variable during iteration.
        return selections.reduce((acc: Record<string, TicketSelection[]>, selection) => {
            const key = selection.matchId;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(selection);
            return acc;
        }, {});
    }, [selections]);
    
    return (
        <section className="bg-brand-bg-light p-6 rounded-lg border border-brand-border shadow-lg">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-brand-text-primary">Bet Ticket</h2>
                {variations && (
                    <button onClick={clearVariations} className="text-sm text-brand-text-secondary hover:text-white">Back</button>
                )}
            </div>
            
            <div className="mt-4 space-y-4 max-h-96 overflow-y-auto pr-2">
                {Object.values(groupedSelections).map((group, index) => {
                    const isSGP = group.length > 1;
                    return (
                        <div key={group[0].matchId} className={`bg-brand-bg-dark rounded-md p-3 animate-fade-in ${isSGP ? 'border-l-4 border-brand-green' : ''}`}>
                            {isSGP && <h4 className="text-sm font-bold text-brand-green mb-2">Same Game Parlay</h4>}
                            <div className="space-y-2">
                                {group.map(selection => (
                                     <div key={selection.id} className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-bold text-brand-text-primary">{selection.prediction}</p>
                                            <p className="text-xs text-brand-text-secondary">{selection.teamA} vs {selection.teamB}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                           <span className="font-bold text-brand-yellow">{selection.odds.toFixed(2)}</span>
                                           <button onClick={() => onRemove(selection)} className="text-brand-text-secondary hover:text-brand-red"><TrashIcon className="w-4 h-4"/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {isGenerating && <div className="py-8"><LoadingSpinner /></div>}
            
            {variations ? (
                <div className="mt-4 border-t border-brand-border pt-4 space-y-4">
                    <h3 className="text-sm font-bold uppercase text-brand-text-secondary tracking-wider">AI Generated Tickets</h3>
                    {variations.map((v, i) => (
                        <TicketVariationCard key={i} variation={v} onSelect={handlePlaceBet} />
                    ))}
                </div>
            ) : !isGenerating && (
                 <div className="mt-4 border-t border-brand-border pt-4 space-y-4">
                    <RiskProfileSelector />
                    <div>
                        <label htmlFor="stake" className="block text-sm font-medium text-brand-text-secondary mb-1">Total Stake</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-text-secondary">$</span>
                            <input 
                                type="number" 
                                id="stake"
                                value={stake}
                                onChange={(e) => setStake(Number(e.target.value))}
                                className={`w-full bg-brand-bg-dark border rounded-md pl-7 pr-4 py-2 text-brand-text-primary focus:ring-2 focus:ring-brand-green focus:border-brand-green ${stakeError ? 'border-brand-red' : 'border-brand-border'}`}
                            />
                        </div>
                        {stakeError && <p className="text-xs text-brand-red mt-1">{stakeError}</p>}
                    </div>
                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating || !!stakeError || selections.length === 0}
                        className="w-full mt-2 flex items-center justify-center gap-2 bg-brand-green text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        <SparklesIcon className="w-5 h-5"/>
                        Generate Ticket Options
                    </button>
                </div>
            )}
        </section>
    );
};