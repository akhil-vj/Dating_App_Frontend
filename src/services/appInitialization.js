import { StorageService } from './storage';
import { notificationService } from './notification';
import { webViewFixer } from './webViewFix';
import { callPermissionsService } from './callPermissions';

/**
 * Handles application initialization tasks
 */
class AppInitialization {
  constructor() {
    this.isInitialized = false;
    this.failedInitializations = [];
    this.storageAvailable = this._checkStorageAvailability();
  }
  
  /**
   * Initialize all app services
   */
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      console.log('Initializing app services...');
      
      // Fix WebView issues if needed
      webViewFixer.applyFixes();
      
      // Check if storage is available
      if (!this.storageAvailable) {
        this.failedInitializations.push('storage');
        console.error('LocalStorage is not available. App functionality will be limited.');
        
        // Show warning to user
        setTimeout(() => {
          notificationService.showInAppNotification(
            'Storage is not available. Your data will not be saved between sessions.', 
            'warning',
            10000
          );
        }, 1000);
      }
      
      // Check for required APIs
      if (!('mediaDevices' in navigator)) {
        this.failedInitializations.push('mediaDevices');
        console.error('MediaDevices API is not available. Call functionality will be limited.');
      }
      
      // Initialize services that need early setup
      await Promise.all([
        this._initializeMediaPermissions(),
        this._initializeAppState()
      ]);
      
      this.isInitialized = true;
      console.log('App initialization complete');
      
      return {
        success: true,
        failedInitializations: this.failedInitializations
      };
    } catch (error) {
      console.error('Error during app initialization:', error);
      return {
        success: false,
        error: error.message,
        failedInitializations: this.failedInitializations
      };
    }
  }
  
  /**
   * Check if localStorage is available
   */
  _checkStorageAvailability() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  /**
   * Initialize media permissions (check existing permissions)
   */
  async _initializeMediaPermissions() {
    try {
      // Pre-check permissions without prompting user
      await callPermissionsService.checkPermissions({ audio: false, video: false });
    } catch (error) {
      console.warn('Error checking media permissions:', error);
      this.failedInitializations.push('mediaPermissions');
    }
  }
  
  /**
   * Initialize app state from storage
   */
  async _initializeAppState() {
    try {
      // Check if this is first app launch
      const isFirstLaunch = !StorageService.get('APP_INITIALIZED');
      
      if (isFirstLaunch) {
        // Set initial app state
        StorageService.set('APP_INITIALIZED', {
          timestamp: new Date().toISOString(),
          version: process.env.REACT_APP_VERSION || '1.0.0'
        });
      }
      
      return { isFirstLaunch };
    } catch (error) {
      console.error('Error initializing app state:', error);
      this.failedInitializations.push('appState');
      return { isFirstLaunch: false, error };
    }
  }
}

export const appInitialization = new AppInitialization();
