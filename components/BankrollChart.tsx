import React, { useEffect, useRef, useMemo } from 'react';
import { type UserBet } from '../types';

// This component relies on Chart.js being available in the global scope (window.Chart)
declare const Chart: any;

interface BankrollChartProps {
    initialBankroll: number;
    bets: UserBet[];
}

export const BankrollChart: React.FC<BankrollChartProps> = ({ initialBankroll, bets }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<any>(null);

    const chartData = useMemo(() => {
        // Sort bets by placed date to ensure chronological order
        const sortedBets = [...bets].sort((a, b) => new Date(a.placedAt).getTime() - new Date(b.placedAt).getTime());
        
        const labels: string[] = ['Start'];
        const dataPoints: number[] = [initialBankroll];
        let currentBankroll = initialBankroll;

        sortedBets.forEach((bet, index) => {
            // Point before payout (stake removed)
            // Note: In the current app logic, bankroll is only updated on settle, so we follow that.
            // A more complex chart could show the dip when a bet is placed.
            
            // Point after payout
            currentBankroll += (bet.payout ?? 0) - bet.stake;
            labels.push(`Bet ${index + 1}`);
            dataPoints.push(currentBankroll);
        });

        return { labels, dataPoints };

    }, [initialBankroll, bets]);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const gradient = ctx.createLinearGradient(0, 0, 0, 250);
                gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
                gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

                chartInstanceRef.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: chartData.labels,
                        datasets: [{
                            label: 'Bankroll',
                            data: chartData.dataPoints,
                            fill: true,
                            backgroundColor: gradient,
                            borderColor: '#10b981',
                            tension: 0.3,
                            pointBackgroundColor: '#10b981',
                            pointRadius: chartData.dataPoints.length > 20 ? 0 : 3,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: false,
                                ticks: {
                                    color: '#9ca3af',
                                    callback: (value) => `$${value}`
                                },
                                grid: {
                                    color: 'rgba(55, 65, 81, 0.5)',
                                    drawBorder: false,
                                }
                            },
                            x: {
                                ticks: {
                                    color: '#9ca3af',
                                    maxRotation: 0,
                                    minRotation: 0,
                                    autoSkip: true,
                                    maxTicksLimit: 10
                                },
                                grid: {
                                    display: false
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                mode: 'index',
                                intersect: false,
                                callbacks: {
                                    label: (context) => ` Bankroll: $${Number(context.raw).toFixed(2)}`
                                }
                            }
                        },
                        interaction: {
                            mode: 'index',
                            intersect: false,
                        }
                    }
                });
            }
        }
        
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };

    }, [chartData]);


    return (
        <div className="bg-brand-bg-dark p-4 rounded-lg h-64">
             <canvas ref={chartRef}></canvas>
        </div>
    );
};
