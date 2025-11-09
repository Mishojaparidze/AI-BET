// hooks/useBets.ts
// FIX: Import React to make types like React.Dispatch available.
import React, { useState } from 'react';
import { type UserBet, type BankrollState } from '../types';
import * as api from '../services/apiService';

export const useBets = (
    setBankroll: React.Dispatch<React.SetStateAction<BankrollState | null>>
) => {
    const [userBets, setUserBets] = useState<UserBet[]>([]);

    const handlePlaceBet = async (bet: UserBet): Promise<boolean> => {
        try {
            const { updatedBankroll, newBet } = await api.placeBet(bet.match, bet.stake, bet.selections);
            setBankroll(updatedBankroll);
            setUserBets(prev => [newBet, ...prev]);
            return true;
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Failed to place bet');
            return false;
        }
    };

    return {
        userBets,
        setUserBets,
        handlePlaceBet,
    };
};
