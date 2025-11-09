import React from 'react';
import { useStore } from '../store/useStore';

const BrainIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.2a.5.5 0 0 0 .5.5h1.2a2.5 2.5 0 0 1 2.5 2.5v1.2a.5.5 0 0 0 .5.5h1.2a2.5 2.5 0 0 1 2.5 2.5v1.2a.5.5 0 0 0 .5.5h1.2a2.5 2.5 0 0 1 0 5h-1.2a.5.5 0 0 0-.5.5v1.2a2.5 2.5 0 0 1-2.5-2.5h-1.2a.5.5 0 0 0-.5.5v1.2a2.5 2.5 0 0 1-5 0v-1.2a.5.5 0 0 0-.5-.5H8.3a2.5 2.5 0 0 1-2.5-2.5v-1.2a.5.5 0 0 0-.5-.5H4.1a2.5 2.5 0 0 1 0-5h1.2a.5.5 0 0 0 .5-.5V8.3a2.5 2.5 0 0 1 2.5-2.5h1.2a.5.5 0 0 0 .5-.5V4.5A2.5 2.5 0 0 1 9.5 2z"/>
    </svg>
);

const CogIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 7 1.4-1.4"/><path d="m6.4 18.4 1.4-1.4"/><path d="M22 12h-2"/><path d="M4 12H2"/><path d="m17 17-1.4 1.4"/><path d="m6.4 6.4 1.4 1.4"/>
    </svg>
);


export const Header: React.FC = () => {
  const { setIsSettingsOpen, activeView, setActiveView } = useStore(state => ({
    setIsSettingsOpen: state.setIsSettingsOpen,
    activeView: state.activeView,
    setActiveView: state.setActiveView,
  }));

  const navItems = [
    { id: 'matches', label: 'Matches' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'chat', label: 'AI Chat' },
  ] as const;

  return (
    <header className="bg-brand-bg-light/80 backdrop-blur-sm shadow-md sticky top-0 z-30 border-b border-brand-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <BrainIcon className="w-8 h-8 text-brand-green" />
            <h1 className="text-xl font-bold tracking-wider text-brand-text-primary hidden sm:block">
              BetGenius AI
            </h1>
        </div>
        
        <nav className="bg-brand-bg-dark p-1.5 rounded-lg flex items-center gap-2">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`px-4 sm:px-6 py-2 text-sm font-bold rounded-md transition-colors ${
                        activeView === item.id 
                        ? 'bg-brand-green text-white shadow-sm' 
                        : 'text-brand-text-secondary hover:bg-brand-border hover:text-brand-text-primary'
                    }`}
                >
                    {item.label}
                </button>
            ))}
        </nav>

        <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full text-brand-text-secondary hover:bg-brand-border hover:text-brand-text-primary transition-colors"
            aria-label="Open Settings"
        >
            <CogIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};