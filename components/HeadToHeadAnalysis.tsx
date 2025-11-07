import React, { useMemo } from 'react';
import { type HeadToHeadFixture } from '../types';

interface HeadToHeadAnalysisProps {
    h2hData: HeadToHeadFixture[] | null;
    teamA: string;
    teamB: string;
}

const TrophyIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M9.17 9a3 3 0 0 0 5.66 0"/>
    </svg>
);


export const HeadToHeadAnalysis: React.FC<HeadToHeadAnalysisProps> = ({ h2hData, teamA, teamB }) => {

    const stats = useMemo(() => {
        if (!h2hData || h2hData.length === 0) {
            return null;
        }

        let teamAWins = 0;
        let teamBWins = 0;
        let draws = 0;
        let teamAGoals = 0;
        let teamBGoals = 0;

        h2hData.forEach(fixture => {
            const { homeTeam, goals } = fixture;
            const homeGoals = goals.home ?? 0;
            const awayGoals = goals.away ?? 0;

            if (homeGoals > awayGoals) {
                homeTeam === teamA ? teamAWins++ : teamBWins++;
            } else if (awayGoals > homeGoals) {
                homeTeam === teamA ? teamBWins++ : teamAWins++;
            } else {
                draws++;
            }

            if (homeTeam === teamA) {
                teamAGoals += homeGoals;
                teamBGoals += awayGoals;
            } else {
                teamBGoals += homeGoals;
                teamAGoals += awayGoals;
            }
        });
        
        return { teamAWins, teamBWins, draws, teamAGoals, teamBGoals };
    }, [h2hData, teamA, teamB]);

    if (!h2hData || h2hData.length === 0) {
        return <p className="text-center text-brand-text-secondary py-4">No recent head-to-head data available for this matchup.</p>;
    }
    
    if (!stats) return null;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center bg-brand-bg-light p-4 rounded-lg">
                <div>
                    <p className="text-sm font-medium text-brand-text-secondary">{teamA} Wins</p>
                    <p className="text-2xl font-black text-brand-text-primary">{stats.teamAWins}</p>
                </div>
                 <div>
                    <p className="text-sm font-medium text-brand-text-secondary">Draws</p>
                    <p className="text-2xl font-black text-brand-text-primary">{stats.draws}</p>
                </div>
                 <div>
                    <p className="text-sm font-medium text-brand-text-secondary">{teamB} Wins</p>
                    <p className="text-2xl font-black text-brand-text-primary">{stats.teamBWins}</p>
                </div>
            </div>

            <div className="space-y-2">
                 <h4 className="text-sm font-bold text-brand-text-secondary mt-4">Recent Encounters</h4>
                 {h2hData.slice(0, 5).map(fixture => {
                    const homeGoals = fixture.goals.home ?? 0;
                    const awayGoals = fixture.goals.away ?? 0;
                    const homeWinner = homeGoals > awayGoals;
                    const awayWinner = awayGoals > homeGoals;
                    
                    const homeTeamClass = homeWinner ? 'font-bold text-brand-text-primary' : 'text-brand-text-secondary';
                    const awayTeamClass = awayWinner ? 'font-bold text-brand-text-primary' : 'text-brand-text-secondary';

                     return (
                        <div key={fixture.fixtureId} className="flex items-center justify-between bg-brand-bg-light/50 p-3 rounded-md text-sm">
                            <span className="text-xs text-brand-text-secondary">{new Date(fixture.date).toLocaleDateString()}</span>
                            <div className="flex items-center gap-3 text-center">
                                <span className={`w-32 truncate text-right ${homeTeamClass}`}>{fixture.homeTeam}</span>
                                <span className="font-mono bg-brand-bg-dark px-2 py-1 rounded-md">{homeGoals} - {awayGoals}</span>
                                <span className={`w-32 truncate text-left ${awayTeamClass}`}>{fixture.awayTeam}</span>
                            </div>
                            <div className="w-10 text-center">
                                {homeWinner && fixture.homeTeam === teamA && <TrophyIcon className="w-4 h-4 text-brand-green mx-auto" />}
                                {awayWinner && fixture.awayTeam === teamA && <TrophyIcon className="w-4 h-4 text-brand-green mx-auto" />}
                                {homeWinner && fixture.homeTeam === teamB && <TrophyIcon className="w-4 h-4 text-brand-yellow mx-auto" />}
                                {awayWinner && fixture.awayTeam === teamB && <TrophyIcon className="w-4 h-4 text-brand-yellow mx-auto" />}
                            </div>
                        </div>
                     )
                 })}
            </div>
        </div>
    )

}