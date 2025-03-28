/**
 * This module applies fixes for WebRTC functionality in WebView environments
 * that might have issues with proper WebRTC implementation.
 */

class WebViewFixer {
  constructor() {
    this.isWebView = this.detectWebView();
    this.fixesApplied = false;
  }
  
  /**
   * Detects if the app is running inside a WebView
   */
  detectWebView() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    return (
      // Android WebView
      /wv/.test(userAgent) ||
      // Check for specific android webview indicators
      (/android/.test(userAgent) && /version\/[\d.]+/.test(userAgent) && 
       /safari/.test(userAgent) === false) ||
      // iOS WebView
      /crios|fxios|edgios/.test(userAgent) ||
      // Check for specific indicators of mobile apps
      (window.navigator.standalone === true) ||
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
    );
  }
  
  /**
   * Apply all available fixes for WebRTC in WebViews
   */
  applyFixes() {
    if (this.fixesApplied) return;
    
    if (this.isWebView) {
      console.log('WebView detected, applying WebRTC compatibility fixes...');
      this.fixPermissionsAPI();
      this.fixMediaDevices();
      
      // Add polyfills and fix browser-specific issues
      this.polyfillSetSinkId();
      
      this.fixesApplied = true;
    }
  }
  
  /**
   * Fix Permissions API for older WebView implementations
   */
  fixPermissionsAPI() {
    if (!navigator.permissions) {
      console.log('Adding Permissions API polyfill for WebView');
      navigator.permissions = {
        query: async (params) => {
          // Simple polyfill that always returns 'prompt' state
          return {
            state: 'prompt',
            addEventListener: () => {},
            removeEventListener: () => {}
          };
        }
      };
    }
  }
  
  /**
   * Ensure MediaDevices API is available
   */
  fixMediaDevices() {
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }
    
    // Polyfill getUserMedia
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        const getUserMedia = navigator.webkitGetUserMedia || 
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia;
                            
        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }
        
        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }
    
    // Polyfill enumerateDevices
    if (navigator.mediaDevices.enumerateDevices === undefined) {
      navigator.mediaDevices.enumerateDevices = function() {
        return Promise.resolve([]);
      };
    }
  }
  
  /**
   * Add setSinkId polyfill for browsers without audio output selection
   */
  polyfillSetSinkId() {
    if (!HTMLMediaElement.prototype.setSinkId) {
      console.log('Adding setSinkId polyfill');
      HTMLMediaElement.prototype.setSinkId = function(sinkId) {
        // This is a stub implementation that always succeeds
        // but doesn't actually change the output device
        console.warn('setSinkId is not supported in this browser');
        return Promise.resolve();
      };
    }
  }
}

// Create and export instance
export const webViewFixer = new WebViewFixer();

// Apply fixes immediately on import
webViewFixer.applyFixes();

// Re-apply fixes after visibility changes (for some webviews that reset on visibility change)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    webViewFixer.applyFixes();
  }
});
