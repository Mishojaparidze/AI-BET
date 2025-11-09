import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  type MatchPrediction, type LiveMatchPrediction,
  type FilterState, ConfidenceTier, type TicketSelection
} from '../types';
import * as api from '../services/apiService';
import * as feed from '../services/websocketService';
import { useBankroll } from './useBankroll';
import { useBets } from './useBets';


export const useAppState = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [predictions, setPredictions] = useState<MatchPrediction[]>([]);
    const [liveMatches, setLiveMatches] = useState<LiveMatchPrediction[]>([]);
    
    const { bankroll, userSettings, setBankroll, setUserSettings, handleUpdateBankroll, handleUpdateSettings } = useBankroll();
    const { userBets, setUserBets, handlePlaceBet: placeBetHandler } = useBets(setBankroll);
    
    const [selectedMatch, setSelectedMatch] = useState<MatchPrediction | LiveMatchPrediction | null>(null);
    const [selectedLiveMatchForBet, setSelectedLiveMatchForBet] = useState<LiveMatchPrediction | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    const [ticketSelections, setTicketSelections] = useState<TicketSelection[]>([]);

    const [filters, setFilters] = useState<FilterState>({
        sport: 'All',
        league: 'All',
        marketType: 'All',
        confidence: 'All',
        sortBy: 'matchDate',
    });

    const fetchInitialData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.fetchInitialData();
            setPredictions(data.predictions);
            setLiveMatches(data.liveMatches);
            setBankroll(data.bankroll);
            setUserBets(data.userBets);
            setUserSettings(data.userSettings);
            feed.initializeFeed([...data.predictions, ...data.liveMatches]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [setBankroll, setUserBets, setUserSettings]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const updateMatchData = useCallback((updatedMatch: MatchPrediction | LiveMatchPrediction) => {
        if ('liveOdds' in updatedMatch) {
            setLiveMatches(prev => prev.map(m => m.id === updatedMatch.id ? updatedMatch : m));
        } else {
            setPredictions(prev => prev.map(p => p.id === updatedMatch.id ? p : updatedMatch));
        }
    }, []);
    
    useEffect(() => {
        const interval = setInterval(async () => {
            const pendingBet = userBets.find(b => b.status === 'pending');
            if (pendingBet) {
                try {
                    const { updatedBankroll, settledBet } = await api.settleBet(pendingBet.id);
                    setBankroll(updatedBankroll);
                    setUserBets(prev => prev.map(b => b.id === settledBet.id ? settledBet : b));
                } catch (e) {
                    console.error("Failed to settle bet:", e);
                }
            }
        }, 15000);
        return () => clearInterval(interval);
    }, [userBets, setBankroll, setUserBets]);
    
    const handleAddToTicket = (prediction: TicketSelection) => {
        setTicketSelections(prev => {
            if (prev.find(p => p.id === prediction.id)) {
                return prev.filter(p => p.id !== prediction.id);
            }
            return [...prev, prediction];
        });
    };
    
    const handlePlaceBet = useCallback(async (bet) => {
        const success = await placeBetHandler(bet);
        if (success) {
            setTicketSelections([]); // Clear ticket only on successful bet
        }
        return success;
    }, [placeBetHandler]);


    const filteredPredictions = useMemo(() => {
        return predictions
            .filter(p => filters.sport === 'All' || p.sport === filters.sport)
            .filter(p => filters.league === 'All' || p.league === filters.league)
            .filter(p => filters.marketType === 'All' || p.marketType === filters.marketType)
            .filter(p => filters.confidence === 'All' || p.confidence === filters.confidence)
            .sort((a, b) => {
                switch (filters.sortBy) {
                    case 'highestOdds': return b.odds - a.odds;
                    case 'highestEV': return b.aiAnalysis.expectedValue - a.aiAnalysis.expectedValue;
                    case 'matchDate':
                    default:
                        return new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime();
                }
            });
    }, [predictions, filters]);

    const betOfTheDay = useMemo(() => {
        if (predictions.length === 0) return null;
        return [...predictions]
            .filter(p => p.confidence === ConfidenceTier.High && p.aiAnalysis.expectedValue > 5)
            .sort((a, b) => b.aiAnalysis.kellyStakePercentage - a.aiAnalysis.kellyStakePercentage)[0] || predictions[0];
    }, [predictions]);

    return {
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
        handleAddToTicket,
        handlePlaceBet,
        handleUpdateSettings: (settings) => handleUpdateSettings(settings, () => setIsSettingsOpen(false)),
        handleUpdateBankroll,
        filters,
        setFilters,
        fetchInitialData,
        updateMatchData,
        filteredPredictions,
        betOfTheDay,
    };
};