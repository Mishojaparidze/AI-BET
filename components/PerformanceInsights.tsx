
import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { generatePerformanceReport } from '../services/geminiService';
import { CoachInsight } from '../types';

const BrainIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
);

export const PerformanceInsights: React.FC = () => {
    const userBets = useStore(state => state.userBets);
    const [insight, setInsight] = useState<CoachInsight | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Only generate insights if we have enough data (e.g., > 3 bets) and haven't generated yet
        if (userBets.length >= 3 && !insight && !loading) {
            setLoading(true);
            generatePerformanceReport(userBets)
                .then(setInsight)
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [userBets.length]); // Re-run if bet count changes significantly

    if (userBets.length < 3) return null;

    if (loading) {
        return (
            <div className="bg-brand-bg-light p-6 rounded-lg border border-brand-border animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                    <BrainIcon className="w-6 h-6 text-brand-text-secondary" />
                    <div className="h-6 w-48 bg-brand-bg-dark rounded"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-full bg-brand-bg-dark rounded"></div>
                    <div className="h-4 w-2/3 bg-brand-bg-dark rounded"></div>
                </div>
            </div>
        );
    }

    if (!insight) return null;

    return (
        <div className="bg-gradient-to-br from-indigo-900/30 to-brand-bg-light p-6 rounded-lg border border-indigo-500/30 shadow-lg animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500/20 rounded-full">
                    <BrainIcon className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-brand-text-primary">AI Performance Coach</h2>
                    <p className="text-xs text-brand-text-secondary">Based on your last {Math.min(50, userBets.length)} bets</p>
                </div>
            </div>

            <p className="text-brand-text-primary font-medium italic mb-4">"{insight.summary}"</p>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-brand-bg-dark/50 p-3 rounded-lg border-l-4 border-brand-green">
                    <p className="text-xs font-bold text-brand-text-secondary uppercase mb-1">Strengths</p>
                    <ul className="list-disc list-inside text-sm text-brand-text-primary">
                        {insight.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
                <div className="bg-brand-bg-dark/50 p-3 rounded-lg border-l-4 border-brand-red">
                    <p className="text-xs font-bold text-brand-text-secondary uppercase mb-1">Weaknesses</p>
                     <ul className="list-disc list-inside text-sm text-brand-text-primary">
                        {insight.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
            </div>

            <div className="mt-4 bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/30 flex gap-3 items-start">
                <span className="text-lg">💡</span>
                <div>
                    <p className="text-xs font-bold text-indigo-300 uppercase">Coach's Tip</p>
                    <p className="text-sm text-indigo-100">{insight.actionableTip}</p>
                </div>
            </div>
        </div>
    );
};
