import React from 'react';
import { useStore } from '../store/useStore';
import { UserBet } from '../types';

const formatCurrency = (amount: number | null | undefined, showSign = false) => {
    if (amount === null || amount === undefined) return '-';
    const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
    if (showSign && amount > 0) {
        return `+${formatted}`;
    }
    return formatted;
};

const BetRow: React.FC<{ bet: UserBet, index: number }> = ({ bet, index }) => {
    const { match, stake, odds, status, payout, placedAt } = bet;
    const pnl = (payout ?? 0) - stake;
    const isParlay = !!bet.selections && bet.selections.length > 1;
    const title = isParlay ? `${bet.selections?.length}-Leg Parlay` : `${match.teamA} vs ${match.teamB}`;
    const predictionText = isParlay ? `Multiple Selections` : match.prediction;

    const pnlColor = pnl > 0 ? 'text-brand-green' : pnl < 0 ? 'text-brand-red' : 'text-brand-text-secondary';
    const rowBg = index % 2 === 0 ? 'bg-brand-bg-light' : 'bg-brand-bg-dark/50';

    return (
        <tr className={`${rowBg} hover:bg-brand-border/20`}>
            <td className="px-4 py-3 text-sm text-brand-text-secondary hidden md:table-cell">{new Date(placedAt).toLocaleDateString()}</td>
            <td className="px-4 py-3">
                <p className="font-semibold text-brand-text-primary">{title}</p>
                <p className="text-xs text-brand-text-secondary">{predictionText}</p>
            </td>
            <td className="px-4 py-3 text-right font-mono hidden sm:table-cell">{formatCurrency(stake)}</td>
            <td className="px-4 py-3 text-right font-mono hidden sm:table-cell">{odds.toFixed(2)}</td>
            <td className={`px-4 py-3 text-right font-mono font-semibold ${pnlColor}`}>{formatCurrency(pnl, true)}</td>
        </tr>
    )
}

export const BetHistoryTable: React.FC = () => {
    const bets = useStore(state => state.getFilteredSettledBets());
    
    if (bets.length === 0) {
        return <p className="text-brand-text-secondary text-center py-8">No settled bets match the current filters.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="text-xs text-brand-text-secondary uppercase bg-brand-bg-dark">
                    <tr>
                        <th className="px-4 py-3 font-semibold hidden md:table-cell">Date</th>
                        <th className="px-4 py-3 font-semibold">Match / Selection</th>
                        <th className="px-4 py-3 font-semibold text-right hidden sm:table-cell">Stake</th>
                        <th className="px-4 py-3 font-semibold text-right hidden sm:table-cell">Odds</th>
                        <th className="px-4 py-3 font-semibold text-right">P/L</th>
                    </tr>
                </thead>
                <tbody>
                    {bets.map((bet, index) => <BetRow key={bet.id} bet={bet} index={index} />)}
                </tbody>
            </table>
        </div>
    );
};