
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-brand-red/10 border-l-4 border-brand-red text-brand-red p-6 rounded-r-lg my-10 max-w-2xl mx-auto" role="alert">
      <p className="font-bold text-lg mb-2">An Error Occurred</p>
      <p>{message}</p>
    </div>
  );
};
