
import React from 'react';
import { ConfidenceTier } from '../types';

interface ConfidenceBadgeProps {
  confidence: ConfidenceTier;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidence }) => {
  const getBadgeStyles = () => {
    switch (confidence) {
      case ConfidenceTier.High:
        return 'bg-brand-green/20 text-brand-green border border-brand-green/30';
      case ConfidenceTier.Medium:
        return 'bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30';
      case ConfidenceTier.Low:
        return 'bg-brand-red/20 text-brand-red border border-brand-red/30';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${getBadgeStyles()}`}>
      {confidence}
    </div>
  );
};
