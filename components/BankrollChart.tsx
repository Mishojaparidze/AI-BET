import React from 'react';

// Note: This is a placeholder for a proper charting library implementation (e.g., Recharts, Chart.js)
// For now, it will display a simplified representation.

interface BankrollChartProps {
    // data would be an array of {date: string, value: number}
}

export const BankrollChart: React.FC<BankrollChartProps> = () => {
    return (
        <div className="bg-brand-bg-dark p-4 rounded-lg">
            <h4 className="font-bold text-brand-text-primary mb-2">Bankroll History</h4>
            <div className="h-48 flex items-center justify-center text-brand-text-secondary">
                <p>Chart coming soon...</p>
            </div>
        </div>
    );
};
