import React, { useState, useEffect } from 'react';
import { type UserBet, type LiveMatchPrediction, type MatchPrediction } from '../types';
import * as websocketService from '../services/websocketService';

interface LiveBetModalProps {
    bet: UserBet;
    onClose: () => void;
    onCashOut: (betId: string, cashOutValue: number) => void;
}

// Icons
const XCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
);
const ClockIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);
const DollarSignIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);

export const LiveBetModal: React.FC<LiveBetModalProps> = ({ bet, onClose, onCashOut }) => {
    const [liveData, setLiveData] = useState<LiveMatchPrediction | null>(null);

    useEffect(() => {
        const handleUpdate = (update: MatchPrediction | LiveMatchPrediction) => {
            if ('liveOdds' in update) {
                setLiveData(update);
            }
        };

        websocketService.subscribe(bet.match.id, handleUpdate);

        return () => {
            websocketService.unsubscribe(bet.match.id, handleUpdate);
        };
    }, [bet.match.id]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    
    const cashOutValue = liveData ? parseFloat((bet.stake * (liveData.liveOdds / bet.odds) * 0.9).toFixed(2)) : null; // Simulate bookmaker's margin
    const canCashOut = cashOutValue !== null && cashOutValue > 0;

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={handleOverlayClick}
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-brand-bg-light w-full max-w-lg rounded-2xl border-2 border-brand-red/50 shadow-2xl shadow-brand-red/10 flex flex-col overflow-hidden">
                <header className="p-6 border-b border-brand-border flex justify-between items-center flex-shrink-0">
                    <div>
                        <p className="text-sm font-medium text-brand-text-secondary uppercase tracking-wider">{bet.match.league}</p>
                        <h2 className="text-2xl font-bold text-brand-text-primary">{bet.match.teamA} vs {bet.match.teamB}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-brand-border transition-colors">
                        <XCircleIcon className="w-6 h-6 text-brand-text-secondary"/>
                    </button>
                </header>
                
                 <main className="p-6">
                    {liveData ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between text-center py-2">
                                <div className="w-1/3">
                                <p className="text-lg font-bold text-brand-text-primary truncate">{liveData.teamA}</p>
                                </div>
                                <div className="w-1/3 flex items-center justify-center space-x-3">
                                <p className="text-5xl font-black text-brand-text-primary">{liveData.scoreA}</p>
                                <p className="text-3xl text-brand-text-secondary">-</p>
                                <p className="text-5xl font-black text-brand-text-primary">{liveData.scoreB}</p>
                                </div>
                                <div className="w-1/3">
                                <p className="text-lg font-bold text-brand-text-primary truncate">{liveData.teamB}</p>
                                </div>
                            </div>

                             <div className="flex items-center justify-center space-x-2 text-brand-red">
                                <ClockIcon className="w-5 h-5" />
                                <p className="text-lg font-semibold">{liveData.matchTime}'</p>
                             </div>
                             
                             <div className="bg-brand-bg-dark rounded-lg p-4 text-center">
                                 <p className="text-sm text-brand-text-secondary">Your Bet</p>
                                 <p className="text-xl font-bold text-brand-green">{bet.match.prediction} <span className="text-brand-text-primary">@{bet.odds.toFixed(2)}</span></p>
                             </div>

                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-brand-text-secondary">Connecting to live match feed...</p>
                        </div>
                    )}
                </main>

                <footer className="bg-brand-bg-dark/50 p-6 border-t border-brand-border mt-auto flex-shrink-0">
                     <div className="text-center">
                        <p className="text-sm font-medium text-brand-text-secondary">Cash Out Value</p>
                        <p className={`text-4xl font-black transition-colors duration-300 ${canCashOut ? 'text-brand-yellow' : 'text-brand-text-secondary'}`}>
                            ${cashOutValue?.toFixed(2) ?? '0.00'}
                        </p>
                     </div>
                     <button
                        onClick={() => cashOutValue && onCashOut(bet.id, cashOutValue)}
                        disabled={!canCashOut}
                        className="w-full mt-4 flex items-center justify-center px-6 py-3 bg-brand-yellow text-brand-bg-dark font-bold rounded-lg transition-colors duration-300 hover:bg-brand-yellow/80 disabled:bg-brand-border disabled:text-brand-text-secondary disabled:cursor-not-allowed"
                     >
                         <DollarSignIcon className="w-5 h-5 mr-2" />
                         Cash Out Bet
                     </button>
                </footer>

            </div>
        </div>
    );
};
