import React, { useState, useEffect } from 'react';
import { MatchPrediction, LiveMatchPrediction, RiskLevel, HeadToHeadFixture, OddsHistoryPoint } from '../types';
import * as api from '../services/apiService';
import { getAiChallengeResponse } from '../services/geminiService';
import { Accordion } from './Accordion';
import { LiveIntelligenceFeed } from './LiveIntelligenceFeed';
import { HeadToHeadAnalysis } from './HeadToHeadAnalysis';
import { OddsHistoryChart } from './OddsHistoryChart';
import { LoadingSpinner } from './LoadingSpinner';
import { useStore } from '../store/useStore';

const XIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
)
const PlusCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
);
const CheckCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);


export const PredictionModal: React.FC = () => {
    const { match, setSelectedMatch, handleAddToTicket, getMarketsForMatch, ticketSelections } = useStore(state => ({
        match: state.selectedMatch,
        setSelectedMatch: state.setSelectedMatch,
        handleAddToTicket: state.handleAddToTicket,
        getMarketsForMatch: state.getMarketsForMatch,
        ticketSelections: state.ticketSelections,
    }));
    
    const [activeTab, setActiveTab] = useState('analysis');
    const [h2hData, setH2hData] = useState<HeadToHeadFixture[] | null>(null);
    const [oddsHistory, setOddsHistory] = useState<OddsHistoryPoint[] | null>(null);
    const [isLoadingH2H, setIsLoadingH2H] = useState(false);
    const [isLoadingOdds, setIsLoadingOdds] = useState(false);
    const [challengeResponse, setChallengeResponse] = useState<string | null>(null);
    const [isChallenging, setIsChallenging] = useState(false);

    const allMarketsForMatch = match ? getMarketsForMatch(match.matchId) : [];

    const onClose = () => setSelectedMatch(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

     useEffect(() => {
        if (!match) return;
        // Pre-emptively switch to 'analysis' if 'All Markets' is not available (e.g. for live matches where it's not implemented yet)
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

    // Reset state when match changes
    useEffect(() => {
        setActiveTab('analysis');
        setH2hData(null);
        setOddsHistory(null);
        setChallengeResponse(null);
        setIsChallenging(false);
    }, [match]);

    if (!match) return null;

    const { aiAnalysis } = match;

    const handleChallengeClick = async () => {
        if (!match || isChallenging) return;
        setIsChallenging(true);
        setChallengeResponse(null); // Clear previous response
        try {
            const response = await getAiChallengeResponse(match);
            setChallengeResponse(response);
        } catch (error) {
            console.error("Failed to get challenge response:", error);
            setChallengeResponse("An unexpected error occurred while generating the counter-argument.");
        } finally {
            setIsChallenging(false);
        }
    };

    const renderDecisionFlow = () => (
        <div className="space-y-2">
            {aiAnalysis.decisionFlow.map(step => (
                 <div key={step.step} className={`p-3 rounded-md flex items-center justify-between text-sm ${step.status === 'pass' ? 'bg-brand-green/10' : 'bg-brand-red/10'}`}>
                    <div>
                        <p className={`font-bold ${step.status === 'pass' ? 'text-brand-green' : 'text-brand-red'}`}>{step.step}</p>
                        <p className="text-xs text-brand-text-secondary">{step.reason}</p>
                    </div>
                     <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${step.status === 'pass' ? 'bg-brand-green/20 text-brand-green border-brand-green/30' : 'bg-brand-red/20 text-brand-red border-brand-red/30'}`}>{step.status}</span>
                </div>
            ))}
        </div>
    );
    
    const riskStyles = {
        [RiskLevel.Conservative]: "bg-sky-500/20 text-sky-400",
        [RiskLevel.Moderate]: "bg-brand-yellow/20 text-brand-yellow",
        [RiskLevel.Aggressive]: "bg-brand-red/20 text-brand-red",
    }

    const renderAnalysisTab = () => (
        <div className="space-y-6">
            <Accordion title="Key Factors" defaultOpen>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-brand-green/10 p-4 rounded-lg">
                        <h4 className="font-bold text-brand-green mb-2">Key Positives</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-brand-text-secondary">
                            {aiAnalysis.keyPositives.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>
                     <div className="bg-brand-red/10 p-4 rounded-lg">
                        <h4 className="font-bold text-brand-red mb-2">Key Negatives</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-brand-text-secondary">
                            {aiAnalysis.keyNegatives.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>
                </div>
            </Accordion>
             <Accordion title="Betting Angle & Risk Assessment" defaultOpen>
                 <p className="text-sm text-brand-text-secondary mb-4 p-4 bg-brand-bg-dark rounded-md">{aiAnalysis.bettingAngle}</p>
                 <div className="flex justify-between items-center bg-brand-bg-dark p-4 rounded-lg">
                    <span className="text-brand-text-secondary font-semibold">AI Risk Level</span>
                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${riskStyles[aiAnalysis.riskLevel]}`}>{aiAnalysis.riskLevel}</span>
                 </div>
            </Accordion>
            <Accordion title="AI Decision Flow">
                {renderDecisionFlow()}
            </Accordion>
             <Accordion title="Live Intelligence Feed">
                <LiveIntelligenceFeed sources={aiAnalysis.dataSources} />
            </Accordion>

            <div className="border-t border-brand-border pt-6 mt-6">
                {isChallenging ? (
                    <LoadingSpinner />
                ) : challengeResponse ? (
                    <div className="animate-fade-in space-y-3">
                        <h3 className="text-lg font-bold text-brand-yellow">AI's Second Opinion</h3>
                        <div 
                            className="bg-brand-bg-dark p-4 rounded-lg prose prose-sm prose-invert max-w-none" 
                            dangerouslySetInnerHTML={{ __html: challengeResponse.replace(/\n/g, '<br />') }}
                        />
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-sm text-brand-text-secondary mb-3">Want a different perspective?</p>
                        <button 
                            onClick={handleChallengeClick}
                            className="bg-brand-yellow/20 text-brand-yellow font-bold px-6 py-2 rounded-lg hover:bg-brand-yellow/30 transition-colors flex items-center gap-2 mx-auto"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                            Challenge AI Prediction
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    const renderH2HTab = () => {
        if (isLoadingH2H) return <LoadingSpinner />;
        if (!h2hData) return <p>Could not load Head-to-Head data.</p>;
        return <HeadToHeadAnalysis data={h2hData} teamA={match.teamA} teamB={match.teamB} />;
    };
    
    const renderOddsTab = () => {
        if (isLoadingOdds) return <LoadingSpinner />;
        if (!oddsHistory) return <p>Could not load Odds History data.</p>;
        return <OddsHistoryChart data={oddsHistory} teamA={match.teamA} teamB={match.teamB} />;
    };

    const renderMarketsTab = () => {
        return (
            <div className="space-y-3">
                {allMarketsForMatch.map(market => {
                    const isSelected = ticketSelections.some(s => s.id === market.id);
                    return (
                        <div key={market.id} className="bg-brand-bg-dark p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-bold text-brand-text-primary">{market.prediction}</p>
                                <p className="text-xs text-brand-text-secondary">{market.marketType}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xl font-bold text-brand-yellow">{market.odds.toFixed(2)}</span>
                                 <button
                                    onClick={() => handleAddToTicket(market)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-2 ${
                                        isSelected 
                                        ? 'bg-brand-green/20 text-brand-green' 
                                        : 'bg-brand-green/80 text-white hover:bg-brand-green'
                                    }`}
                                >
                                    {isSelected ? <CheckCircleIcon className="w-4 h-4"/> : <PlusCircleIcon className="w-4 h-4"/>}
                                    {isSelected ? 'Added' : 'Add'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        )
    }
    
    const tabs = [
        { id: 'analysis', label: 'AI Analysis' },
        ...(allMarketsForMatch.length > 1 && !('liveOdds' in match) ? [{ id: 'markets', label: 'All Markets' }] : []),
        { id: 'h2h', label: 'Head-to-Head' },
        { id: 'odds', label: 'Odds History' }
    ];

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-brand-bg-light rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b border-brand-border flex justify-between items-start">
            <div>
                 <p className="text-sm text-brand-text-secondary">{match.league}</p>
                 <h2 className="text-2xl font-bold text-brand-text-primary">{match.teamA} vs {match.teamB}</h2>
                 <p className="text-brand-text-secondary mt-1">{new Date(match.matchDate).toLocaleString()}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full text-brand-text-secondary hover:bg-brand-border"><XIcon className="w-6 h-6"/></button>
        </header>
        
        <main className="p-6 overflow-y-auto">
            <div className="mb-6 bg-brand-bg-dark p-1.5 rounded-lg flex items-center gap-2 max-w-max">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
                            activeTab === tab.id
                                ? 'bg-brand-bg-light text-brand-text-primary shadow-sm'
                                : 'text-brand-text-secondary hover:text-brand-text-primary'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            {activeTab === 'analysis' && renderAnalysisTab()}
            {activeTab === 'markets' && renderMarketsTab()}
            {activeTab === 'h2h' && renderH2HTab()}
            {activeTab === 'odds' && renderOddsTab()}
        </main>
        
        <footer className="p-6 border-t border-brand-border bg-brand-bg-dark/50 rounded-b-xl flex justify-between items-center">
            <div>
                <p className="font-bold text-lg">{match.prediction}</p>
                <p className="text-sm text-brand-text-secondary">Current Odds: <span className="font-bold text-brand-yellow text-lg">{('liveOdds' in match ? match.liveOdds : match.odds).toFixed(2)}</span></p>
            </div>
             {!('liveOdds' in match) && (
                 <button 
                    onClick={() => handleAddToTicket(match as MatchPrediction)}
                    className="bg-brand-green text-white font-bold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    Add to Ticket
                </button>
             )}
        </footer>
      </div>
    </div>
  );
};