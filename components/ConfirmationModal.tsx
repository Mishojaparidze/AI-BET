import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';

const XIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export const ConfirmationModal: React.FC = () => {
    const { modalState, hideConfirmation } = useStore(state => ({
        modalState: state.confirmationModal,
        hideConfirmation: state.hideConfirmation,
    }));

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                hideConfirmation();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [hideConfirmation]);

    if (!modalState?.isOpen) return null;

    const { title, message, onConfirm } = modalState;

    const handleConfirm = () => {
        onConfirm();
        hideConfirmation();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={hideConfirmation}>
            <div className="bg-brand-bg-light rounded-xl shadow-2xl w-full max-w-md animate-modal-enter" onClick={e => e.stopPropagation()}>
                <header className="p-6 border-b border-brand-border flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-brand-text-primary">{title}</h2>
                    <button onClick={hideConfirmation} className="p-2 rounded-full text-brand-text-secondary hover:bg-brand-border"><XIcon className="w-6 h-6"/></button>
                </header>
                <main className="p-6">
                    <p className="text-brand-text-secondary">{message}</p>
                </main>
                <footer className="p-6 bg-brand-bg-dark/50 rounded-b-xl flex justify-end gap-4">
                     <button onClick={hideConfirmation} className="px-6 py-2 rounded-lg text-brand-text-secondary font-bold hover:bg-brand-border transition-colors">Cancel</button>
                     <button onClick={handleConfirm} className="px-6 py-2 rounded-lg bg-brand-green text-white font-bold hover:bg-opacity-90 transition-colors">Confirm</button>
                </footer>
            </div>
        </div>
    );
};