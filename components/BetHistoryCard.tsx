import React from 'react';
import { type UserBet } from '../types';

const ClockIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const CheckCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
);

const XCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
);

const LayersIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>
    </svg>
);


interface BetHistoryCardProps {
    bet: UserBet;
}

export const BetHistoryCard: React.FC<BetHistoryCardProps> = ({ bet }) => {
    const { match, stake, odds, status, payout, selections } = bet;
    const isParlay = selections && selections.length > 0;

    const statusConfig = {
        pending: {
            borderColor: 'border-brand-border',
            bgColor: 'bg-brand-bg-dark',
            textColor: 'text-brand-text-secondary',
            icon: <ClockIcon className="w-5 h-5" />,
            text: 'Pending'
        },
        won: {
            borderColor: 'border-brand-green/50',
            bgColor: 'bg-brand-green/10',
            textColor: 'text-brand-green',
            icon: <CheckCircleIcon className="w-5 h-5" />,
            text: 'Won'
        },
        lost: {
            borderColor: 'border-brand-red/50',
            bgColor: 'bg-brand-red/10',
            textColor: 'text-brand-red',
            icon: <XCircleIcon className="w-5 h-5" />,
            text: 'Lost'
        }
    };
    
    const currentStatus = statusConfig[status];

    const parlayTooltipText = isParlay ? selections.map(s => `${s.teamA} vs ${s.teamB}: ${s.prediction}`).join('\n') : '';

    return (
        <div className={`p-4 rounded-lg border ${currentStatus.borderColor} ${currentStatus.bgColor} grid grid-cols-12 gap-4 items-center`}>
            {/* Match Info */}
            <div className="col-span-12 md:col-span-5">
                <p className="text-xs text-brand-text-secondary">{isParlay ? 'Parlay Ticket' : `${match.league} - ${match.matchDate}`}</p>
                <p className="font-bold text-brand-text-primary">{isParlay ? `${selections.length}-Leg Parlay` : `${match.teamA} vs ${match.teamB}`}</p>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-brand-green">{match.prediction}</p>
                    {isParlay && (
                        <div className="relative group">
                            <LayersIcon className="w-4 h-4 text-brand-yellow cursor-pointer" />
                             <div className="absolute bottom-full mb-2 w-64 bg-brand-bg-dark border border-brand-border text-brand-text-secondary text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-pre-wrap pointer-events-none">
                                {parlayTooltipText}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Stake */}
            <div className="col-span-6 md:col-span-2 text-center">
                <p className="text-xs text-brand-text-secondary">Stake</p>
                <p className="font-semibold text-brand-text-primary">${stake.toFixed(2)}</p>
            </div>
             {/* Odds */}
            <div className="col-span-6 md:col-span-1 text-center">
                <p className="text-xs text-brand-text-secondary">Odds</p>
                <p className="font-semibold text-brand-text-primary">@{odds.toFixed(2)}</p>
            </div>
            {/* Payout/Return */}
            <div className="col-span-6 md:col-span-2 text-center">
                <p className="text-xs text-brand-text-secondary">{status === 'pending' ? 'Potential Payout' : 'Return'}</p>
                <p className={`font-bold ${status === 'won' ? 'text-brand-green' : 'text-brand-text-primary'}`}>
                    {status === 'pending' ? `$${(stake * odds).toFixed(2)}` : `$${payout?.toFixed(2)}`}
                </p>
            </div>
             {/* Status */}
            <div className={`col-span-6 md:col-span-2 flex items-center justify-center font-bold text-sm ${currentStatus.textColor}`}>
                {currentStatus.icon}
                <span className="ml-2">{currentStatus.text}</span>
            </div>
        </div>
    );
};