import React, { useState, useEffect } from 'react';
import { MatchPrediction, LiveMatchPrediction, RiskLevel, HeadToHeadFixture, OddsHistoryPoint } from '../types';
import * as api from '../services/apiService';
import { Accordion } from './Accordion';
import { LiveIntelligenceFeed } from './LiveIntelligenceFeed';
import { HeadToHeadAnalysis } from './HeadToHeadAnalysis';
import { OddsHistoryChart } from './OddsHistoryChart';
import { LoadingSpinner } from './LoadingSpinner';

interface PredictionModalProps {
  match: MatchPrediction | LiveMatchPrediction;
  onClose: () => void;
  onAddToTicket: (prediction: MatchPrediction) => void;
}

const XIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
)

export const PredictionModal: React.FC<PredictionModalProps> = ({ match, onClose, onAddToTicket }) => {
    const { aiAnalysis } = match;
    const [activeTab, setActiveTab] = useState('analysis');
    const [h2hData, setH2hData] = useState<HeadToHeadFixture[] | null>(null);
    const [oddsHistory, setOddsHistory] = useState<OddsHistoryPoint[] | null>(null);
    const [isLoadingH2H, setIsLoadingH2H] = useState(false);
    const [isLoadingOdds, setIsLoadingOdds] = useState(false);

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
    }, [activeTab, h2hData, oddsHistory, match.teamAId, match.teamBId, match.id]);


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
            <div className="border-b border-brand-border mb-6">
                <nav className="flex space-x-6">
                    <button className={`pb-3 border-b-2 font-semibold ${activeTab === 'analysis' ? 'border-brand-green text-brand-text-primary' : 'border-transparent text-brand-text-secondary hover:border-brand-border'}`} onClick={() => setActiveTab('analysis')}>AI Analysis</button>
                    <button className={`pb-3 border-b-2 font-semibold ${activeTab === 'h2h' ? 'border-brand-green text-brand-text-primary' : 'border-transparent text-brand-text-secondary hover:border-brand-border'}`} onClick={() => setActiveTab('h2h')}>Head-to-Head</button>
                    <button className={`pb-3 border-b-2 font-semibold ${activeTab === 'odds' ? 'border-brand-green text-brand-text-primary' : 'border-transparent text-brand-text-secondary hover:border-brand-border'}`} onClick={() => setActiveTab('odds')}>Odds History</button>
                </nav>
            </div>
            {activeTab === 'analysis' && renderAnalysisTab()}
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
                    onClick={() => onAddToTicket(match)}
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