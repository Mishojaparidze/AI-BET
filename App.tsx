import React, { Suspense, useEffect } from 'react';

import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
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
      <div className="space-y-6 pb-24">
            {/* Live Matches Section */}
            <section>
                <div className="flex items-center justify-between mb-3 px-2">
                    <h2 className="text-lg font-bold text-brand-text-primary">Live Now</h2>
                    <span className="text-xs text-brand-green font-semibold px-2 py-1 bg-brand-green/10 rounded-full">
                        {liveMatches.length} Matches
                    </span>
                </div>
                {liveMatches.length > 0 ? (
                    <div className="flex overflow-x-auto gap-4 pb-4 px-2 snap-x snap-mandatory hide-scrollbar">
                        {liveMatches.map((match, index) => (
                            <div key={match.id} className="snap-center shrink-0 w-[90vw] sm:w-[350px]">
                                <LiveMatchCard match={match} />
                            </div>
                        ))}
                    </div>
                ) : <p className="text-brand-text-secondary px-2">No live matches currently.</p>}
            </section>
            
            <div className="px-2 space-y-6">
                {betOfTheDay && <BetOfTheDayCard prediction={betOfTheDay} />}

                {aiParlay && (
                    <Suspense fallback={<div className="h-48 bg-brand-bg-light rounded-2xl animate-pulse"></div>}>
                        <AiCuratedParlayCard predictions={aiParlay} />
                    </Suspense>
                )}

                <section>
                    <h2 className="text-lg font-bold text-brand-text-primary mb-4">Upcoming</h2>
                    <FilterBar />
                    <div className="space-y-3 mt-4">
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
            </div>
       </div>
  );

  const renderTicketView = () => (
    <div className="space-y-6 pb-24 px-2">
        <h2 className="text-2xl font-bold text-brand-text-primary mb-4">Bet Slip</h2>
        {bankroll && userSettings && <BankrollManager />}
        {ticketSelections.length > 0 && bankroll && userSettings ? (
             <TicketBuilder />
        ) : (
            <div className="p-8 text-center text-brand-text-secondary bg-brand-bg-light rounded-2xl">
                <p>Your ticket is empty.</p>
                <button onClick={() => useStore.getState().setActiveView('matches')} className="mt-4 text-brand-blue font-semibold">Browse Matches</button>
            </div>
        )}
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
          <div className="space-y-6 px-2 pb-24">
             <div className="h-48 w-full bg-brand-bg-light rounded-2xl animate-pulse"></div>
             <div className="space-y-4">
                <MatchCardSkeleton />
                <MatchCardSkeleton />
                <MatchCardSkeleton />
             </div>
          </div>
      );
    }

    if (error) {
      return <div className="px-4 pt-10"><ErrorDisplay message={error} onRetry={fetchInitialData} /></div>;
    }

    // Mobile/Touch Optimized Layout Logic
    // 'ticket' view is treated as a separate screen on mobile
    if (activeView === 'ticket') {
        return renderTicketView();
    }

    if (activeView === 'dashboard') {
        return (
            <div className="px-2 pb-24 space-y-6">
                 {bankroll && userSettings && <BankrollManager />}
                <Suspense fallback={<LoadingSpinner />}><Dashboard /></Suspense>
                <div className="pt-4">
                    <MyBets />
                </div>
            </div>
        );
    }

    if (activeView === 'chat') {
        return (
            <div className="px-2 pb-24 h-[calc(100vh-120px)]">
                 <h1 className="text-2xl font-bold text-brand-text-primary mb-2">AI Analyst</h1>
                 <Suspense fallback={<LoadingSpinner />}>
                    <AiChat />
                </Suspense>
            </div>
        );
    }

    return renderMatchesView();
  };

  return (
    <div className="bg-brand-bg-dark min-h-screen font-sans text-brand-text-primary pb-safe-bottom">
        <Header />
        <NotificationProvider />
        <main className="container mx-auto max-w-xl pt-4">
          {renderContent()}
        </main>
        
        <BottomNavigation />

        <Suspense fallback={<div />}>
            {selectedMatch && <PredictionModal />}
            {selectedLiveMatchForBet && <LiveBetModal />}
            {isSettingsOpen && <SettingsModal />}
            {isConfirmationOpen && <ConfirmationModal />}
        </Suspense>
        
        {/* Hidden on mobile as it's in the dashboard view now, but technically Responsible Gaming should be everywhere. 
            We'll put it at the bottom of the lists in the render functions instead of fixed. */}
    </div>
  );
};

export default App;