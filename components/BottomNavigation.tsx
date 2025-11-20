import React from 'react';
import { useStore } from '../store/useStore';

const HomeIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "2"} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75l9-7.5 9 7.5M21 10v9.75a2.25 2.25 0 01-2.25 2.25h-3a2.25 2.25 0 01-2.25-2.25V15h-3v4.5a2.25 2.25 0 01-2.25 2.25h-3a2.25 2.25 0 01-2.25-2.25V10" />
    </svg>
);

const ChartIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "2"} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
    </svg>
);

const ChatIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "2"} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
);

const TicketIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "2"} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
    </svg>
);

export const BottomNavigation: React.FC = () => {
    const { activeView, setActiveView, ticketSelections } = useStore(state => ({
        activeView: state.activeView,
        setActiveView: state.setActiveView,
        ticketSelections: state.ticketSelections
    }));

    const tabs = [
        { id: 'matches', label: 'Matches', icon: HomeIcon },
        { id: 'dashboard', label: 'My Bets', icon: ChartIcon },
        { id: 'chat', label: 'AI Chat', icon: ChatIcon },
        { id: 'ticket', label: 'Ticket', icon: TicketIcon, badge: ticketSelections.length },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-brand-bg-light/80 backdrop-blur-xl border-t border-brand-border/50 pb-safe-bottom z-40">
            <div className="flex justify-around items-center h-14">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveView(tab.id as any)}
                        className={`flex-1 flex flex-col items-center justify-center space-y-1 transition-colors active:scale-95 duration-200 ${
                            activeView === tab.id ? 'text-brand-blue' : 'text-brand-text-secondary'
                        }`}
                    >
                        <div className="relative">
                            <tab.icon active={activeView === tab.id} />
                            {tab.badge ? (
                                <span className="absolute -top-1.5 -right-1.5 bg-brand-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                                    {tab.badge}
                                </span>
                            ) : null}
                        </div>
                        <span className="text-[10px] font-medium">{tab.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};