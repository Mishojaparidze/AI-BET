import React, { Suspense, useEffect } from 'react';

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
import { NotificationProvider } from './components/NotificationProvider';
import { useStore } from './store/useStore';

// --- Code Splitting: Lazy load components not needed for the initial render ---
const AiChat = React.lazy(() => import('./components/AiChat').then(module => ({ default: module.AiChat })));
const PredictionModal = React.lazy(() => import('./components/PredictionModal').then(module => ({ default: module.PredictionModal })));
const LiveBetModal = React.lazy(() => import('./components/LiveBetModal').then(module => ({ default: module.LiveBetModal })));
const SettingsModal = React.lazy(() => import('./components/SettingsModal').then(module => ({ default: module.SettingsModal })));
const ConfirmationModal = React.lazy(() => import('./components/ConfirmationModal').then(module => ({ default: module.ConfirmationModal })));
const AiCuratedParlayCard = React.lazy(() => import('./components/AiCuratedParlayCard').then(module => ({ default: module.AiCuratedParlayCard })));
const Dashboard = React.lazy(() => import('./components/Dashboard').then(module => ({ default: module.Dashboard })));


const App: React.FC = () => {
    // Selectors for state that triggers re-renders
    const isLoading = useStore(state => state.isLoading);
    const error = useStore(state => state.error);
    const liveMatches = useStore(state => state.liveMatches);
    const ticketSelections = useStore(state => state.ticketSelections);
    const bankroll = useStore(state => state.bankroll);
    const userSettings = useStore(state => state.userSettings);

    // Modal state selectors
    const selectedMatch = useStore(state => state.selectedMatch);
    const selectedLiveMatchForBet = useStore(state => state.selectedLiveMatchForBet);
    const isSettingsOpen = useStore(state => state.isSettingsOpen);
    const isConfirmationOpen = useStore(state => !!state.confirmationModal);
    
    // Selectors for computed state
    const filteredPredictions = useStore(state => state.getFilteredPredictions());
    const betOfTheDay = useStore(state => state.getBetOfTheDay());
    const aiParlay = useStore(state => state.getAiCuratedParlay());
    
    // Selectors for actions and view state
    const fetchInitialData = useStore(state => state.fetchInitialData);
    const activeView = useStore(state => state.activeView);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);
  
  const renderMatchesView = () => (
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <main className="lg:col-span-2 xl:col-span-3 space-y-6">
                <section>
                    <h2 className="text-2xl font-bold text-brand-text-primary mb-4">Live Matches</h2>
                    {liveMatches.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {liveMatches.map((match, index) => (
                                <div key={match.id} className="animate-list-item-enter" style={{ animationDelay: `${index * 100}ms`}}>
                                    <LiveMatchCard match={match} />
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-brand-text-secondary">No live matches currently.</p>}
                </section>
                
                {betOfTheDay && <BetOfTheDayCard prediction={betOfTheDay} />}

                {aiParlay && (
                    <Suspense fallback={<div className="h-48 bg-brand-bg-light rounded-lg animate-pulse"></div>}>
                        <AiCuratedParlayCard predictions={aiParlay} />
                    </Suspense>
                )}

                <section>
                    <h2 className="text-2xl font-bold text-brand-text-primary mb-4">Upcoming Matches</h2>
                    <FilterBar />
                    <div className="space-y-4 mt-4">
                        {filteredPredictions.map((p, index) => {
                            const isSelected = ticketSelections.some(s => s.id === p.id);
                            return (
                                <div key={p.id} className="animate-list-item-enter" style={{ animationDelay: `${index * 50}ms`}}>
                                    <MatchCard prediction={p} isSelected={isSelected} />
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>

            <aside className="lg:col-span-1 xl:col-span-1 space-y-6 lg:sticky top-24 self-start">
               {bankroll && userSettings && <BankrollManager />}
               <MyBets />
               {ticketSelections.length > 0 && bankroll && userSettings && <TicketBuilder />}
            </aside>
       </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
          <>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
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
                 <aside className="space-y-6">
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

    switch (activeView) {
        case 'matches':
            return renderMatchesView();
        case 'dashboard':
            return <Suspense fallback={<LoadingSpinner />}><Dashboard /></Suspense>;
        case 'chat':
            return (
                <section>
                    <h1 className="text-3xl font-bold text-brand-text-primary mb-2">AI Analyst Chat</h1>
                    <p className="text-brand-text-secondary mb-6">Ask me anything about today's matches, or for betting strategies and insights.</p>
                    <Suspense fallback={<LoadingSpinner />}>
                        <AiChat />
                    </Suspense>
                </section>
            );
        default:
            return renderMatchesView();
    }
  };

  return (
    <div className="bg-brand-bg-dark min-h-screen font-sans text-brand-text-primary">
        <Header />
        <NotificationProvider />
        <div className="container mx-auto px-4 py-8">
          {renderContent()}
        </div>
        <Suspense fallback={<div />}>
            {selectedMatch && <PredictionModal />}
            {selectedLiveMatchForBet && <LiveBetModal />}
            {isSettingsOpen && <SettingsModal />}
            {isConfirmationOpen && <ConfirmationModal />}
        </Suspense>
        <ResponsibleGamblingBanner />
    </div>
  );
};

export default App;