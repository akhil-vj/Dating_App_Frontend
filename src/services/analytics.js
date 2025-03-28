/**
 * Service to handle analytics tracking
 */
class AnalyticsService {
  constructor() {
    this.events = [];
    this.userProperties = {};
    this.sessionId = this._generateSessionId();
    this.isEnabled = localStorage.getItem('analyticsEnabled') !== 'false';
    this.initialized = false;
    this.init();
  }
  
  // Initialize analytics service
  init() {
    if (this.initialized) return;
    
    // Track session start
    this.track('session_start', {
      session_id: this.sessionId,
      referrer: document.referrer || 'direct',
      user_agent: navigator.userAgent
    });
    
    // Set up listener for page visibility changes
    document.addEventListener('visibilitychange', this._handleVisibilityChange.bind(this));
    
    // Set up listener for unload events
    window.addEventListener('beforeunload', this._handleUnload.bind(this));
    
    this.initialized = true;
  }
  
  // Enable or disable analytics
  setEnabled(enabled) {
    this.isEnabled = enabled;
    localStorage.setItem('analyticsEnabled', enabled);
  }
  
  // Set user properties
  setUserProperties(properties) {
    this.userProperties = {
      ...this.userProperties,
      ...properties
    };
  }
  
  // Track an event
  track(eventName, properties = {}) {
    if (!this.isEnabled) return;
    
    const event = {
      name: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        session_id: this.sessionId
      },
      user_properties: this.userProperties
    };
    
    // Store event locally
    this.events.push(event);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics event:', event);
    }
    
    // In a real app, you'd send this to your analytics service
    this._sendToAnalyticsService(event);
  }
  
  // Track a page view
  trackPageView(pageName, properties = {}) {
    this.track('page_view', {
      page_name: pageName,
      url: window.location.href,
      ...properties
    });
  }
  
  // Track a user action
  trackAction(actionName, properties = {}) {
    this.track('user_action', {
      action_name: actionName,
      ...properties
    });
  }
  
  // Track an error
  trackError(errorMessage, properties = {}) {
    this.track('error', {
      error_message: errorMessage,
      ...properties
    });
  }
  
  // Handle visibility change to track engagement time
  _handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      this.track('app_background', {
        time_spent: this._getSessionDuration()
      });
    } else if (document.visibilityState === 'visible') {
      this.track('app_foreground');
    }
  }
  
  // Handle page unload
  _handleUnload() {
    // Attempt to send final events when page is closed
    this.track('session_end', {
      session_duration: this._getSessionDuration()
    });
    
    // Use sendBeacon to ensure data is sent before page close
    if (navigator.sendBeacon) {
      const data = {
        events: this.events.slice(-10), // Send last 10 events
        session_id: this.sessionId
      };
      
      navigator.sendBeacon('/api/analytics', JSON.stringify(data));
    }
  }
  
  // Get session duration in seconds
  _getSessionDuration() {
    const sessionStart = parseInt(this.sessionId.split('-')[0], 10);
    return Math.floor((Date.now() - sessionStart) / 1000);
  }
  
  // Generate a unique session ID
  _generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
  
  // Send to analytics service (mock implementation)
  _sendToAnalyticsService(event) {
    // In a real app, you would send this to your analytics backend
    // For now, we just accumulate events locally
    
    // Example implementation that would send to a real service:
    /*
    if (this.queue.length >= 10 || event.name === 'session_end') {
      const payload = {
        events: this.queue,
        device_info: {
          screen_size: `${window.innerWidth}x${window.innerHeight}`,
          platform: navigator.platform,
          language: navigator.language
        }
      };
      
      // Use fetch with keepalive for better reliability
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(err => console.error('Failed to send analytics:', err));
      
      this.queue = [];
    }
    */
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService();
