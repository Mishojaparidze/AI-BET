import React, { useState, useEffect } from 'react';
import { type BankrollState, type UserBet } from '../types';
import { BankrollChart } from './BankrollChart';

interface BankrollManagerProps {
    bankroll: BankrollState | null;
    userBets: UserBet[];
    onSetInitialBankroll: (amount: number) => void;
}

const WalletIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12V8H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12v4"/>
        <path d="M4 6v12h12a2 2 0 0 0 2-2V8"/>
        <path d="M18 12a2 2 0 0 0-2 2h-2a2 2 0 0 0-2-2V8h6z"/>
    </svg>
);

const ChevronDownIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

export const BankrollManager: React.FC<BankrollManagerProps> = ({ bankroll, userBets, onSetInitialBankroll }) => {
  const [inputValue, setInputValue] = useState(bankroll?.initial.toString() ?? '1000');
  const [isChartVisible, setIsChartVisible] = useState(false);

  useEffect(() => {
    if (bankroll) {
        setInputValue(bankroll.initial.toString());
    }
  }, [bankroll?.initial]);

  if (!bankroll) {
      return (
        <section className="bg-brand-bg-light p-6 rounded-xl border border-brand-border mb-12 animate-pulse">
            <div className="h-8 bg-brand-border rounded w-3/4 mb-4"></div>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="h-12 bg-brand-border rounded w-full"></div>
                <div className="h-12 bg-brand-border rounded w-full"></div>
                <div className="h-12 bg-brand-border rounded w-full"></div>
            </div>
        </section>
      );
  }

  const { initial, current, totalWagered } = bankroll;
  const profitLoss = current - initial;
  const roi = totalWagered > 0 ? (profitLoss / totalWagered) * 100 : 0;

  const profitLossColor = profitLoss >= 0 ? 'text-brand-green' : 'text-brand-red';
  const progressWidth = initial > 0 ? Math.min((current / initial) * 100, 200) : 0; // Cap width for visual sanity
  const progressColor = profitLoss >= 0 ? 'bg-brand-green' : 'bg-brand-red';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
  };
  
  const handleUpdateClick = () => {
      const amount = parseFloat(inputValue);
      if (!isNaN(amount) && amount > 0) {
          onSetInitialBankroll(amount);
      }
  };
  
  const settledBets = userBets.filter(b => b.status !== 'pending');

  return (
    <section className="bg-brand-bg-light p-6 rounded-xl border border-brand-border mb-12">
      <div className="flex items-center mb-6">
        <WalletIcon className="w-7 h-7 text-brand-green mr-3" />
        <h2 className="text-2xl font-bold text-brand-text-primary">Bankroll Dashboard</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 text-center mb-6">
        <div>
          <p className="text-sm font-medium text-brand-text-secondary">Current Bankroll</p>
          <p className="text-3xl font-black text-brand-text-primary">${current.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-brand-text-secondary">Profit / Loss</p>
          <p className={`text-3xl font-black ${profitLossColor}`}>
            {profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-brand-text-secondary">ROI</p>
          <p className={`text-3xl font-black ${profitLossColor}`}>
            {roi.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="w-full bg-brand-bg-dark rounded-full h-2.5 mb-2">
        <div className={`${progressColor} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${progressWidth}%` }}></div>
      </div>
      <p className="text-xs text-brand-text-secondary text-center">Initial Bankroll: ${initial.toFixed(2)}</p>

      {/* Chart Section */}
      <div className={`grid transition-all duration-500 ease-in-out ${isChartVisible ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
            <BankrollChart initialBankroll={initial} bets={settledBets} />
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-brand-border flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-4">
              <label htmlFor="bankroll" className="text-sm font-medium text-brand-text-secondary">
                Set Initial Bankroll:
              </label>
              <div className="relative">
                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-text-secondary">$</span>
                  <input
                    type="number"
                    id="bankroll"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="w-40 bg-brand-bg-dark border border-brand-border rounded-lg py-2 pl-7 pr-4 focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none"
                  />
              </div>
              <button onClick={handleUpdateClick} className="px-4 py-2 bg-brand-green text-brand-bg-dark font-bold rounded-lg transition-colors duration-300 hover:bg-brand-green/80">
                Update
              </button>
          </div>
          {settledBets.length > 0 && (
            <button 
                onClick={() => setIsChartVisible(!isChartVisible)}
                className="text-sm font-bold text-brand-green hover:text-brand-green/80 flex items-center justify-center"
            >
                {isChartVisible ? 'Hide' : 'Show'} History
                <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform duration-300 ${isChartVisible ? 'rotate-180' : ''}`} />
            </button>
          )}
      </div>

    </section>
  );
};