import React, { Suspense } from 'react';

import { Header } from './components/Header';
import { BankrollManager } from './components/BankrollManager';
import { MyBets } from './components/MyBets';
import { LiveMatchCard } from './components/LiveMatchCard';
import { FilterBar } from './components/FilterBar';
import { MatchCard } from './components/MatchCard';
import { BetOfTheDayCard } from './components/BetOfTheDayCard';
import { TicketBuilder } from './components/TicketBuilder';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { ResponsibleGamblingBanner } from './components/ResponsibleGamblingBanner';
import { BankrollManagerSkeleton } from './components/skeletons/BankrollManagerSkeleton';
import { MyBetsSkeleton } from './components/skeletons/MyBetsSkeleton';
import { MatchCardSkeleton } from './components/skeletons/MatchCardSkeleton';
import { useAppState } from './hooks/useAppState';

// --- Code Splitting: Lazy load components not needed for the initial render ---
const AiChat = React.lazy(() => import('./components/AiChat').then(module => ({ default: module.AiChat })));
const PredictionModal = React.lazy(() => import('./components/PredictionModal').then(module => ({ default: module.PredictionModal })));
const LiveBetModal = React.lazy(() => import('./components/LiveBetModal').then(module => ({ default: module.LiveBetModal })));
const SettingsModal = React.lazy(() => import('./components/SettingsModal').then(module => ({ default: module.SettingsModal })));


const App: React.FC = () => {
    const {
        isLoading,
        error,
        predictions,
        liveMatches,
        bankroll,
        userBets,
        userSettings,
        selectedMatch,
        setSelectedMatch,
        selectedLiveMatchForBet,
        setSelectedLiveMatchForBet,
        isSettingsOpen,
        setIsSettingsOpen,
        ticketSelections,
        filters,
        setFilters,
        fetchInitialData,
        updateMatchData,
        handleAddToTicket,
        handlePlaceBet,
        handleUpdateSettings,
        handleUpdateBankroll,
        filteredPredictions,
        betOfTheDay,
    } = useAppState();
  
  const renderContent = () => {
    if (isLoading) {
      return (
          <>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                      <h2 className="text-2xl font-bold text-brand-text-primary mb-4">Live Matches</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <MatchCardSkeleton />
                        <MatchCardSkeleton />
                      </div>
                    </section>
                    <section>
                      <h2 className="text-2xl font-bold text-brand-text-primary mb-4">Upcoming Matches</h2>
                      <div className="space-y-4">
                        <MatchCardSkeleton />
                        <MatchCardSkeleton />
                        <MatchCardSkeleton />
                      </div>
                    </section>
                </div>
                 <aside className="space-y-8">
                    <BankrollManagerSkeleton />
                    <MyBetsSkeleton />
                </aside>
             </div>
          </>
      );
    }

    if (error) {
      return <ErrorDisplay message={error} onRetry={fetchInitialData} />;
    }

    return (
       <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <main className="lg:col-span-2 xl:col-span-3 space-y-8">
                <section>
                    <h2 className="text-2xl font-bold text-brand-text-primary mb-4">Live Matches</h2>
                    {liveMatches.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {liveMatches.map((match, index) => (
                                <div key={match.id} className="animate-list-item-enter" style={{ animationDelay: `${index * 100}ms`}}>
                                    <LiveMatchCard match={match} onBetNow={setSelectedLiveMatchForBet} onDetails={setSelectedMatch} onUpdate={updateMatchData} />
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-brand-text-secondary">No live matches currently.</p>}
                </section>
                
                {betOfTheDay && <BetOfTheDayCard prediction={betOfTheDay} onSelect={setSelectedMatch} />}

                <section>
                    <h2 className="text-2xl font-bold text-brand-text-primary mb-4">Upcoming Matches</h2>
                    <FilterBar filters={filters} onFilterChange={setFilters} predictions={predictions} />
                    <div className="space-y-4 mt-4">
                        {filteredPredictions.map((p, index) => (
                            <div key={p.id} className="animate-list-item-enter" style={{ animationDelay: `${index * 50}ms`}}>
                                <MatchCard isSelectedOnTicket={!!ticketSelections.find(s => s.id === p.id)} onAddToTicket={handleAddToTicket} onSelect={setSelectedMatch} prediction={p} />
                            </div>
                        ))}
                    </div>
                </section>

                 <section>
                    <h2 className="text-2xl font-bold text-brand-text-primary mb-4">AI Analyst Chat</h2>
                     <Suspense fallback={<LoadingSpinner />}>
                        <AiChat contextualPredictions={[...liveMatches, ...filteredPredictions]} />
                    </Suspense>
                </section>
            </main>

            <aside className="lg:col-span-1 xl:col-span-1 space-y-8 lg:sticky top-24 self-start">
               {bankroll && userSettings && <BankrollManager bankroll={bankroll} userSettings={userSettings} />}
               <MyBets bets={userBets} />
               {ticketSelections.length > 0 && bankroll && userSettings && (
                   <TicketBuilder selections={ticketSelections} onRemove={handleAddToTicket} onPlaceBet={handlePlaceBet} bankroll={bankroll} userSettings={userSettings} />
               )}
            </aside>
       </div>
    );
  };

  return (
    <div className="bg-brand-bg-dark min-h-screen font-sans text-brand-text-primary">
        <Header onOpenSettings={() => setIsSettingsOpen(true)} />
        <div className="container mx-auto px-4 py-8">
          {renderContent()}
        </div>
        <Suspense fallback={<div />}>
            {selectedMatch && <PredictionModal match={selectedMatch} onClose={() => setSelectedMatch(null)} onAddToTicket={handleAddToTicket} />}
            {selectedLiveMatchForBet && bankroll && <LiveBetModal match={selectedLiveMatchForBet} onClose={() => setSelectedLiveMatchForBet(null)} onPlaceBet={handlePlaceBet} bankroll={bankroll} />}
            {isSettingsOpen && userSettings && bankroll && (
                <SettingsModal 
                    currentSettings={userSettings} 
                    onClose={() => setIsSettingsOpen(false)} 
                    onSave={handleUpdateSettings} 
                    onUpdateBankroll={handleUpdateBankroll}
                    initialBankroll={bankroll.initial}
                />
            )}
        </Suspense>
        <ResponsibleGamblingBanner />
    </div>
  );
};

export default App;