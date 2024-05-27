// src/NotificationContext.js
import React, { createContext, useState, useContext } from 'react';
import '../styling/notifications.css'
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type) => {
        const id = new Date().getTime();
        setNotifications([...notifications, { id, message, type }]);

        // Automatically remove the notification after 3 seconds
        setTimeout(() => {
            setNotifications((currentNotifications) =>
                currentNotifications.filter((notification) => notification.id !== id)
            );
        }, 3000);
    };

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <div className="notification-container">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`notification ${notification.type}`}
                    >
                        {notification.message}
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
