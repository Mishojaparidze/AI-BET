import React, { useState, useEffect, useMemo } from 'react';
import { UserSettings } from '../types';

interface SettingsModalProps {
    currentSettings: UserSettings;
    initialBankroll: number;
    onClose: () => void;
    onSave: (newSettings: UserSettings) => void;
    onUpdateBankroll: (newInitial: number) => void;
}

const XIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
)

const InputField: React.FC<{
    label: string;
    id: string;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}> = ({ label, id, value, onChange, error }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary mb-1">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-text-secondary">$</span>
            <input 
                type="number" 
                id={id}
                value={value}
                onChange={onChange}
                className={`w-full bg-brand-bg-dark border rounded-md pl-7 pr-4 py-2 text-brand-text-primary focus:ring-2 focus:ring-brand-green focus:border-brand-green ${error ? 'border-brand-red' : 'border-brand-border'}`}
            />
        </div>
        {error && <p className="text-xs text-brand-red mt-1">{error}</p>}
    </div>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({ currentSettings, initialBankroll, onClose, onSave, onUpdateBankroll }) => {
    const [settings, setSettings] = useState(currentSettings);
    const [bankroll, setBankroll] = useState(initialBankroll);

    const errors = useMemo(() => {
        const newErrors: { [key: string]: string } = {};
        if (bankroll <= 0) {
            newErrors.initialBankroll = "Bankroll must be greater than zero.";
        }
        if (settings.maxStakePerBet <= 0) {
            newErrors.maxStakePerBet = "Max stake must be greater than zero.";
        }
        if (settings.maxDailyStake <= 0) {
            newErrors.maxDailyStake = "Daily stake limit must be greater than zero.";
        }
        if (settings.maxStakePerBet > settings.maxDailyStake) {
            newErrors.maxStakePerBet = "Max stake cannot exceed the daily limit.";
        }
        return newErrors;
    }, [bankroll, settings]);

    const isValid = Object.keys(errors).length === 0;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => ({...prev, [e.target.id]: Number(e.target.value)}));
    }
    
    const handleSave = () => {
        if (!isValid) return;
        onSave(settings);
        if (bankroll !== initialBankroll) {
            onUpdateBankroll(bankroll);
        }
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-brand-bg-light rounded-xl shadow-2xl w-full max-w-md animate-modal-enter" onClick={e => e.stopPropagation()}>
                <header className="p-6 border-b border-brand-border flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-brand-text-primary">Settings</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-brand-text-secondary hover:bg-brand-border"><XIcon className="w-6 h-6"/></button>
                </header>
                <main className="p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-brand-text-primary mb-2">Bankroll Management</h3>
                        <InputField label="Initial Bankroll (resets bets)" id="initialBankroll" value={bankroll} onChange={(e) => setBankroll(Number(e.target.value))} error={errors.initialBankroll} />
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-brand-text-primary mb-2">Betting Limits</h3>
                        <div className="space-y-4">
                            <InputField label="Max Stake Per Bet" id="maxStakePerBet" value={settings.maxStakePerBet} onChange={handleSettingsChange} error={errors.maxStakePerBet}/>
                            <InputField label="Max Daily Stake" id="maxDailyStake" value={settings.maxDailyStake} onChange={handleSettingsChange} error={errors.maxDailyStake}/>
                        </div>
                    </div>
                </main>
                <footer className="p-6 bg-brand-bg-dark/50 rounded-b-xl flex justify-end gap-4">
                     <button onClick={onClose} className="px-6 py-2 rounded-lg text-brand-text-secondary font-bold hover:bg-brand-border transition-colors">Cancel</button>
                     <button onClick={handleSave} disabled={!isValid} className="px-6 py-2 rounded-lg bg-brand-green text-white font-bold hover:bg-opacity-90 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">Save Changes</button>
                </footer>
            </div>
        </div>
    );
};