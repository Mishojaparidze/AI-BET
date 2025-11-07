import React from 'react';

const BrainIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.2a.5.5 0 0 0 .5.5h1.2a2.5 2.5 0 0 1 2.5 2.5v1.2a.5.5 0 0 0 .5.5h1.2a2.5 2.5 0 0 1 2.5 2.5v1.2a.5.5 0 0 0 .5.5h1.2a2.5 2.5 0 0 1 0 5h-1.2a.5.5 0 0 0-.5.5v1.2a2.5 2.5 0 0 1-2.5 2.5h-1.2a.5.5 0 0 0-.5.5v1.2a2.5 2.5 0 0 1-5 0v-1.2a.5.5 0 0 0-.5-.5H8.3a2.5 2.5 0 0 1-2.5-2.5v-1.2a.5.5 0 0 0-.5-.5H4.1a2.5 2.5 0 0 1 0-5h1.2a.5.5 0 0 0 .5-.5V8.3a2.5 2.5 0 0 1 2.5-2.5h1.2a.5.5 0 0 0 .5-.5V4.5A2.5 2.5 0 0 1 9.5 2z"/>
    </svg>
);

const CogIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 7 1.4-1.4"/><path d="m6.4 18.4 1.4-1.4"/><path d="M22 12h-2"/><path d="M4 12H2"/><path d="m17 17-1.4 1.4"/><path d="m6.4 6.4 1.4 1.4"/>
    </svg>
);


interface HeaderProps {
    onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="bg-brand-bg-light shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
         <div className="w-10"></div> {/* Spacer */}
        <div className="flex items-center justify-center">
            <BrainIcon className="w-8 h-8 text-brand-green mr-3" />
            <h1 className="text-2xl font-bold tracking-wider text-brand-text-primary">
              BetGenius AI
            </h1>
        </div>
        <button 
            onClick={onOpenSettings}
            className="p-2 rounded-full text-brand-text-secondary hover:bg-brand-border hover:text-brand-text-primary transition-colors"
            aria-label="Open Settings"
        >
            <CogIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};