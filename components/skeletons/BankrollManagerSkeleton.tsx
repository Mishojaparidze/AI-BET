import React from 'react';

export const BankrollManagerSkeleton: React.FC = () => {
    const SkeletonBar: React.FC<{width: string, height?: string}> = ({width, height = 'h-5'}) => (
        <div className={`bg-brand-border/50 rounded animate-pulse ${width} ${height}`}></div>
    );

  return (
    <div className="bg-brand-bg-light p-6 rounded-lg border border-brand-border shadow-lg">
        <h2 className="text-xl font-bold text-brand-text-primary mb-1">Bankroll</h2>
        <p className="text-brand-text-secondary mb-4">Your betting finance overview.</p>
        
        <div className="mb-6">
            <SkeletonBar width="w-1/3" height="h-4 mb-2" />
            <SkeletonBar width="w-1/2" height="h-10" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div>
                <SkeletonBar width="w-2/3 mb-1" height="h-4" />
                <SkeletonBar width="w-1/2" />
            </div>
             <div>
                <SkeletonBar width="w-2/3 mb-1" height="h-4" />
                <SkeletonBar width="w-1/2" />
            </div>
        </div>

        <div className="mb-4">
            <div className="flex justify-between items-center text-xs text-brand-text-secondary mb-1">
                 <SkeletonBar width="w-1/4" height="h-3" />
                 <SkeletonBar width="w-1/3" height="h-3" />
            </div>
            <SkeletonBar width="w-full" height="h-2.5" />
        </div>
        
        <div className="border-t border-brand-border pt-4 mt-4">
             <SkeletonBar width="w-1/3 mb-2" height="h-4" />
             <div className="bg-brand-bg-dark p-4 rounded-lg flex justify-around text-center">
                <div>
                     <SkeletonBar width="w-16 mb-1" height="h-3" />
                     <SkeletonBar width="w-10" height="h-6" />
                </div>
                <div className="border-l border-brand-border"></div>
                <div>
                     <SkeletonBar width="w-16 mb-1" height="h-3" />
                     <SkeletonBar width="w-10" height="h-6" />
                </div>
            </div>
        </div>
    </div>
  );
};
