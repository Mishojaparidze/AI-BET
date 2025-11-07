import React from 'react';

interface ResponsibleGamblingBannerProps {
    onDismiss: () => void;
    onOpenSettings: () => void;
}

const AlertTriangleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

const XIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export const ResponsibleGamblingBanner: React.FC<ResponsibleGamblingBannerProps> = ({ onDismiss, onOpenSettings }) => {
    return (
        <div className="bg-brand-yellow/10 border-b-2 border-brand-yellow/30 text-brand-yellow z-20">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                    <AlertTriangleIcon className="w-6 h-6 mr-3" />
                    <p className="text-sm font-medium">
                        Betting should be fun. Set your limits and play responsibly.
                        <button onClick={onOpenSettings} className="font-bold underline ml-2 hover:text-brand-yellow/80">
                            Manage Settings
                        </button>
                    </p>
                </div>
                <button onClick={onDismiss} className="p-1 rounded-full hover:bg-brand-yellow/20" aria-label="Dismiss banner">
                    <XIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};