// hooks/useBankroll.ts
import { useState } from 'react';
import { type BankrollState, type UserSettings } from '../types';
import * as api from '../services/apiService';

export const useBankroll = () => {
    const [bankroll, setBankroll] = useState<BankrollState | null>(null);
    const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

    const handleUpdateSettings = async (settings: UserSettings, callback?: () => void) => {
        const newSettings = await api.updateUserSettings(settings);
        setUserSettings(newSettings);
        if (callback) callback();
    };

    const handleUpdateBankroll = async (newInitial: number) => {
        const { updatedBankroll } = await api.updateInitialBankroll(newInitial);
        setBankroll(updatedBankroll);
        // Note: The logic to clear bets is handled by the calling component/hook
    };

    return {
        bankroll,
        userSettings,
        setBankroll,
        setUserSettings,
        handleUpdateBankroll,
        handleUpdateSettings,
    };
};
