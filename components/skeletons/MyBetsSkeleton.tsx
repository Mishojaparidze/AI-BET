import React from 'react';

const BetCardSkeleton = () => (
     <div className="p-3 rounded-lg bg-brand-bg-dark/50 animate-pulse">
        <div className="flex justify-between items-start">
            <div>
                <div className="h-3 w-24 bg-brand-border rounded mb-2"></div>
                <div className="h-4 w-32 bg-brand-border rounded"></div>
            </div>
            <div className="h-4 w-16 bg-brand-border rounded-full"></div>
        </div>
        <div className="mt-2 pt-2 border-t border-brand-border/30 flex justify-between items-end text-sm">
            <div>
                <div className="h-3 w-16 bg-brand-border rounded mb-1"></div>
                <div className="h-4 w-20 bg-brand-border rounded"></div>
            </div>
            <div className="text-right">
                <div className="h-3 w-16 bg-brand-border rounded mb-1"></div>
                <div className="h-4 w-12 bg-brand-border rounded"></div>
            </div>
        </div>
    </div>
);

export const MyBetsSkeleton: React.FC = () => {
  return (
    <section className="bg-brand-bg-light p-6 rounded-lg border border-brand-border shadow-lg">
         <h2 className="text-xl font-bold text-brand-text-primary mb-4">My Bets</h2>
         
         <div className="space-y-3">
             <div className="h-4 w-1/3 bg-brand-border/50 rounded animate-pulse mb-2"></div>
             <BetCardSkeleton />
             <BetCardSkeleton />
         </div>

         <div className="mt-6">
            <div className="h-4 w-1/3 bg-brand-border/50 rounded animate-pulse"></div>
         </div>
    </section>
  );
};
