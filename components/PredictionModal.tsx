
import React, { useState, useEffect } from 'react';
import { MatchPrediction, LiveMatchPrediction, RiskLevel, HeadToHeadFixture, OddsHistoryPoint } from '../types';
import * as api from '../services/apiService';
import { getAiChallengeResponse, generateMatchInsight } from '../services/geminiService';
import { Accordion } from './Accordion';
import { LiveIntelligenceFeed } from './LiveIntelligenceFeed';
import { HeadToHeadAnalysis } from './HeadToHeadAnalysis';
import { OddsHistoryChart } from './OddsHistoryChart';
import { LoadingSpinner } from './LoadingSpinner';
import { useStore } from '../store/useStore';

const XIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" fill="#3A3A3C" stroke="none" /><path d="M15 9l-6 6M9 9l6 6" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" /></svg>
)

const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L9.5 8.5 4 11l5.5 2.5L12 19l2.5-5.5L20 11l-5.5-2.5z"/></svg>
);

export const PredictionModal: React.FC = () => {
    const { match, setSelectedMatch, handleAddToTicket, getMarketsForMatch, ticketSelections, updateMatchData } = useStore(state => ({
        match: state.selectedMatch,
        setSelectedMatch: state.setSelectedMatch,
        handleAddToTicket: state.handleAddToTicket,
        getMarketsForMatch: state.getMarketsForMatch,
        ticketSelections: state.ticketSelections,
        updateMatchData: state.updateMatchData,
    }));
    
    const [activeTab, setActiveTab] = useState('analysis');
    const [h2hData, setH2hData] = useState<HeadToHeadFixture[] | null>(null);
    const [oddsHistory, setOddsHistory] = useState<OddsHistoryPoint[] | null>(null);
    const [isLoadingH2H, setIsLoadingH2H] = useState(false);
    const [isLoadingOdds, setIsLoadingOdds] = useState(false);
    const [challengeResponse, setChallengeResponse] = useState<string | null>(null);
    const [isChallenging, setIsChallenging] = useState(false);
    const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
    const [aiAnalyzed, setAiAnalyzed] = useState(false);

    const allMarketsForMatch = match ? getMarketsForMatch(match.matchId) : [];

    const onClose = () => {
        setSelectedMatch(null);
        setAiAnalyzed(false);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // --- DEEP DIVE AI TRIGGER ---
    useEffect(() => {
        if (match && !('liveOdds' in match) && !aiAnalyzed && !isAiAnalyzing) {
            const runDeepDive = async () => {
                setIsAiAnalyzing(true);
                try {
                    const insight = await generateMatchInsight(match as MatchPrediction);
                    // Merge the new insight with the existing match data
                    if (insight && Object.keys(insight).length > 0) {
                        const updatedMatch = {
                            ...match,
                            aiAnalysis: {
                                ...match.aiAnalysis,
                                ...insight
                            }
                        };
                        updateMatchData(updatedMatch as MatchPrediction);
                    }
                } catch (e) {
                    console.error("Deep dive failed", e);
                } finally {
                    setIsAiAnalyzing(false);
                    setAiAnalyzed(true);
                }
            };
            runDeepDive();
        }
    }, [match, aiAnalyzed, isAiAnalyzing, updateMatchData]);

     useEffect(() => {
        if (!match) return;
        if (activeTab === 'markets' && allMarketsForMatch.length <= 1) {
            setActiveTab('analysis');
        }
        if (activeTab === 'h2h' && !h2hData) {
            setIsLoadingH2H(true);
            api.fetchHeadToHead(match.teamAId, match.teamBId)
                .then(setH2hData)
                .catch(console.error)
                .finally(() => setIsLoadingH2H(false));
        }
        if (activeTab === 'odds' && !oddsHistory) {
            setIsLoadingOdds(true);
            api.fetchOddsHistory(match.id)
                .then(setOddsHistory)
                .catch(console.error)
                .finally(() => setIsLoadingOdds(false));
        }
    }, [activeTab, h2hData, oddsHistory, match, allMarketsForMatch.length]);

    useEffect(() => {
        setActiveTab('analysis');
        setH2hData(null);
        setOddsHistory(null);
        setChallengeResponse(null);
        setIsChallenging(false);
        setAiAnalyzed(false); // Reset for new match
    }, [match?.id]);

    if (!match) return null;

    const { aiAnalysis } = match;

    const handleChallengeClick = async () => {
        if (!match || isChallenging) return;
        setIsChallenging(true);
        setChallengeResponse(null);
        try {
            const response = await getAiChallengeResponse(match);
            setChallengeResponse(response);
        } catch (error) {
            console.error("Failed to get challenge response:", error);
            setChallengeResponse("An unexpected error occurred.");
        } finally {
            setIsChallenging(false);
        }
    };
    
    const renderDecisionFlow = () => (
        <div className="space-y-2">
            {aiAnalysis.decisionFlow.map((step, i) => (
                 <div key={i} className={`p-3 rounded-xl flex items-center justify-between text-sm ${step.status === 'pass' ? 'bg-brand-green/10' : step.status === 'fail' ? 'bg-brand-red/10' : 'bg-brand-bg-dark'}`}>
                    <div>
                        <p className={`font-bold ${step.status === 'pass' ? 'text-brand-green' : step.status === 'fail' ? 'text-brand-red' : 'text-brand-text-secondary'}`}>{step.step}</p>
                        <p className="text-xs text-brand-text-secondary">{step.reason}</p>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderAnalysisTab = () => (
        <div className="space-y-6">
            {isAiAnalyzing ? (
                 <div className="bg-brand-bg-elevated rounded-xl p-8 flex flex-col items-center justify-center text-center animate-pulse">
                    <SparklesIcon className="w-8 h-8 text-brand-blue mb-3 animate-spin" />
                    <p className="font-bold text-brand-text-primary">Consulting AI Engine...</p>
                    <p className="text-xs text-brand-text-secondary mt-1">Analyzing matchups, form, and market movements.</p>
                 </div>
            ) : (
                <div className="bg-brand-bg-elevated rounded-xl p-4 animate-fade-in">
                     <div className="flex items-center gap-2 mb-2">
                        <SparklesIcon className="w-4 h-4 text-brand-yellow" />
                        <span className="text-xs font-bold text-brand-yellow uppercase tracking-wide">AI Deep Dive</span>
                     </div>
                     <p className="text-[15px] text-brand-text-primary leading-relaxed">{aiAnalysis.bettingAngle}</p>
                     <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-brand-text-secondary font-medium uppercase">Risk Level</span>
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${aiAnalysis.riskLevel === RiskLevel.Conservative ? 'text-brand-blue bg-brand-blue/10' : aiAnalysis.riskLevel === RiskLevel.Moderate ? 'text-brand-yellow bg-brand-yellow/10' : 'text-brand-red bg-brand-red/10'}`}>{aiAnalysis.riskLevel}</span>
                     </div>
                </div>
            )}

            <Accordion title="Key Factors" defaultOpen>
                <div className="space-y-3">
                    {aiAnalysis.keyPositives.map((p, i) => (
                        <div key={`pos-${i}`} className="flex gap-3 items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-green mt-1.5"></div>
                            <p className="text-sm text-brand-text-primary">{p}</p>
                        </div>
                    ))}
                    {aiAnalysis.keyNegatives.map((p, i) => (
                        <div key={`neg-${i}`} className="flex gap-3 items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-1.5"></div>
                            <p className="text-sm text-brand-text-primary">{p}</p>
                        </div>
                    ))}
                </div>
            </Accordion>
            
            <Accordion title="AI Decision Logic">
                {renderDecisionFlow()}
            </Accordion>

            <div className="pt-2">
                {isChallenging ? (
                    <LoadingSpinner />
                ) : challengeResponse ? (
                    <div className="animate-fade-in bg-brand-bg-elevated p-4 rounded-xl">
                        <h3 className="text-sm font-bold text-brand-yellow mb-2">Skeptic's View</h3>
                        <div 
                            className="text-sm text-brand-text-primary leading-relaxed" 
                            dangerouslySetInnerHTML={{ __html: challengeResponse.replace(/\n/g, '<br />') }}
                        />
                    </div>
                ) : (
                    <button 
                        onClick={handleChallengeClick}
                        className="w-full py-3 rounded-xl bg-brand-bg-elevated text-brand-yellow font-semibold text-sm hover:bg-brand-border transition-colors"
                    >
                        Challenge this Prediction
                    </button>
                )}
            </div>
        </div>
    );

    // Simplified H2H and Odds renderers for brevity in this example, keeping logic same
    const renderH2HTab = () => isLoadingH2H ? <LoadingSpinner /> : !h2hData ? <p>No Data</p> : <HeadToHeadAnalysis data={h2hData} teamA={match.teamA} teamB={match.teamB} />;
    const renderOddsTab = () => isLoadingOdds ? <LoadingSpinner /> : !oddsHistory ? <p>No Data</p> : <OddsHistoryChart data={oddsHistory} teamA={match.teamA} teamB={match.teamB} />;
    
    const renderMarketsTab = () => (
        <div className="space-y-2">
            {allMarketsForMatch.map(market => {
                const isSelected = ticketSelections.some(s => s.id === market.id);
                return (
                    <div key={market.id} className="bg-brand-bg-elevated p-4 rounded-xl flex justify-between items-center active:scale-[0.99] transition-transform" onClick={() => handleAddToTicket(market)}>
                        <div>
                            <p className="font-medium text-brand-text-primary">{market.prediction}</p>
                            <p className="text-xs text-brand-text-secondary">{market.marketType}</p>
                        </div>
                        <div className={`flex items-center justify-center px-3 py-1.5 rounded-lg font-bold text-sm transition-colors ${isSelected ? 'bg-brand-green text-white' : 'bg-brand-blue/10 text-brand-blue'}`}>
                            {market.odds.toFixed(2)}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    const tabs = [
        { id: 'analysis', label: 'Analysis' },
        ...(allMarketsForMatch.length > 1 && !('liveOdds' in match) ? [{ id: 'markets', label: 'Markets' }] : []),
        { id: 'h2h', label: 'H2H' },
        { id: 'odds', label: 'Odds' }
    ];

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-end sm:items-center sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Modal/Sheet */}
      <div className="relative w-full max-w-lg bg-brand-bg-light rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-modal-enter">
        
        {/* Drag Handle (Mobile) */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden" onClick={onClose}>
            <div className="w-12 h-1.5 bg-brand-border rounded-full"></div>
        </div>

        <header className="px-6 py-4 flex justify-between items-start border-b border-brand-border/50">
            <div>
                 <p className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">{match.league}</p>
                 <h2 className="text-xl font-bold text-brand-text-primary mt-0.5">{match.teamA} <span className="text-brand-text-secondary font-normal">vs</span> {match.teamB}</h2>
            </div>
            <button onClick={onClose} className="hidden sm:block p-1"><XIcon className="w-8 h-8"/></button>
        </header>
        
        {/* Tabs */}
        <div className="px-6 pt-4 pb-2 flex gap-4 overflow-x-auto hide-scrollbar border-b border-brand-border/50">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-2 text-sm font-semibold whitespace-nowrap transition-colors relative ${
                        activeTab === tab.id ? 'text-brand-text-primary' : 'text-brand-text-secondary'
                    }`}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-full"></div>
                    )}
                </button>
            ))}
        </div>

        <main className="p-6 overflow-y-auto">
            {activeTab === 'analysis' && renderAnalysisTab()}
            {activeTab === 'markets' && renderMarketsTab()}
            {activeTab === 'h2h' && renderH2HTab()}
            {activeTab === 'odds' && renderOddsTab()}
        </main>
        
        {/* Footer Action */}
        <footer className="p-4 bg-brand-bg-light/90 backdrop-blur-xl border-t border-brand-border/50 pb-safe-bottom">
            <button 
                onClick={() => {
                    handleAddToTicket(match as MatchPrediction);
                    onClose();
                }}
                className="w-full bg-brand-blue text-white font-bold py-3.5 rounded-xl active:scale-[0.98] transition-transform shadow-lg shadow-brand-blue/20 flex justify-center items-center gap-2"
            >
                <span>Add to Slip</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-sm">
                    {('liveOdds' in match ? match.liveOdds : match.odds).toFixed(2)}
                </span>
            </button>
        </footer>
      </div>
    </div>
  );
};
