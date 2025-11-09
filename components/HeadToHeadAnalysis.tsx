import React from 'react';
import { HeadToHeadFixture } from '../types';

interface HeadToHeadAnalysisProps {
    data: HeadToHeadFixture[];
    teamA: string;
    teamB: string;
}

export const HeadToHeadAnalysis: React.FC<HeadToHeadAnalysisProps> = ({ data, teamA, teamB }) => {
    
    if (data.length === 0) {
        return <p className="text-brand-text-secondary text-center p-8">No recent head-to-head data available for these teams.</p>
    }

    let teamAWins = 0;
    let teamBWins = 0;
    let draws = 0;

    data.forEach(match => {
        if (match.goals.home === null || match.goals.away === null) return;
        if (match.goals.home > match.goals.away) {
            match.homeTeam === teamA ? teamAWins++ : teamBWins++;
        } else if (match.goals.away > match.goals.home) {
            match.awayTeam === teamA ? teamAWins++ : teamBWins++;
        } else {
            draws++;
        }
    });
    
    return (
        <div className="space-y-4">
            <div className="bg-brand-bg-dark p-4 rounded-lg flex justify-around text-center">
                <div>
                    <p className="text-3xl font-bold text-brand-text-primary">{teamAWins}</p>
                    <p className="font-semibold text-brand-text-secondary">{teamA} Wins</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-brand-text-primary">{draws}</p>
                    <p className="font-semibold text-brand-text-secondary">Draws</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-brand-text-primary">{teamBWins}</p>
                    <p className="font-semibold text-brand-text-secondary">{teamB} Wins</p>
                </div>
            </div>
            <div>
                 <h4 className="font-bold text-brand-text-primary mb-2">Recent Matches</h4>
                 <div className="space-y-2">
                    {data.map(match => (
                        <div key={match.fixtureId} className="bg-brand-bg-dark p-3 rounded-md text-sm flex justify-between items-center">
                            <span className="text-brand-text-secondary">{new Date(match.date).toLocaleDateString()}</span>
                            <span className="font-semibold text-brand-text-primary flex-1 text-right pr-4">{match.homeTeam} vs {match.awayTeam}</span>
                             <span className="font-bold text-lg text-brand-yellow font-mono">{match.goals.home} - {match.goals.away}</span>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};
