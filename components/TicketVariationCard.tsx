import React from 'react';
import { TicketVariation } from '../types';

interface TicketVariationCardProps {
    variation: TicketVariation;
    onSelect: (variation: TicketVariation) => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);


export const TicketVariationCard: React.FC<TicketVariationCardProps> = ({ variation, onSelect }) => {
    return (
        <div className="bg-brand-bg-dark p-4 rounded-lg border border-brand-border animate-fade-in">
            <h4 className="font-bold text-brand-text-primary">{variation.title}</h4>
            <p className="text-xs text-brand-text-secondary mt-1 mb-3">{variation.description}</p>
            
            <div className="space-y-2 text-sm">
                {variation.bets.map((bet, index) => (
                    <div key={index} className="flex justify-between items-center bg-brand-bg-light p-2 rounded">
                        <span className="truncate pr-2 text-xs">{bet.prediction.prediction}</span>
                        <div className="text-right">
                           <span className="font-mono font-semibold text-sm">{formatCurrency(bet.stake)}</span>
                           <span className="text-xs text-brand-text-secondary ml-2">@{bet.prediction.odds.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-brand-border/50 flex justify-between items-center">
                <div>
                    <p className="text-xs text-brand-text-secondary">Total Stake</p>
                    <p className="font-bold text-brand-text-primary">{formatCurrency(variation.totalStake)}</p>
                </div>
                 <div className="text-right">
                    <p className="text-xs text-brand-text-secondary">Potential Return</p>
                    <p className="font-bold text-brand-green">{formatCurrency(variation.potentialReturn)}</p>
                </div>
            </div>
            <button
                onClick={() => onSelect(variation)}
                className="w-full mt-4 bg-brand-green/80 text-white font-bold py-2 rounded-md hover:bg-brand-green transition-colors"
            >
                Place This Bet
            </button>
        </div>
    );
};
