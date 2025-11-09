import React from 'react';

interface TeamLogoProps {
    teamName: string;
    size?: string;
}

/**
 * A simple hash function to generate a consistent color from a string.
 * This ensures that a given team name always gets the same color.
 * @param str The input string (team name).
 * @returns A hex color code.
 */
const stringToColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Simple mixing to get more pleasant, less harsh colors
    const r = (hash & 0xFF) * 0.7 + 50;
    const g = ((hash >> 8) & 0xFF) * 0.7 + 50;
    const b = ((hash >> 16) & 0xFF) * 0.7 + 50;

    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
};

export const TeamLogo: React.FC<TeamLogoProps> = ({ teamName, size = 'w-10 h-10' }) => {
    if (!teamName) return null;

    const bgColor = stringToColor(teamName);
    const initial = teamName.charAt(0).toUpperCase();

    return (
        <div 
            className={`rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${size}`} 
            style={{ backgroundColor: bgColor }}
            title={teamName}
        >
            {initial}
        </div>
    );
};