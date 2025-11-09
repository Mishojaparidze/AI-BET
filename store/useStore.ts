import { create } from 'zustand';
import {
  type MatchPrediction, type LiveMatchPrediction, type FilterState, ConfidenceTier, type TicketSelection, type BankrollState, type UserSettings, type UserBet, type TicketVariation, MarketType, type Notification
} from '../types';
import * as api from '../services/apiService';
import * as feed from '../services/websocketService';

type RiskProfile = 'Conservative' | 'Balanced' | 'Aggressive';
type ActiveView = 'matches' | 'dashboard' | 'chat';

interface ConfirmationModalState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
}

export interface DashboardFilterState {
    dateRange: '7d' | '30d' | 'all';
    sport: string;
    marketType: string;
    status: 'all' | 'won' | 'lost';
    sortBy: 'placedAt_desc' | 'placedAt_asc' | 'pnl_desc' | 'pnl_asc' | 'odds_desc' | 'odds_asc';
}

export interface PerformanceKpis {
    totalProfitLoss: number;
    roi: number;
    winRate: number;
    totalBets: number;
    totalWagered: number;
    avgOdds: number;
    wins: number;
    losses: number;
}


interface AppState {
    // State
    isLoading: boolean;
    error: string | null;
    predictions: MatchPrediction[];
    liveMatches: LiveMatchPrediction[];
    bankroll: BankrollState | null;
    userBets: UserBet[];
    userSettings: UserSettings | null;
    selectedMatch: MatchPrediction | LiveMatchPrediction | null;
    selectedLiveMatchForBet: LiveMatchPrediction | null;
    isSettingsOpen: boolean;
    ticketSelections: TicketSelection[];
    ticketVariations: TicketVariation[] | null;
    isGeneratingTickets: boolean;
    ticketRiskProfile: RiskProfile;
    filters: FilterState;
    confirmationModal: ConfirmationModalState | null;
    activeView: ActiveView;
    dashboardFilters: DashboardFilterState;
    notifications: Notification[];

    // Computed State (Selectors are now methods)
    getFilteredPredictions: () => MatchPrediction[];
    getBetOfTheDay: () => MatchPrediction | null;
    getAiCuratedParlay: () => MatchPrediction[] | null;
    getBankrollHistory: () => { date: Date, bankroll: number }[];
    getMarketsForMatch: (matchId: string) => MatchPrediction[];
    getFilteredSettledBets: () => UserBet[];
    getDashboardKpis: () => PerformanceKpis;
    getOverallPerformanceKpis: () => PerformanceKpis;
    getProfitBySport: () => { sport: string; profit: number }[];


    // Actions
    fetchInitialData: () => Promise<void>;
    updateMatchData: (updatedMatch: MatchPrediction | LiveMatchPrediction) => void;
    handleAddToTicket: (prediction: TicketSelection) => void;
    addAllToTicket: (predictions: TicketSelection[]) => void;
    placeBet: (bet: Omit<UserBet, 'id' | 'placedAt' | 'payout' | 'status'>) => Promise<boolean>;
    placeVariationBet: (variation: TicketVariation) => Promise<boolean>;
    updateSettings: (settings: UserSettings) => Promise<void>;
    updateBankroll: (newInitial: number) => Promise<void>;
    settlePendingBet: () => Promise<void>;
    generateTicketVariations: (totalStake: number) => Promise<void>;
    showConfirmation: (title: string, message: string, onConfirm: () => void) => void;
    hideConfirmation: () => void;
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
    
    // Simple state setters
    setFilters: (filters: FilterState) => void;
    setSelectedMatch: (match: MatchPrediction | LiveMatchPrediction | null) => void;
    setSelectedLiveMatchForBet: (match: LiveMatchPrediction | null) => void;
    setIsSettingsOpen: (isOpen: boolean) => void;
    setTicketRiskProfile: (profile: RiskProfile) => void;
    clearTicketVariations: () => void;
    setActiveView: (view: ActiveView) => void;
    setDashboardFilters: (filters: DashboardFilterState) => void;
}

// Keep the settle interval outside the store to avoid re-creation on every render
let settleInterval: number | null = null;

