import React, { useState } from 'react';
import { type UserBet } from '../types';
import { BetHistoryCard } from './BetHistoryCard';
import { BetPerformance } from './BetPerformance';

interface MyBetsProps {
    bets: UserBet[];
    onTrackLiveBet: (bet: UserBet) => void;
    liveMatchIds: Set<string>;
}

const ClipboardListIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    </svg>
);

const ChartPieIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
);

export const MyBets: React.FC<MyBetsProps> = ({ bets, onTrackLiveBet, liveMatchIds }) => {
    const [activeView, setActiveView] = useState<'history' | 'performance'>('history');
    
    const settledBets = bets.filter(b => b.status !== 'pending');
    const wins = settledBets.filter(b => b.status === 'won').length;
    const losses = settledBets.filter(b => b.status === 'lost').length;

    return (
        <section className="mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <div className="flex items-center">
                    <ClipboardListIcon className="w-7 h-7 text-brand-green mr-3" />
                    <h2 className="text-3xl font-bold text-brand-text-primary">My Bets</h2>
                </div>
                 <div className="flex items-center bg-brand-bg-dark p-1 rounded-lg border border-brand-border">
                    <button onClick={() => setActiveView('history')} className={`flex items-center gap-2 px-3 py-1 text-sm font-bold rounded-md transition-colors ${activeView === 'history' ? 'bg-brand-green text-brand-bg-dark' : 'text-brand-text-secondary hover:bg-brand-border'}`}>
                        <ClipboardListIcon className="w-4 h-4" />
                        History
                    </button>
                    <button onClick={() => setActiveView('performance')} className={`flex items-center gap-2 px-3 py-1 text-sm font-bold rounded-md transition-colors ${activeView === 'performance' ? 'bg-brand-green text-brand-bg-dark' : 'text-brand-text-secondary hover:bg-brand-border'}`}>
                        <ChartPieIcon className="w-4 h-4" />
                        Performance
                    </button>
                </div>
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

                {activeView === 'history' && (
                    bets.length > 0 ? (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 animate-fade-in">
                            {bets.map(bet => (
                                <BetHistoryCard 
                                    key={bet.id} 
                                    bet={bet}
                                    onTrackLiveBet={onTrackLiveBet}
                                    isLive={liveMatchIds.has(bet.match.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-brand-text-secondary py-8">
                            You haven't placed any bets yet. Find a prediction below to get started!
                        </p>
                    )
                )}

                {activeView === 'performance' && <BetPerformance bets={bets} />}
            </div>
        </section>
    );
};