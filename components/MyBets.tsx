import React from 'react';
import { type UserBet } from '../types';
import { BetHistoryCard } from './BetHistoryCard';

interface MyBetsProps {
    bets: UserBet[];
}

const ClipboardListIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <line x1="12" y1="11" x2="12" y2="17"></line>
        <line x1="9" y1="14" x2="15" y2="14"></line>
    </svg>
);

export const MyBets: React.FC<MyBetsProps> = ({ bets }) => {
    const settledBets = bets.filter(b => b.status !== 'pending');
    const wins = settledBets.filter(b => b.status === 'won').length;
    const losses = settledBets.filter(b => b.status === 'lost').length;

    return (
        <section className="mb-12">
            <div className="flex items-center mb-6">
                <ClipboardListIcon className="w-7 h-7 text-brand-green mr-3" />
                <h2 className="text-3xl font-bold text-brand-text-primary">My Bets</h2>
            </div>
            
            <div className="bg-brand-bg-light p-6 rounded-xl border border-brand-border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6 pb-6 border-b border-brand-border">
                     <div>
                        <p className="text-sm font-medium text-brand-text-secondary">Total Bets</p>
                        <p className="text-2xl font-black text-brand-text-primary">{bets.length}</p>
                    </div>
                     <div>
                        <p className="text-sm font-medium text-brand-text-secondary">Pending</p>
                        <p className="text-2xl font-black text-brand-text-primary">{bets.length - settledBets.length}</p>
                    </div>
                     <div>
                        <p className="text-sm font-medium text-brand-text-secondary">Wins</p>
                        <p className="text-2xl font-black text-brand-green">{wins}</p>
                    </div>
                     <div>
                        <p className="text-sm font-medium text-brand-text-secondary">Losses</p>
                        <p className="text-2xl font-black text-brand-red">{losses}</p>
                    </div>
                </div>

                {bets.length > 0 ? (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {bets.map(bet => <BetHistoryCard key={bet.id} bet={bet} />)}
                    </div>
                ) : (
                    <p className="text-center text-brand-text-secondary py-8">
                        You haven't placed any bets yet. Find a prediction below to get started!
                    </p>
                )}
            </div>
        </section>
    );
};