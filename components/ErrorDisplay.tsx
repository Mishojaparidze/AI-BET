import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

const AlertTriangleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red p-6 rounded-lg flex flex-col items-center justify-center text-center">
        <AlertTriangleIcon className="w-12 h-12 mb-4" />
        <h3 className="text-xl font-bold mb-2">An Error Occurred</h3>
        <p className="max-w-md">{message}</p>
        {onRetry && (
            <button
            onClick={onRetry}
            className="mt-6 bg-brand-red text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-80 transition-colors"
            >
            Try Again
            </button>
        )}
    </div>
  );
};
