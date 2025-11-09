import React from 'react';
import { useStore } from '../store/useStore';
import { Notification } from './Notification';

export const NotificationProvider: React.FC = () => {
    const notifications = useStore(state => state.notifications);
    const removeNotification = useStore(state => state.removeNotification);

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div 
            aria-live="assertive" 
            className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
        >
            <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                {notifications.map((notification) => (
                    <Notification
                        key={notification.id}
                        notification={notification}
                        onDismiss={removeNotification}
                    />
                ))}
            </div>
        </div>
    );
};
