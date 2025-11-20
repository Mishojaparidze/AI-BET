
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
            <label className="block text-xs font-medium text-brand-text-secondary mb-2 uppercase tracking-wider">Strategy Engine</label>
            <div className="flex bg-brand-bg-dark p-1 rounded-lg border border-brand-border/50">
                {options.map(opt => (
                    <button 
                        key={opt.value}
                        onClick={() => setRiskProfile(opt.value)}
                        className={`w-full text-center px-2 py-2 text-xs font-bold rounded-md transition-all duration-300 ${riskProfile === opt.value ? 'bg-brand-green text-white shadow-md' : 'text-brand-text-secondary hover:bg-brand-border/50'}`}
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
    
    // Debounced generation or manual trigger could be added here for the slider
    // For now, let's keep the manual button but make the slider experience fluid
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
        return selections.reduce<Record<string, TicketSelection[]>>((acc, selection) => {
            const key = selection.matchId;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(selection);
            return acc;
        }, {});
    }, [selections]);
    
    return (
        <section className="bg-brand-bg-light p-6 rounded-2xl border border-brand-border shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                     <div className="w-1.5 h-6 bg-brand-blue rounded-full"></div>
                     <h2 className="text-xl font-bold text-brand-text-primary">Smart Ticket</h2>
                </div>
                {variations && (
                    <button onClick={clearVariations} className="text-xs font-bold text-brand-text-secondary hover:text-white bg-brand-bg-dark px-3 py-1 rounded-full transition-colors">Reset</button>
                )}
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 mb-6">
                {Object.values(groupedSelections).map((group: TicketSelection[]) => {
                    const isSGP = group.length > 1;
                    return (
                        <div key={group[0].matchId} className={`bg-brand-bg-elevated rounded-xl p-3 animate-fade-in ${isSGP ? 'border-l-4 border-brand-green' : 'border border-brand-border/30'}`}>
                            {isSGP && <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-green mb-2">Same Game Parlay</h4>}
                            <div className="space-y-3">
                                {group.map(selection => (
                                     <div key={selection.id} className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-bold text-brand-text-primary">{selection.prediction}</p>
                                            <p className="text-[11px] text-brand-text-secondary">{selection.teamA} vs {selection.teamB}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                           <span className="font-mono font-bold text-brand-yellow">{selection.odds.toFixed(2)}</span>
                                           <button onClick={() => onRemove(selection)} className="text-brand-text-secondary hover:text-brand-red transition-colors"><TrashIcon className="w-4 h-4"/></button>
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
                <div className="mt-4 border-t border-brand-border/50 pt-6 space-y-4">
                    <h3 className="text-xs font-bold uppercase text-brand-text-secondary tracking-wider">AI Optimized Combinations</h3>
                    {variations.map((v, i) => (
                        <TicketVariationCard key={i} variation={v} onSelect={handlePlaceBet} />
                    ))}
                </div>
            ) : !isGenerating && (
                 <div className="mt-6 border-t border-brand-border/50 pt-6 space-y-6">
                    <RiskProfileSelector />
                    
                    {/* Dynamic Slider for Stake */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label htmlFor="stake" className="text-xs font-medium text-brand-text-secondary uppercase tracking-wider">Total Stake Allocation</label>
                            <span className="text-2xl font-bold text-brand-green">${stake}</span>
                        </div>
                        
                        <input 
                            type="range" 
                            min="10" 
                            max={userSettings ? Math.min(userSettings.maxDailyStake, 1000) : 1000} 
                            step="5"
                            value={stake}
                            onChange={(e) => setStake(Number(e.target.value))}
                            className="w-full h-2 bg-brand-bg-dark rounded-lg appearance-none cursor-pointer accent-brand-green"
                        />
                        <div className="flex justify-between mt-1 text-[10px] text-brand-text-secondary font-mono">
                            <span>$10</span>
                            <span>${userSettings ? Math.min(userSettings.maxDailyStake, 1000) : 1000}</span>
                        </div>

                        {stakeError && <p className="text-xs text-brand-red mt-2 font-medium">{stakeError}</p>}
                    </div>

                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating || !!stakeError || selections.length === 0}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-green to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-green/20 hover:shadow-brand-green/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <SparklesIcon className="w-5 h-5"/>
                        Run Prediction Engine
                    </button>
                </div>
            )}
        </section>
    );
};
