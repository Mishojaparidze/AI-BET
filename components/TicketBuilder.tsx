import React, { useState, useEffect } from 'react';
import { type TicketSelection, type MatchPrediction, type TicketVariation } from '../types';
import * as apiService from '../services/apiService';
import { TicketVariationCard } from './TicketVariationCard';

// Icons
const TicketIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9a3 3 0 0 1 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>
    </svg>
);
const XCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
);
const TrashIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);
const SparklesIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.9 4.8-4.8 1.9 4.8 1.9L12 21l1.9-4.8 4.8-1.9-4.8-1.9L12 3z"/><path d="M5 8v4"/><path d="M19 8v4"/><path d="M8 5h4"/><path d="M8 19h4"/>
    </svg>
);

interface TicketBuilderProps {
    selections: TicketSelection[];
    onRemove: (selection: TicketSelection) => void;
    onClear: () => void;
    onPlaceBet: (prediction: MatchPrediction, stake: number, selections?: MatchPrediction[]) => void;
    bankroll: number;
}

type RiskProfile = 'Conservative' | 'Balanced' | 'Aggressive';

export const TicketBuilder: React.FC<TicketBuilderProps> = ({ selections, onRemove, onClear, onPlaceBet, bankroll }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [stake, setStake] = useState('10');
    const [riskProfile, setRiskProfile] = useState<RiskProfile>('Balanced');
    const [view, setView] = useState<'builder' | 'loading' | 'results'>('builder');
    const [generatedTickets, setGeneratedTickets] = useState<TicketVariation[]>([]);

    const selectionCount = selections.length;
    const combinedOdds = selections.reduce((acc, s) => acc * s.odds, 1);

    useEffect(() => {
        // When selections change, reset to the builder view
        setView('builder');
    }, [selections]);
    
    useEffect(() => {
        // Automatically open the builder when the first item is added
        if (selectionCount > 0 && !isOpen) {
            setIsOpen(true);
        }
    }, [selectionCount]);
    
    const handleGenerate = async () => {
        setView('loading');
        const stakeAmount = parseFloat(stake);
        if (isNaN(stakeAmount) || stakeAmount <= 0) {
            alert("Please enter a valid stake.");
            setView('builder');
            return;
        }
        try {
            const tickets = await apiService.generateTickets(selections, stakeAmount, riskProfile);
            setGeneratedTickets(tickets);
            setView('results');
        } catch (error) {
            console.error("Failed to generate tickets:", error);
            setView('builder');
        }
    };
    
    const handlePlaceVariation = (variation: TicketVariation) => {
        // For multi-bet variations (like singles), we place them one by one.
        if (variation.bets.length > 1) {
            variation.bets.forEach(bet => {
                onPlaceBet(bet.prediction, bet.stake, [bet.prediction]);
            });
        } else { // For parlays
            const bet = variation.bets[0];
            onPlaceBet(bet.prediction, bet.stake, selections);
        }
        setIsOpen(false);
        onClear();
    }
    
    if (selectionCount === 0 && !isOpen) return null;

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center justify-center px-5 py-3 bg-brand-green text-brand-bg-dark font-bold rounded-full shadow-lg transition-transform duration-300 hover:scale-105"
                >
                    <TicketIcon className="w-6 h-6 mr-2" />
                    AI Ticket ({selectionCount})
                </button>
            </div>
        );
    }
    
    return (
        <div className="fixed inset-0 bg-black/70 z-40 flex justify-end">
            <div className="w-full max-w-md h-full bg-brand-bg-light shadow-2xl flex flex-col animate-slide-in">
                <header className="p-4 border-b border-brand-border flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <TicketIcon className="w-6 h-6 text-brand-green"/>
                        <h2 className="text-xl font-bold text-brand-text-primary">AI Ticket Generator</h2>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-brand-border">
                        <XCircleIcon className="w-6 h-6 text-brand-text-secondary"/>
                    </button>
                </header>

                <main className="p-4 overflow-y-auto flex-grow">
                    {view === 'loading' && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mb-4"></div>
                           <p className="text-lg font-semibold text-brand-text-primary">AI is Optimizing Your Slips...</p>
                           <p className="text-sm text-brand-text-secondary">Analyzing risk and maximizing value.</p>
                        </div>
                    )}
                    
                    {view === 'builder' && (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">{selectionCount} Selections</h3>
                                <button onClick={onClear} className="flex items-center text-sm text-brand-red hover:underline">
                                    <TrashIcon className="w-4 h-4 mr-1" />
                                    Clear All
                                </button>
                            </div>
                            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                {selections.map(s => (
                                    <div key={`${s.teamA}-${s.teamB}`} className="bg-brand-bg-dark p-3 rounded-lg flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-brand-text-secondary">{s.teamA} vs {s.teamB}</p>
                                            <p className="font-bold text-brand-green">{s.prediction}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-lg">@{s.odds.toFixed(2)}</span>
                                            <button onClick={() => onRemove(s)} className="p-1 text-brand-text-secondary hover:text-brand-red">
                                                <XCircleIcon className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {view === 'results' && (
                        <>
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">AI Generated Slips</h3>
                                <button onClick={() => setView('builder')} className="text-sm text-brand-green hover:underline">
                                    &larr; Back to Builder
                                </button>
                            </div>
                            <div className="space-y-4">
                                {generatedTickets.map((ticket, i) => (
                                    <TicketVariationCard 
                                        key={i} 
                                        variation={ticket}
                                        onPlaceBet={() => handlePlaceVariation(ticket)}
                                        bankroll={bankroll}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </main>

                {view === 'builder' && selectionCount > 0 && (
                    <footer className="p-4 border-t border-brand-border mt-auto flex-shrink-0 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="stake" className="text-xs text-brand-text-secondary font-bold">Total Stake</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-text-secondary">$</span>
                                    <input 
                                        type="number"
                                        id="stake"
                                        value={stake}
                                        onChange={(e) => setStake(e.target.value)}
                                        className="w-full bg-brand-bg-dark border border-brand-border rounded-lg py-2 pl-7 pr-4 focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none"
                                    />
                                </div>
                            </div>
                             <div>
                                <p className="text-xs text-brand-text-secondary font-bold">Parlay Odds</p>
                                <p className="text-2xl font-black mt-2">@{combinedOdds.toFixed(2)}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-brand-text-secondary font-bold mb-2">Risk Profile</p>
                            <div className="grid grid-cols-3 gap-2">
                                {(['Conservative', 'Balanced', 'Aggressive'] as RiskProfile[]).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setRiskProfile(p)}
                                        className={`px-3 py-2 text-sm font-bold rounded-lg transition-colors ${riskProfile === p ? 'bg-brand-green text-brand-bg-dark' : 'bg-brand-bg-dark hover:bg-brand-border'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={parseFloat(stake) <= 0 || parseFloat(stake) > bankroll}
                            className="w-full flex items-center justify-center px-6 py-3 bg-brand-green text-brand-bg-dark font-bold rounded-lg transition-colors duration-300 hover:bg-brand-green/80 disabled:bg-brand-border disabled:text-brand-text-secondary disabled:cursor-not-allowed"
                        >
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            Generate AI Slips
                        </button>
                    </footer>
                )}
            </div>
        </div>
    );
};
