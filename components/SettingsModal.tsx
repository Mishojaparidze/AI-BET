import React, { useState, useEffect } from 'react';
import { type UserSettings } from '../types';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newSettings: UserSettings) => void;
    currentSettings: UserSettings;
}

const XCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
);

const ShieldIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);


export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentSettings }) => {
    const [settings, setSettings] = useState<UserSettings>(currentSettings);

    useEffect(() => {
        setSettings(currentSettings);
    }, [currentSettings]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({
            maxStakePerBet: Number(settings.maxStakePerBet),
            maxDailyStake: Number(settings.maxDailyStake)
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={handleOverlayClick}
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-brand-bg-light w-full max-w-lg rounded-2xl border-2 border-brand-yellow/50 shadow-2xl shadow-brand-yellow/10 flex flex-col overflow-hidden">
                <header className="p-6 border-b border-brand-border flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <ShieldIcon className="w-7 h-7 text-brand-yellow" />
                        <h2 className="text-2xl font-bold text-brand-text-primary">Responsible Gambling Settings</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-brand-border transition-colors">
                        <XCircleIcon className="w-6 h-6 text-brand-text-secondary"/>
                    </button>
                </header>
                
                <main className="p-8 space-y-6">
                    <p className="text-brand-text-secondary">
                        Set your personal limits to ensure you stay in control. These settings can be changed at any time.
                    </p>
                    <div>
                        <label htmlFor="maxStakePerBet" className="block text-sm font-bold text-brand-text-primary mb-2">Max Stake Per Bet</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-text-secondary">$</span>
                             <input
                                type="number"
                                id="maxStakePerBet"
                                name="maxStakePerBet"
                                value={settings.maxStakePerBet}
                                onChange={handleInputChange}
                                className="w-full bg-brand-bg-dark border border-brand-border rounded-lg py-2 pl-7 pr-4 focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none"
                             />
                        </div>
                         <p className="text-xs text-brand-text-secondary mt-1">The maximum amount you can place on a single bet or ticket.</p>
                    </div>
                     <div>
                        <label htmlFor="maxDailyStake" className="block text-sm font-bold text-brand-text-primary mb-2">Max Daily Wager Limit</label>
                         <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-text-secondary">$</span>
                             <input
                                type="number"
                                id="maxDailyStake"
                                name="maxDailyStake"
                                value={settings.maxDailyStake}
                                onChange={handleInputChange}
                                className="w-full bg-brand-bg-dark border border-brand-border rounded-lg py-2 pl-7 pr-4 focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none"
                             />
                        </div>
                         <p className="text-xs text-brand-text-secondary mt-1">The total maximum amount you can wager in a single day.</p>
                    </div>
                </main>

                <footer className="bg-brand-bg-dark/50 p-6 border-t border-brand-border mt-auto flex-shrink-0 flex justify-end items-center gap-4">
                     <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-brand-border text-brand-text-primary font-bold rounded-lg transition-colors duration-300 hover:bg-brand-border/80"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-6 py-2 bg-brand-yellow text-brand-bg-dark font-bold rounded-lg transition-colors duration-300 hover:bg-brand-yellow/80"
                    >
                        Save Limits
                    </button>
                </footer>

            </div>
        </div>
    );
};