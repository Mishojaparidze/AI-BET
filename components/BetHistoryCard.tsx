import React from 'react';
import { UserBet } from '../types';

interface BetHistoryCardProps {
    bet: UserBet;
}

const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const BetHistoryCard: React.FC<BetHistoryCardProps> = ({ bet }) => {
    const { match, stake, odds, status, payout, cashedOutAmount } = bet;

    const statusConfig = {
        pending: { text: 'Pending', color: 'text-brand-yellow', bg: 'bg-brand-yellow/10' },
        won: { text: 'Won', color: 'text-brand-green', bg: 'bg-brand-green/10' },
        lost: { text: 'Lost', color: 'text-brand-red', bg: 'bg-brand-red/10' },
        'cashed-out': { text: 'Cashed Out', color: 'text-sky-400', bg: 'bg-sky-400/10' },
    };

    const isParlay = !!bet.selections && bet.selections.length > 1;
    const title = isParlay ? `${bet.selections?.length}-Leg Parlay` : `${match.teamA} vs ${match.teamB}`;
    const predictionText = isParlay ? `Multiple Selections` : match.prediction;

    return (
        <div className={`p-3 rounded-lg border-l-4 ${statusConfig[status].bg}`} style={{ borderLeftColor: statusConfig[status].color.startsWith('text-') ? `var(--color-${statusConfig[status].color.substring(5)})` : statusConfig[status].color }}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs text-brand-text-secondary">{title}</p>
                    <p className="font-bold text-sm text-brand-text-primary">{predictionText}</p>
                </div>
                <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusConfig[status].bg} ${statusConfig[status].color}`}>
                    {statusConfig[status].text}
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
