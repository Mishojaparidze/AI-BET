import React, { useState } from 'react';
import { BetHistoryCard } from './BetHistoryCard';
import { useStore } from '../store/useStore';

export const MyBets: React.FC = () => {
    const bets = useStore(state => state.userBets);
    const [activeTab, setActiveTab] = useState<'active' | 'settled'>('active');

    const pendingBets = bets.filter(b => b.status === 'pending');
    const settledBets = bets.filter(b => b.status !== 'pending').sort((a,b) => b.placedAt.getTime() - a.placedAt.getTime());

    const renderContent = () => {
        const betsToDisplay = activeTab === 'active' ? pendingBets : settledBets;
        const emptyMessage = activeTab === 'active' 
            ? "You have no active bets." 
            : "No settled bets yet.";

        if (betsToDisplay.length === 0) {
            return <p className="text-brand-text-secondary text-sm p-4 text-center bg-brand-bg-dark rounded-md">{emptyMessage}</p>
        }

        return (
            <div className="space-y-3">
                {betsToDisplay.map(bet => <BetHistoryCard key={bet.id} bet={bet} />)}
            </div>
        )
    };
    
    return (
        <section className="bg-brand-bg-light p-6 rounded-lg border border-brand-border shadow-lg">
             <h2 className="text-xl font-bold text-brand-text-primary mb-4">My Bets</h2>
             
             <div className="mb-4 flex border-b border-brand-border">
                <button 
                    onClick={() => setActiveTab('active')} 
                    className={`flex-1 pb-2 text-sm font-bold text-center border-b-2 transition-colors ${
                        activeTab === 'active' 
                        ? 'border-brand-green text-brand-text-primary' 
                        : 'border-transparent text-brand-text-secondary hover:border-brand-border'
                    }`}
                >
                    Active ({pendingBets.length})
                </button>
                <button 
                    onClick={() => setActiveTab('settled')}
                    className={`flex-1 pb-2 text-sm font-bold text-center border-b-2 transition-colors ${
                        activeTab === 'settled' 
                        ? 'border-brand-green text-brand-text-primary' 
                        : 'border-transparent text-brand-text-secondary hover:border-brand-border'
                    }`}
                >
                    History ({settledBets.length})
                </button>
             </div>
             
             <div className="max-h-[400px] overflow-y-auto pr-2">
                {renderContent()}
             </div>
        </section>
    );
};