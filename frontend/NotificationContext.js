// NotificationContext.js
import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  return (
    <NotificationContext.Provider value={{ notificationsEnabled, setNotificationsEnabled }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};

export default NotificationProvider;
