import React, { useMemo, useEffect, useRef } from 'react';
import { type UserBet } from '../types';

// This component now relies on Chart.js being available in the global scope (window.Chart)
declare const Chart: any;

interface BetPerformanceProps {
    bets: UserBet[];
}

export const BetPerformance: React.FC<BetPerformanceProps> = ({ bets }) => {
    const settledBets = bets.filter(b => b.status !== 'pending');
    const winLossChartRef = useRef<HTMLCanvasElement>(null);
    const leagueChartRef = useRef<HTMLCanvasElement>(null);

    const performanceByLeague = useMemo(() => {
        const stats: Record<string, { league: string; stake: number; payout: number; }> = {};
        settledBets.forEach(bet => {
            const league = bet.match.league;
            if (!stats[league]) {
                stats[league] = { league, stake: 0, payout: 0 };
            }
            stats[league].stake += bet.stake;
            if (bet.status === 'won') {
                stats[league].payout += bet.payout || 0;
            }
        });
        return Object.values(stats)
            .map(s => ({ ...s, profit: s.payout - s.stake }))
            .sort((a, b) => b.profit - a.profit);
    }, [settledBets]);


    useEffect(() => {
        let winLossChartInstance: any;
        if (winLossChartRef.current && settledBets.length > 0) {
            const wins = settledBets.filter(b => b.status === 'won').length;
            const losses = settledBets.length - wins;

            const ctx = winLossChartRef.current.getContext('2d');
            winLossChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Wins', 'Losses'],
                    datasets: [{
                        label: 'Bet Outcomes',
                        data: [wins, losses],
                        backgroundColor: ['#10b981', '#ef4444'],
                        borderColor: '#1f2937',
                        borderWidth: 4,
                        hoverOffset: 8,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#9ca3af',
                                font: { size: 12 },
                                padding: 20,
                            }
                        },
                        tooltip: {
                            bodyFont: { weight: 'bold' },
                            displayColors: false,
                        }
                    },
                    cutout: '70%',
                }
            });
        }
        return () => {
            winLossChartInstance?.destroy();
        };
    }, [settledBets]);

    useEffect(() => {
        let leagueChartInstance: any;
        if (leagueChartRef.current && performanceByLeague.length > 0) {
            const ctx = leagueChartRef.current.getContext('2d');
            leagueChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: performanceByLeague.map(l => l.league),
                    datasets: [{
                        label: 'Profit/Loss',
                        data: performanceByLeague.map(l => l.profit),
                        backgroundColor: performanceByLeague.map(l => l.profit >= 0 ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)'),
                        borderColor: performanceByLeague.map(l => l.profit >= 0 ? '#10b981' : '#ef4444'),
                        borderWidth: 2,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: {
                        x: {
                            ticks: { color: '#9ca3af', callback: (value) => `$${value}` },
                            grid: { color: 'rgba(55, 65, 81, 0.5)' }
                        },
                        y: {
                            ticks: { color: '#9ca3af' },
                            grid: { display: false }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                             callbacks: {
                                label: (context) => ` P/L: $${Number(context.raw).toFixed(2)}`
                             }
                        }
                    }
                }
            });
        }
        return () => {
            leagueChartInstance?.destroy();
        }
    }, [performanceByLeague]);


    if (settledBets.length === 0) {
        return <p className="text-center text-brand-text-secondary py-8">No settled bets to analyze yet. Come back after some matches have finished!</p>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-brand-bg-dark p-4 rounded-lg h-80 flex flex-col items-center">
                    <h4 className="font-bold text-brand-text-primary mb-4">Overall Performance</h4>
                    <div className="relative w-full flex-grow">
                        <canvas ref={winLossChartRef}></canvas>
                    </div>
                </div>
                <div className="bg-brand-bg-dark p-4 rounded-lg h-80 flex flex-col">
                    <h4 className="font-bold text-brand-text-primary mb-4">P/L by League</h4>
                    <div className="relative w-full flex-grow">
                        <canvas ref={leagueChartRef}></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
}