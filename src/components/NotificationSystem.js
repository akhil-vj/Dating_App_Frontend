import React, { useState, useEffect, createContext, useContext } from 'react';
import { Check, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';
import { notificationService } from '../services/notification';

// Create a context for notifications
export const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Register with notification service
    const unsubscribe = notificationService.registerListener(notification => {
      // Add notification to state
      setNotifications(prev => [...prev, notification]);
      
      // Set timeout to remove notification after its duration
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, notification.duration || 3000);
    });
    
    // Save the notification service to window for global access
    window.notificationService = notificationService;
    
    return unsubscribe;
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  // Helper to show notifications directly from components
  const showNotification = (message, type = 'info', duration = 3000) => {
    notificationService.showInAppNotification(message, type, duration);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      {/* Notification display */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col space-y-2">
        {notifications.map(notification => (
          <Notification 
            key={notification.id} 
            notification={notification} 
            onClose={() => removeNotification(notification.id)} 
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

const Notification = ({ notification, onClose }) => {
  const { id, message, type } = notification;
  
  let bgColor = 'bg-blue-500';
  let icon = <Info size={20} className="text-white" />;
  
  // Different styles based on type
  switch (type) {
    case 'success':
      bgColor = 'bg-green-500';
      icon = <Check size={20} className="text-white" />;
      break;
    case 'error':
      bgColor = 'bg-red-500';
      icon = <AlertCircle size={20} className="text-white" />;
      break;
    case 'warning':
      bgColor = 'bg-amber-500';
      icon = <AlertTriangle size={20} className="text-white" />;
      break;
    default: // info
      bgColor = 'bg-blue-500';
      icon = <Info size={20} className="text-white" />;
  }

  return (
    <div 
      className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center max-w-xs animate-fade-in`}
      role="alert"
    >
      <div className="mr-3">
        {icon}
      </div>
      <div className="flex-1 pr-3">
        {message}
      </div>
      <button 
        onClick={onClose}
        className="text-white/80 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};
