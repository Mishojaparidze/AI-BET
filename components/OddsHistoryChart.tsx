import React from 'react';
import { OddsHistoryPoint } from '../types';

interface OddsHistoryChartProps {
    data: OddsHistoryPoint[];
    teamA: string;
    teamB: string;
}

// This is a simplified chart representation. A real implementation would use a library like Recharts.
export const OddsHistoryChart: React.FC<OddsHistoryChartProps> = ({ data, teamA, teamB }) => {

    const renderLegend = () => (
        <div className="flex justify-center gap-6 text-sm mb-4">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-sky-500"></div>
                <span>{teamA}</span>
            </div>
             <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-brand-yellow"></div>
                <span>Draw</span>
            </div>
             <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-brand-red"></div>
                <span>{teamB}</span>
            </div>
        </div>
    );
    
    return (
        <div className="bg-brand-bg-dark p-4 rounded-lg">
            {renderLegend()}
            <div className="text-brand-text-secondary text-sm">
                {data.map(point => (
                    <div key={point.date} className="flex justify-between items-center py-2 border-b border-brand-border/50">
                        <span className="font-semibold">{point.date}</span>
                        <div className="flex gap-4 font-mono">
                            <span className="text-sky-400 w-12 text-center">{point.oddsA.toFixed(2)}</span>
                            <span className="text-brand-yellow w-12 text-center">{point.oddsDraw.toFixed(2)}</span>
                            <span className="text-brand-red w-12 text-center">{point.oddsB.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>
             <p className="text-center text-xs text-brand-text-secondary mt-4">Note: This is a data table view. A graphical chart would be implemented here.</p>
        </div>
    );
};
