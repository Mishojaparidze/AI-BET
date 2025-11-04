import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { MatchCard } from './components/MatchCard';
import { LiveMatchCard } from './components/LiveMatchCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { BankrollManager } from './components/BankrollManager';
import { PredictionModal } from './components/PredictionModal';
import { MyBets } from './components/MyBets';
import { TicketBuilder } from './components/TicketBuilder';
import { FilterBar } from './components/FilterBar';
import { AiChat } from './components/AiChat';
import * as apiService from './services/apiService';
import { type MatchPrediction, type LiveMatchPrediction, type BankrollState, type UserBet, type TicketSelection, type FilterState, ConfidenceTier } from './types';

const App: React.FC = () => {
    const [predictions, setPredictions] = useState<MatchPrediction[]>([]);
    const [filteredPredictions, setFilteredPredictions] = useState<MatchPrediction[]>([]);
    const [livePredictions, setLivePredictions] = useState<LiveMatchPrediction[]>([]);
    const [bankroll, setBankroll] = useState<BankrollState | null>(null);
    const [userBets, setUserBets] = useState<UserBet[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPrediction, setSelectedPrediction] = useState<MatchPrediction | null>(null);
    const [ticketSelections, setTicketSelections] = useState<TicketSelection[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        league: 'All',
        confidence: 'All',
        sortBy: 'matchDate',
    });


    // Fetch initial data from the new API service
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await apiService.fetchInitialData();
                setPredictions(data.predictions);
                setFilteredPredictions(data.predictions); // Initially, show all
                setLivePredictions(data.liveMatches);
                setBankroll(data.bankroll);
                setUserBets(data.userBets);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred while fetching data.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);
    
    // Apply filters and sorting whenever predictions or filters change
    useEffect(() => {
        let processedPredictions = [...predictions];

        // Filter by league
        if (filters.league !== 'All') {
            processedPredictions = processedPredictions.filter(p => p.league === filters.league);
        }

        // Filter by confidence
        if (filters.confidence !== 'All') {
            processedPredictions = processedPredictions.filter(p => p.confidence === filters.confidence);
        }

        // Sort results
        switch (filters.sortBy) {
            case 'highestOdds':
                processedPredictions.sort((a, b) => b.odds - a.odds);
                break;
            case 'highestEV':
                processedPredictions.sort((a, b) => b.aiAnalysis.expectedValue - a.aiAnalysis.expectedValue);
                break;
            case 'matchDate':
            default:
                // Assuming date strings are comparable, for mock data this is fine
                processedPredictions.sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());
                break;
        }
        
        setFilteredPredictions(processedPredictions);

    }, [predictions, filters]);

    const handleSetInitialBankroll = useCallback(async (amount: number) => {
        try {
            const { updatedBankroll, clearedBets } = await apiService.updateInitialBankroll(amount);
            setBankroll(updatedBankroll);
            setUserBets(clearedBets);
            setTicketSelections([]);
        } catch (err) {
            setError("Failed to update bankroll.");
        }
    }, []);

    const handlePlaceBet = useCallback(async (prediction: MatchPrediction, stake: number, selections?: MatchPrediction[]) => {
        if (!bankroll || bankroll.current < stake) {
            alert("Insufficient funds to place this bet.");
            return;
        }
        try {
            const { updatedBankroll, newBet } = await apiService.placeBet(prediction, stake, selections);
            setBankroll(updatedBankroll);
            setUserBets(prevBets => [newBet, ...prevBets]);
            setSelectedPrediction(null); // Close modal after placing bet
            setTicketSelections([]); // Clear ticket after placing bet
        } catch (err) {
             setError("Failed to place bet.");
        }
    }, [bankroll]);
    
    // Simulate settling of pending bets
    useEffect(() => {
        const settleBets = async () => {
            const pendingBets = userBets.filter(b => b.status === 'pending');
            if (pendingBets.length === 0) return;

            // Settle one bet at a time to simulate realism
            const betToSettle = pendingBets[pendingBets.length - 1];

            try {
                const { updatedBankroll, settledBet } = await apiService.settleBet(betToSettle.id);
                
                setBankroll(updatedBankroll);
                setUserBets(prevBets => 
                    prevBets.map(b => b.id === settledBet.id ? settledBet : b)
                );
            } catch (err) {
                console.error("Failed to settle bet:", err);
            }
        };

        const intervalId = setInterval(settleBets, 5000); // Check to settle a bet every 5 seconds
        return () => clearInterval(intervalId);
    }, [userBets]);


    const handleViewAnalysis = (prediction: MatchPrediction) => {
        setSelectedPrediction(prediction);
    };
    
    const handleCloseModal = () => {
        setSelectedPrediction(null);
    };

    const handleAddToTicket = (prediction: TicketSelection) => {
        // Prevent adding the same match prediction twice
        if (!ticketSelections.some(s => s.teamA === prediction.teamA && s.teamB === prediction.teamB)) {
             setTicketSelections(prev => [...prev, prediction]);
        }
    };
    
    const handleRemoveFromTicket = (prediction: TicketSelection) => {
        setTicketSelections(prev => prev.filter(s => s.teamA !== prediction.teamA || s.teamB !== prediction.teamB));
    };

    const handleClearTicket = () => {
        setTicketSelections([]);
    };

    const uniqueLeagues = useMemo(() => {
        const leagues = new Set(predictions.map(p => p.league));
        return ['All', ...Array.from(leagues)];
    }, [predictions]);

    return (
        <div className="bg-brand-bg-dark min-h-screen font-sans text-brand-text-primary">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <BankrollManager bankroll={bankroll} onSetInitialBankroll={handleSetInitialBankroll} />

                {isLoading && <LoadingSpinner />}
                {error && <ErrorDisplay message={error} />}

                {!isLoading && !error && (
                    <>
                        {userBets.length > 0 && <MyBets bets={userBets} />}

                        {livePredictions.length > 0 && (
                             <section className="mb-12">
                                <h2 className="text-3xl font-bold mb-6 text-brand-text-primary border-l-4 border-brand-green pl-4">Live Analysis</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {livePredictions.map(p => <LiveMatchCard key={p.id} initialPrediction={p} />)}
                                </div>
                            </section>
                        )}
                       
                        {predictions.length > 0 && bankroll && (
                             <section>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                                    <h2 className="text-3xl font-bold text-brand-text-primary border-l-4 border-brand-green pl-4 mb-4 md:mb-0">
                                        Pre-Match AI Advisor
                                    </h2>
                                    <FilterBar
                                        leagues={uniqueLeagues}
                                        filters={filters}
                                        onFilterChange={setFilters}
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredPredictions.map((p, i) => (
                                        <MatchCard 
                                            key={`${p.teamA}-${p.teamB}-${i}`}
                                            prediction={p} 
                                            onViewAnalysis={() => handleViewAnalysis(p)}
                                            onAddToTicket={() => handleAddToTicket(p)}
                                            isTicketed={ticketSelections.some(s => s.teamA === p.teamA && s.teamB === p.teamB)}
                                        />
                                    ))}
                                </div>
                                {filteredPredictions.length === 0 && (
                                    <div className="text-center py-16 bg-brand-bg-light rounded-lg">
                                        <p className="text-xl font-semibold text-brand-text-primary">No Predictions Found</p>
                                        <p className="text-brand-text-secondary mt-2">Try adjusting your filters to find more matches.</p>
                                    </div>
                                )}
                            </section>
                        )}
                    </>
                )}
            </main>
            
            {selectedPrediction && bankroll && (
                <PredictionModal 
                    prediction={selectedPrediction} 
                    onClose={handleCloseModal}
                    onPlaceBet={(prediction, stake) => handlePlaceBet(prediction, stake)}
                    bankroll={bankroll.current}
                />
            )}

            {bankroll && (
                 <TicketBuilder 
                    selections={ticketSelections}
                    onRemove={handleRemoveFromTicket}
                    onClear={handleClearTicket}
                    onPlaceBet={handlePlaceBet}
                    bankroll={bankroll.current}
                 />
            )}

            <AiChat predictions={filteredPredictions} />
        </div>
    );
};

export default App;
