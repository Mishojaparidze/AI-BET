import React, { useState } from 'react';
import { UserBet } from '../types';
import { BetHistoryCard } from './BetHistoryCard';

interface MyBetsProps {
    bets: UserBet[];
}

export const MyBets: React.FC<MyBetsProps> = ({ bets }) => {
    const [showHistory, setShowHistory] = useState(false);

    const pendingBets = bets.filter(b => b.status === 'pending');
    const settledBets = bets.filter(b => b.status !== 'pending');

    return (
        <section className="bg-brand-bg-light p-6 rounded-lg border border-brand-border shadow-lg">
             <h2 className="text-xl font-bold text-brand-text-primary mb-4">My Bets</h2>
             
             <div className="space-y-3">
                 <h3 className="text-sm font-bold uppercase text-brand-text-secondary tracking-wider">Active Bets ({pendingBets.length})</h3>
                 {pendingBets.length > 0 ? (
                    pendingBets.map(bet => <BetHistoryCard key={bet.id} bet={bet} />)
                 ) : (
                    <p className="text-brand-text-secondary text-sm p-4 text-center bg-brand-bg-dark rounded-md">You have no active bets.</p>
                 )}
             </div>

             <div className="mt-6">
                <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full text-left font-bold text-sm uppercase text-brand-text-secondary tracking-wider hover:text-brand-text-primary"
                >
                    Bet History ({settledBets.length})
                </button>
                 {showHistory && (
                     <div className="mt-3 space-y-3">
                         {settledBets.length > 0 ? (
                            settledBets.map(bet => <BetHistoryCard key={bet.id} bet={bet} />)
                         ) : (
                            <p className="text-brand-text-secondary text-sm p-4 text-center bg-brand-bg-dark rounded-md">No settled bets yet.</p>
                         )}
                    </div>
                 )}
             </div>
        </section>
    );
};
