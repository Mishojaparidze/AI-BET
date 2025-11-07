import React, { useState } from 'react';
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

const DollarSignIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);

const LiveIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2" fill="currentColor"></circle>
        <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48 0a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
    </svg>
);

const ChevronDownIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);


interface BetHistoryCardProps {
    bet: UserBet;
    onTrackLiveBet: (bet: UserBet) => void;
    isLive: boolean;
}

export const BetHistoryCard: React.FC<BetHistoryCardProps> = ({ bet, onTrackLiveBet, isLive }) => {
    const { match, stake, odds, status, payout, selections } = bet;
    const isParlay = selections && selections.length > 0;
    const [isParlayExpanded, setIsParlayExpanded] = useState(false);

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
        },
        'cashed-out': {
            borderColor: 'border-brand-yellow/50',
            bgColor: 'bg-brand-yellow/10',
            textColor: 'text-brand-yellow',
            icon: <DollarSignIcon className="w-5 h-5" />,
            text: 'Cashed Out'
        }
    };
    
    const currentStatus = statusConfig[status];
    
    const canTrack = status === 'pending' && isLive && !isParlay;

    return (
        <div className={`p-4 rounded-lg border ${currentStatus.borderColor} ${currentStatus.bgColor} transition-all duration-300`}>
            <div className="grid grid-cols-12 gap-4 items-center">
                {/* Match Info */}
                <div className="col-span-12 md:col-span-5">
                    <p className="text-xs text-brand-text-secondary">{isParlay ? 'Parlay Ticket' : `${match.league} - ${match.matchDate}`}</p>
                    <p className="font-bold text-brand-text-primary">{isParlay ? `${selections.length}-Leg Parlay` : `${match.teamA} vs ${match.teamB}`}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-brand-green">{match.prediction}</p>
                         {isParlay && (
                            <button
                                onClick={() => setIsParlayExpanded(!isParlayExpanded)}
                                className="flex items-center text-xs text-brand-yellow hover:text-brand-yellow/80 ml-2 font-semibold"
                                aria-expanded={isParlayExpanded}
                                aria-controls={`parlay-details-${bet.id}`}
                            >
                                <LayersIcon className="w-4 h-4 mr-1" />
                                <span>Details</span>
                                <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform duration-300 ${isParlayExpanded ? 'rotate-180' : ''}`} />
                            </button>
                        )}
                    </div>
                </div>
                {/* Stake & Odds */}
                <div className="col-span-6 md:col-span-3 grid grid-cols-2 gap-2 text-center">
                     <div>
                        <p className="text-xs text-brand-text-secondary">Stake</p>
                        <p className="font-semibold text-brand-text-primary">${stake.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-brand-text-secondary">Odds</p>
                        <p className="font-semibold text-brand-text-primary">@{odds.toFixed(2)}</p>
                    </div>
                </div>
                {/* Payout/Return & Status */}
                <div className="col-span-12 md:col-span-4 grid grid-cols-2 gap-2">
                    <div className="text-center">
                        <p className="text-xs text-brand-text-secondary">{status === 'pending' ? 'Potential Payout' : 'Return'}</p>
                        <p className={`font-bold ${status === 'won' ? 'text-brand-green' : 'text-brand-text-primary'}`}>
                            {status === 'pending' ? `$${(stake * odds).toFixed(2)}` : `$${payout?.toFixed(2)}`}
                        </p>
                    </div>
                    {canTrack ? (
                         <button
                            onClick={() => onTrackLiveBet(bet)}
                            className="flex items-center justify-center font-bold text-sm bg-brand-red/80 text-white rounded-md animate-pulse hover:bg-brand-red"
                        >
                             <LiveIcon className="w-4 h-4 mr-1.5" />
                             Track Live
                         </button>
                    ) : (
                        <div className={`flex items-center justify-center font-bold text-sm rounded-md ${currentStatus.textColor}`}>
                            {currentStatus.icon}
                            <span className="ml-2">{currentStatus.text}</span>
                        </div>
                    )}
                </div>
            </div>
            
             {/* EXPANDABLE SECTION FOR PARLAYS */}
            {isParlay && (
                <div id={`parlay-details-${bet.id}`} className={`grid transition-all duration-500 ease-in-out ${isParlayExpanded ? 'grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-brand-border/50' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-brand-text-secondary mb-2 uppercase tracking-wider">Parlay Selections:</h4>
                        <ul className="space-y-2">
                            {selections.map((selection, index) => (
                                <li key={index} className="text-xs bg-brand-bg-dark p-2 rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="text-brand-text-secondary">{selection.teamA} vs {selection.teamB}</p>
                                        <p className="font-semibold text-brand-green">{selection.prediction}</p>
                                    </div>
                                    <span className="font-bold text-lg text-brand-text-primary">@{selection.odds.toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};