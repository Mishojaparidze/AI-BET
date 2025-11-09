import React, { useEffect, useState } from 'react';
import { type Notification as NotificationTypeContent } from '../types';

// Icons
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const AlertTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

interface NotificationProps {
    notification: NotificationTypeContent;
    onDismiss: (id: string) => void;
}

const NOTIFICATION_CONFIG = {
    success: { icon: <CheckCircleIcon />, barClass: 'bg-brand-green', textClass: 'text-brand-green' },
    error: { icon: <AlertTriangleIcon />, barClass: 'bg-brand-red', textClass: 'text-brand-red' },
    info: { icon: <InfoIcon />, barClass: 'bg-sky-500', textClass: 'text-sky-400' },
};

export const Notification: React.FC<NotificationProps> = ({ notification, onDismiss }) => {
    const { id, type, title, message } = notification;
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(() => onDismiss(id), 400); // Wait for exit animation
        }, 5000);

        return () => clearTimeout(timer);
    }, [id, onDismiss]);
    
    const handleDismiss = () => {
        setExiting(true);
        setTimeout(() => onDismiss(id), 400);
    };

    const config = NOTIFICATION_CONFIG[type];

    return (
        <div className={`w-full max-w-sm bg-brand-bg-light shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${exiting ? 'animate-toast-exit' : 'animate-toast-enter'}`}>
            <div className="p-4">
                <div className="flex items-start">
                    <div className={`flex-shrink-0 ${config.textClass}`}>
                        {config.icon}
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-bold text-brand-text-primary">{title}</p>
                        <p className="mt-1 text-sm text-brand-text-secondary">{message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button onClick={handleDismiss} className="rounded-md inline-flex text-brand-text-secondary hover:text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green">
                            <span className="sr-only">Close</span>
                            <XIcon />
                        </button>
                    </div>
                </div>
            </div>
            <div className={`h-1 ${config.barClass} w-full`}></div>
        </div>
    );
};
