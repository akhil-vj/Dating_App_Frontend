class NotificationService {
  constructor() {
    this.listeners = [];
    this.permission = 'default';
    this.init();
  }
  
  init() {
    // Check if browser supports notifications
    if ('Notification' in window) {
      this.permission = Notification.permission;
      
      // Request permission if not granted
      if (this.permission !== 'granted' && this.permission !== 'denied') {
        this.requestPermission();
      }
    }
  }
  
  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }
  
  // Show a browser notification
  showNotification(title, options = {}) {
    if (this.permission !== 'granted') {
      console.log('Notification permission not granted');
      return false;
    }
    
    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
        if (options.onClick) options.onClick();
      };
      
      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  }
  
  // Show in-app notification
  showInAppNotification(message, type = 'success', duration = 3000) {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    
    // Notify all registered components
    this.listeners.forEach(listener => {
      listener(notification);
    });
    
    return notification.id;
  }
  
  // Register listener for in-app notifications
  registerListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
  
  // Remove a specific notification by ID
  removeNotification(id) {
    // This method would be used by a notifications manager component
  }
}

export const notificationService = new NotificationService();
