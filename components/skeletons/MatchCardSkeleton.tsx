import React from 'react';

export const MatchCardSkeleton: React.FC = () => {
    return (
        <div className="bg-brand-bg-light border border-brand-border rounded-lg shadow-lg animate-pulse">
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="h-4 bg-brand-border/50 rounded w-1/3 mb-2"></div>
                        <div className="h-6 bg-brand-border/50 rounded w-3/4"></div>
                        <div className="h-4 bg-brand-border/50 rounded w-1/2 mt-2"></div>
                    </div>
                    <div className="h-6 w-20 bg-brand-border/50 rounded-full"></div>
                </div>

                <div className="mt-4 bg-brand-bg-dark p-4 rounded-lg flex items-center justify-between">
                    <div>
                        <div className="h-5 bg-brand-border/50 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-brand-border/50 rounded w-1/3"></div>
                    </div>
                    <div className="text-right">
                        <div className="h-8 w-16 bg-brand-border/50 rounded"></div>
                    </div>
                </div>
            </div>
            <div className="border-t border-brand-border px-4 py-3 flex justify-end items-center gap-4 bg-brand-bg-light/50 rounded-b-lg">
                <div className="h-5 w-24 bg-brand-border/50 rounded"></div>
                <div className="h-10 w-32 bg-brand-border/50 rounded-md"></div>
            </div>
        </div>
    );
};
