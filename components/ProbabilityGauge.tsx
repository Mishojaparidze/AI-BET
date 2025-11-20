
import React from 'react';

interface ProbabilityGaugeProps {
    percentage: number; // 0 to 100
    size?: number;
}

export const ProbabilityGauge: React.FC<ProbabilityGaugeProps> = ({ percentage, size = 40 }) => {
    const radius = (size - 4) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    
    let color = 'text-brand-red';
    if (percentage > 65) color = 'text-brand-green';
    else if (percentage > 45) color = 'text-brand-yellow';

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90 w-full h-full">
                {/* Background Circle */}
                <circle
                    className="text-brand-bg-elevated"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress Circle */}
                <circle
                    className={`${color} transition-all duration-1000 ease-out`}
                    strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <span className="absolute text-[9px] font-bold text-brand-text-primary">
                {percentage}%
            </span>
        </div>
    );
};
