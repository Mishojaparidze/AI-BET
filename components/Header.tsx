import React from 'react';
import { useStore } from '../store/useStore';

const CogIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 7 1.4-1.4"/><path d="m6.4 18.4 1.4-1.4"/><path d="M22 12h-2"/><path d="M4 12H2"/><path d="m17 17-1.4 1.4"/><path d="m6.4 6.4 1.4 1.4"/>
    </svg>
);

export const Header: React.FC = () => {
  const { setIsSettingsOpen } = useStore(state => ({
    setIsSettingsOpen: state.setIsSettingsOpen,
  }));

  return (
    <header className="bg-brand-bg-light/80 backdrop-blur-xl border-b border-brand-border/50 sticky top-0 z-30 pt-safe-top">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="w-8"></div> {/* Spacer for balance */}
        
        <h1 className="text-[17px] font-semibold text-brand-text-primary tracking-tight">
          BetGenius
        </h1>

        <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-brand-blue active:opacity-50 transition-opacity"
            aria-label="Open Settings"
        >
            <CogIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};