const calculateKpis = (bets: UserBet[]): PerformanceKpis => {
    const totalBets = bets.length;
    if (totalBets === 0) {
        return { totalProfitLoss: 0, roi: 0, winRate: 0, totalBets: 0, totalWagered: 0, avgOdds: 0, wins: 0, losses: 0 };
    }
    const wins = bets.filter(b => b.status === 'won').length;
    const losses = totalBets - wins;
    const totalWagered = bets.reduce((acc, b) => acc + b.stake, 0);
    const totalReturned = bets.reduce((acc, b) => acc + (b.payout ?? 0), 0);
    const totalProfitLoss = totalReturned - totalWagered;
    const roi = totalWagered > 0 ? (totalProfitLoss / totalWagered) * 100 : 0;
    const winRate = totalBets > 0 ? (wins / totalBets) * 100 : 0;
    const avgOdds = bets.reduce((acc, b) => acc + b.odds, 0) / totalBets;

    return { totalProfitLoss, roi, winRate, totalBets, totalWagered, avgOdds, wins, losses };
};


export const useStore = create<AppState>((set, get) => ({
    // --- STATE ---
    isLoading: true,
    error: null,
    predictions: [],
    liveMatches: [],
    bankroll: null,
    userBets: [],
    userSettings: null,
    selectedMatch: null,
    selectedLiveMatchForBet: null,
    isSettingsOpen: false,
    ticketSelections: [],
    ticketVariations: null,
    isGeneratingTickets: false,
    ticketRiskProfile: 'Balanced',
    filters: {
        sport: 'All',
        league: 'All',
        marketType: 'All',
        confidence: 'All',
        sortBy: 'matchDate',
        searchTerm: '',
    },
    confirmationModal: null,
    activeView: 'matches',
    dashboardFilters: {
        dateRange: 'all',
        sport: 'All',
        marketType: 'All',
        status: 'all',
        sortBy: 'placedAt_desc',
    },
    notifications: [],

    // --- COMPUTED STATE (SELECTORS) ---
    getFilteredPredictions: () => {
        const { predictions, filters } = get();
        const searchTerm = filters.searchTerm.toLowerCase();

        // 1. Find all matchIds that have at least one prediction satisfying the filters.
        const matchingMatchIds = new Set(
            predictions
                .filter(p => {
                    const sportMatch = filters.sport === 'All' || p.sport === filters.sport;
                    const leagueMatch = filters.league === 'All' || p.league === filters.league;
                    const marketMatch = filters.marketType === 'All' || p.marketType === filters.marketType;
                    const confidenceMatch = filters.confidence === 'All' || p.confidence === filters.confidence;
                    const searchMatch = !searchTerm || p.teamA.toLowerCase().includes(searchTerm) || p.teamB.toLowerCase().includes(searchTerm);
                    return sportMatch && leagueMatch && marketMatch && confidenceMatch && searchMatch;
                })
                .map(p => p.matchId)
        );

        // 2. Create the final list for display. For each matching matchId, pick the first
        //    available prediction. This maintains the "one card per match" UI.
        const displayedMatchIds = new Set<string>();
        const uniquePredictions: MatchPrediction[] = [];
        for (const p of predictions) {
            if (matchingMatchIds.has(p.matchId) && !displayedMatchIds.has(p.matchId)) {
                uniquePredictions.push(p);
                displayedMatchIds.add(p.matchId);
            }
        }

        // 3. Sort the final list
        return uniquePredictions.sort((a, b) => {
            switch (filters.sortBy) {
                case 'highestOdds':
                    return b.odds - a.odds;
                case 'lowestOdds':
                    return a.odds - b.odds;
                case 'highestEV':
                    return b.aiAnalysis.expectedValue - a.aiAnalysis.expectedValue;
                case 'highestConfidence': {
                    const confidenceOrder = { [ConfidenceTier.High]: 3, [ConfidenceTier.Medium]: 2, [ConfidenceTier.Low]: 1 };
                    return confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
                }
                case 'matchDate':
                default:
                    return new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime();
            }
        });
    },
    getBetOfTheDay: () => {
        const { predictions } = get();
        if (predictions.length === 0) return null;
        return [...predictions]
            .filter(p => p.confidence === ConfidenceTier.High && p.aiAnalysis.expectedValue > 5)
            .sort((a, b) => b.aiAnalysis.kellyStakePercentage - a.aiAnalysis.kellyStakePercentage)[0] || predictions[0];
    },
    getAiCuratedParlay: () => {
        const { predictions } = get();
        if (predictions.length < 3) return null;
        const candidates = [...predictions]
            .filter(p => p.confidence === ConfidenceTier.High && p.aiAnalysis.expectedValue > 2)
            .sort((a,b) => b.aiAnalysis.expectedValue - a.aiAnalysis.expectedValue);
        
        const uniqueMatchCandidates = [];
        const seenMatchIds = new Set();
        for (const p of candidates) {
            if (!seenMatchIds.has(p.matchId)) {
                uniqueMatchCandidates.push(p);
                seenMatchIds.add(p.matchId);
            }
        }
        
        return uniqueMatchCandidates.length >= 3 ? uniqueMatchCandidates.slice(0, 3) : null;
    },
    getBankrollHistory: () => {
        const { bankroll, userBets } = get();
        if (!bankroll) return [];

        const history: { date: Date; bankroll: number }[] = [];
        
        const settledBets = userBets
            .filter(b => b.status !== 'pending')
            .sort((a, b) => new Date(a.placedAt).getTime() - new Date(b.placedAt).getTime());

        // Find the earliest date to start the chart from
        const firstBetTime = settledBets.length > 0 ? new Date(settledBets[0].placedAt).getTime() : Date.now();
        const chartStartTime = new Date(firstBetTime - (24 * 60 * 60 * 1000)); // 1 day before first bet

        history.push({ date: chartStartTime, bankroll: bankroll.initial });
        
        let cumulativeBankroll = bankroll.initial;
        settledBets.forEach(bet => {
            const pnl = (bet.payout ?? 0) - bet.stake;
            cumulativeBankroll += pnl;
            history.push({ date: new Date(bet.placedAt), bankroll: cumulativeBankroll });
        });
        
        // Add the current bankroll state as the final point, unless it's already captured.
        if (history.length === 0 || history[history.length - 1].bankroll !== bankroll.current) {
            history.push({ date: new Date(), bankroll: bankroll.current });
        }
        
        // Ensure there are at least two points for a line to be drawn
        if (history.length < 2) {
             history.push({ date: new Date(), bankroll: bankroll.current });
        }

        return history;
    },
    getMarketsForMatch: (matchId) => {
        const { predictions, liveMatches } = get();
        const allPredictions = [...predictions, ...liveMatches];
        return allPredictions.filter(p => p.matchId === matchId);
    },
    getFilteredSettledBets: () => {
        const { userBets, dashboardFilters } = get();
        const settled = userBets.filter(b => b.status === 'won' || b.status === 'lost');

        const now = new Date();
        const dateLimit = new Date();
        if (dashboardFilters.dateRange === '7d') {
            dateLimit.setDate(now.getDate() - 7);
        } else if (dashboardFilters.dateRange === '30d') {
            dateLimit.setDate(now.getDate() - 30);
        }
        
        const filtered = settled
            .filter(b => dashboardFilters.dateRange === 'all' || new Date(b.placedAt) >= dateLimit)
            .filter(b => dashboardFilters.sport === 'All' || b.match.sport === dashboardFilters.sport)
            .filter(b => dashboardFilters.marketType === 'All' || b.match.marketType === dashboardFilters.marketType)
            .filter(b => dashboardFilters.status === 'all' || b.status === dashboardFilters.status);

        return filtered.sort((a, b) => {
            switch (dashboardFilters.sortBy) {
                case 'placedAt_asc':
                    return new Date(a.placedAt).getTime() - new Date(b.placedAt).getTime();
                case 'pnl_desc': {
                    const pnlA = (a.payout ?? 0) - a.stake;
                    const pnlB = (b.payout ?? 0) - b.stake;
                    return pnlB - pnlA;
                }
                case 'pnl_asc': {
                    const pnlA = (a.payout ?? 0) - a.stake;
                    const pnlB = (b.payout ?? 0) - b.stake;
                    return pnlA - pnlB;
                }
                case 'odds_desc':
                    return b.odds - a.odds;
                case 'odds_asc':
                    return a.odds - b.odds;
                case 'placedAt_desc':
                default:
                    return new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime();
            }
        });
    },
    getDashboardKpis: () => {
        const filteredBets = get().getFilteredSettledBets();
        return calculateKpis(filteredBets);
    },
    getOverallPerformanceKpis: () => {
        const allSettledBets = get().userBets.filter(b => b.status === 'won' || b.status === 'lost');
        return calculateKpis(allSettledBets);
    },
    getProfitBySport: () => {
        const filteredBets = get().getFilteredSettledBets();
        const profitMap: Record<string, number> = {};
        
        filteredBets.forEach(bet => {
            const sport = bet.match.sport;
            const pnl = (bet.payout ?? 0) - bet.stake;
            if (!profitMap[sport]) {
                profitMap[sport] = 0;
            }
            profitMap[sport] += pnl;
        });

        return Object.entries(profitMap)
            .map(([sport, profit]) => ({ sport, profit }))
            .sort((a,b) => b.profit - a.profit);
    },

    // --- ACTIONS ---
    fetchInitialData: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.fetchInitialData();
            set({
                predictions: data.predictions,
                liveMatches: data.liveMatches,
                bankroll: data.bankroll,
                userBets: data.userBets,
                userSettings: data.userSettings,
            });
            feed.initializeFeed([...data.predictions, ...data.liveMatches]);
            
            if (settleInterval) window.clearInterval(settleInterval);
            settleInterval = window.setInterval(() => get().settlePendingBet(), 15000);

        } catch (err) {
            set({ error: err instanceof Error ? err.message : "An unknown error occurred." });
        } finally {
            set({ isLoading: false });
        }
    },
    updateMatchData: (updatedMatch) => {
        if ('liveOdds' in updatedMatch) {
            set(state => ({ liveMatches: state.liveMatches.map(m => m.id === updatedMatch.id ? updatedMatch as LiveMatchPrediction : m) }));
        } else {
            set(state => ({ predictions: state.predictions.map(p => p.id === updatedMatch.id ? updatedMatch as MatchPrediction : p) }));
        }
    },
    handleAddToTicket: (prediction) => {
        set(state => {
            const { ticketSelections } = state;
            const isSelected = ticketSelections.some(p => p.id === prediction.id);

            if (isSelected) {
                // Remove logic
                return { 
                    ticketSelections: ticketSelections.filter(p => p.id !== prediction.id),
                    ticketVariations: null // Clear variations if selections change
                };
            }

            // Add logic with SGP rule fix
            if (ticketSelections.length > 0) {
                const firstMatchId = ticketSelections[0].matchId;
                // An SGP is defined as a ticket where ALL selections share the same matchId.
                const isTicketAnSGP = ticketSelections.every(s => s.matchId === firstMatchId);
                
                // If the current ticket is an SGP, and the new prediction is from a different match...
                if (isTicketAnSGP && prediction.matchId !== firstMatchId) {
                     // ...clear the SGP and start a new ticket with the new selection.
                     get().addNotification({
                        type: 'info',
                        title: 'Ticket Updated',
                        message: 'Started a new bet, clearing the previous Same Game Parlay.'
                     });
                     return {
                        ticketSelections: [prediction],
                        ticketVariations: null
                     }
                }
            }

            // Default case: just add the prediction.
            // This now correctly handles:
            // - Adding to an empty ticket.
            // - Adding another leg to an SGP (prediction.matchId will be the same).
            // - Adding another leg to a multi-match parlay (isTicketAnSGP will be false).
            return { 
                ticketSelections: [...ticketSelections, prediction],
                ticketVariations: null 
            };
        });
    },
    addAllToTicket: (predictionsToAdd) => {
        set(state => {
            // When adding a curated parlay, it should clear the existing ticket.
            return {
                ticketSelections: predictionsToAdd,
                ticketVariations: null 
            };
        });
    },
    placeBet: async (bet) => {
        const { addNotification } = get();
        try {
            const { updatedBankroll, newBet } = await api.placeBet(bet.match, bet.stake, bet.selections);
            set(state => ({
                bankroll: updatedBankroll,
                userBets: [newBet, ...state.userBets],
            }));
            addNotification({
                type: 'success',
                title: 'Bet Placed',
                message: `Your bet on "${newBet.match.prediction}" has been placed successfully.`
            });
            return true;
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Failed to place bet';
            addNotification({
                type: 'error',
                title: 'Bet Failed',
                message: message
            });
            return false;
        }
    },
    placeVariationBet: async (variation) => {
        const { addNotification } = get();
         try {
            let finalBankroll: BankrollState | null = get().bankroll;
            const newBets: UserBet[] = [];

            for (const bet of variation.bets) {
                // Handle both normal parlays and SGPs
                const isParlay = bet.prediction.marketType === MarketType.Parlay;
                const selections = isParlay ? get().ticketSelections : [bet.prediction];
                 const { updatedBankroll, newBet } = await api.placeBet(bet.prediction, bet.stake, selections);
                 finalBankroll = updatedBankroll;
                 newBets.push(newBet);
            }
            
            set(state => ({
                bankroll: finalBankroll,
                userBets: [...newBets, ...state.userBets],
                ticketSelections: [],
                ticketVariations: null,
            }));
            addNotification({
                type: 'success',
                title: 'Ticket Placed',
                message: `Your "${variation.title}" ticket has been submitted.`
            });
            return true;

        } catch(e) {
            const message = e instanceof Error ? e.message : 'Failed to place one or more bets in the ticket.';
            addNotification({
                type: 'error',
                title: 'Ticket Failed',
                message: message
            });
            get().fetchInitialData(); 
            return false;
        }
    },
    updateSettings: async (settings) => {
        const newSettings = await api.updateUserSettings(settings);
        set({ userSettings: newSettings, isSettingsOpen: false });
        get().addNotification({
            type: 'info',
            title: 'Settings Updated',
            message: 'Your new settings have been saved.'
        });
    },
    updateBankroll: async (newInitial) => {
        const { updatedBankroll, clearedBets } = await api.updateInitialBankroll(newInitial);
        set({ bankroll: updatedBankroll, userBets: clearedBets });
    },
    settlePendingBet: async () => {
        const { userBets, addNotification } = get();
        const pendingBet = userBets.find(b => b.status === 'pending');
        if (pendingBet) {
            try {
                const { updatedBankroll, settledBet } = await api.settleBet(pendingBet.id);
                set(state => ({
                    bankroll: updatedBankroll,
                    userBets: state.userBets.map(b => b.id === settledBet.id ? settledBet : b)
                }));
                addNotification({
                    type: settledBet.status === 'won' ? 'success' : 'error',
                    title: `Bet Settled: ${settledBet.status === 'won' ? 'Won' : 'Lost'}`,
                    message: `Your bet on "${settledBet.match.prediction}" settled. Payout: $${(settledBet.payout ?? 0).toFixed(2)}`
                });
            } catch (e) {
                console.error("Failed to settle bet:", e);
            }
        }
    },
    generateTicketVariations: async (totalStake) => {
        const { ticketSelections, ticketRiskProfile } = get();
        if (ticketSelections.length === 0) return;
        set({ isGeneratingTickets: true, ticketVariations: null });
        try {
            const variations = await api.generateTickets(ticketSelections, totalStake, ticketRiskProfile);
            set({ ticketVariations: variations });
        } catch (e) {
            console.error("Failed to generate ticket variations:", e);
            alert(e instanceof Error ? e.message : 'Could not generate tickets.');
        } finally {
            set({ isGeneratingTickets: false });
        }
    },
    showConfirmation: (title, message, onConfirm) => set({
        confirmationModal: {
            isOpen: true,
            title,
            message,
            onConfirm,
        }
    }),
    hideConfirmation: () => set({ confirmationModal: null }),
    addNotification: (notification) => {
        const newNotification: Notification = {
            id: crypto.randomUUID(),
            ...notification,
        };
        set(state => ({ notifications: [...state.notifications, newNotification] }));
    },
    removeNotification: (id) => {
        set(state => ({ notifications: state.notifications.filter(n => n.id !== id) }));
    },
    
    // --- SIMPLE SETTERS ---
    setFilters: (newFilters) => {
        const currentFilters = get().filters;
        // If the sport has changed, reset dependent filters to prevent invalid combinations
        if (newFilters.sport !== currentFilters.sport) {
            newFilters.league = 'All';
            newFilters.marketType = 'All';
        }
        set({ filters: newFilters });
    },
    setSelectedMatch: (match) => set({ selectedMatch: match }),
    setSelectedLiveMatchForBet: (match) => set({ selectedLiveMatchForBet: match }),
    setIsSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
    setTicketRiskProfile: (profile) => set({ ticketRiskProfile: profile }),
    clearTicketVariations: () => set({ ticketVariations: null }),
    setActiveView: (view) => set({ activeView: view }),
    setDashboardFilters: (filters) => set({ dashboardFilters: filters }),
}));