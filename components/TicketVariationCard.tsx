import React from 'react';
import { type TicketVariation, type UserSettings, type BankrollState } from '../types';

const BetIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
);

interface TicketVariationCardProps {
    variation: TicketVariation;
    onPlaceBet: () => void;
    bankrollState: BankrollState;
    userSettings: UserSettings;
}

export const TicketVariationCard: React.FC<TicketVariationCardProps> = ({ variation, onPlaceBet, bankrollState, userSettings }) => {
    const { title, description, bets, totalStake, potentialReturn, winProbability, totalEV } = variation;
    
    const remainingDailyLimit = userSettings.maxDailyStake - bankrollState.dailyWagered;
    const isOverSingleBetLimit = totalStake > userSettings.maxStakePerBet;
    const isOverDailyLimit = totalStake > remainingDailyLimit;
    const isAffordable = bankrollState.current >= totalStake;
    const isDisabled = !isAffordable || isOverSingleBetLimit || isOverDailyLimit;

    let disabledTitle = '';
    if (!isAffordable) disabledTitle = 'Insufficient bankroll.';
    else if (isOverSingleBetLimit) disabledTitle = `Stake exceeds your max bet limit of $${userSettings.maxStakePerBet.toFixed(2)}.`;
    else if (isOverDailyLimit) disabledTitle = `Stake exceeds your remaining daily limit of $${remainingDailyLimit.toFixed(2)}.`;
    
    return (
        <div className="bg-brand-bg-dark border border-brand-border rounded-lg overflow-hidden">
            <div className="p-4">
                <h4 className="font-bold text-brand-green">{title}</h4>
                <p className="text-xs text-brand-text-secondary mt-1">{description}</p>
                
                <div className="mt-4 space-y-2">
                    {bets.map((bet, i) => (
                        <div key={i} className="text-xs bg-brand-bg-light/50 p-2 rounded-md flex justify-between items-center">
                            <span className="font-semibold">{bet.prediction.prediction}</span>
                            <div className="text-right">
                                <span className="text-brand-text-primary">@{bet.prediction.odds.toFixed(2)}</span>
                                <span className="text-brand-text-secondary ml-2">(${bet.stake.toFixed(2)})</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-xs font-medium text-brand-text-secondary">Win Prob.</p>
                        <p className="text-lg font-bold text-brand-text-primary">{winProbability.toFixed(0)}%</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-brand-text-secondary">Total EV</p>
                        <p className={`text-lg font-bold ${totalEV > 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                            {totalEV > 0 ? '+' : ''}{totalEV.toFixed(1)}%
                        </p>
                    </div>
                </div>
            </div>
            
            <footer className="bg-brand-bg-dark/50 p-3">
                 <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs text-brand-text-secondary">Total Stake</p>
                            <p className="text-lg font-bold text-brand-text-primary">${totalStake.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-brand-text-secondary">Potential Return</p>
                            <p className="text-lg font-bold text-brand-green">${potentialReturn.toFixed(2)}</p>
                        </div>
                 </div>
                 <button
                    onClick={onPlaceBet}
                    disabled={isDisabled}
                    title={disabledTitle}
                    className="w-full mt-3 flex items-center justify-center px-4 py-2 bg-brand-green text-brand-bg-dark font-bold rounded-lg transition-colors duration-300 hover:bg-brand-green/80 disabled:bg-brand-border disabled:text-brand-text-secondary disabled:cursor-not-allowed"
                 >
                     <BetIcon className="w-5 h-5 mr-2" />
                     Place This Bet
                 </button>
            </footer>

        </div>
    );
};