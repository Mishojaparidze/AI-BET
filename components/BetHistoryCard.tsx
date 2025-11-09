import React, { useState } from 'react';
import { UserBet } from '../types';

interface BetHistoryCardProps {
    bet: UserBet;
}

const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const ShareIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
);
const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);


export const BetHistoryCard: React.FC<BetHistoryCardProps> = ({ bet }) => {
    const { match, stake, odds, status, payout, cashedOutAmount } = bet;
    const [isCopied, setIsCopied] = useState(false);

    const statusConfig = {
        pending: { text: 'Pending', color: 'text-brand-yellow', bg: 'bg-brand-yellow/10' },
        won: { text: 'Won', color: 'text-brand-green', bg: 'bg-brand-green/10' },
        lost: { text: 'Lost', color: 'text-brand-red', bg: 'bg-brand-red/10' },
        'cashed-out': { text: 'Cashed Out', color: 'text-sky-400', bg: 'bg-sky-400/10' },
    };

    const isParlay = !!bet.selections && bet.selections.length > 1;
    const title = isParlay ? `${bet.selections?.length}-Leg Parlay` : `${match.teamA} vs ${match.teamB}`;
    const predictionText = isParlay ? `Multiple Selections` : match.prediction;

    const handleShare = () => {
        if (navigator.clipboard) {
            const shareText = isParlay
                ? `Check out my ${bet.selections?.length}-Leg Parlay on BetGenius AI! Total odds: ${odds.toFixed(2)}.`
                : `Check out my bet on BetGenius AI! I took "${match.prediction}" in the ${match.teamA} vs ${match.teamB} match @${odds.toFixed(2)}.`;
            
            navigator.clipboard.writeText(shareText).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        }
    };


    return (
        <div className={`p-3 rounded-lg border-l-4 ${statusConfig[status].bg}`} style={{ borderLeftColor: `var(--color-brand-${statusConfig[status].color.split('-')[2]})` }}>
            <div className="flex justify-between items-start gap-2">
                <div>
                    <p className="text-xs text-brand-text-secondary">{title}</p>
                    <p className="font-bold text-sm text-brand-text-primary">{predictionText}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusConfig[status].bg} ${statusConfig[status].color}`}>
                        {statusConfig[status].text}
                    </div>
                    <button 
                        onClick={handleShare}
                        className={`p-1.5 rounded-full transition-colors ${isCopied ? 'bg-brand-green/20 text-brand-green' : 'bg-brand-bg-dark text-brand-text-secondary hover:bg-brand-border'}`}
                        aria-label="Share Bet"
                        title="Copy bet details to clipboard"
                    >
                        {isCopied ? <CheckIcon className="w-4 h-4" /> : <ShareIcon className="w-4 h-4" />}
                    </button>
                </div>
            </div>
            <div className="mt-2 pt-2 border-t border-brand-border/30 flex justify-between items-end text-sm">
                <div>
                    <p className="text-xs text-brand-text-secondary">Stake @ Odds</p>
                    <p className="font-semibold text-brand-text-primary">{formatCurrency(stake)} @ {odds.toFixed(2)}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-brand-text-secondary">{status === 'pending' ? 'Potential Payout' : 'Payout'}</p>
                    <p className={`font-bold ${status === 'won' ? 'text-brand-green' : ''}`}>
                        {status === 'pending' ? formatCurrency(stake * odds) : formatCurrency(cashedOutAmount ?? payout)}
                    </p>
                </div>
            </div>
        </div>
    );
};