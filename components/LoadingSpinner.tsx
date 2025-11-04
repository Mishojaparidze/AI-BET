
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
       <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-green mb-4"></div>
       <p className="text-lg font-semibold text-brand-text-primary">Consulting the AI Oracle...</p>
       <p className="text-brand-text-secondary">Analyzing stats and crunching numbers.</p>
    </div>
  );
};
