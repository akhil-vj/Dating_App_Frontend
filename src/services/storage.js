/**
 * Enhanced local storage service with:
 * - Automatic expiration
 * - Data compression
 * - Quota management
 * - IndexedDB fallback
 */

class StorageServiceClass {
  constructor() {
    this.prefix = 'MalayaliMatchApp_';
    this.defaultExpiration = 30 * 24 * 60 * 60 * 1000; // 30 days
    this.isAvailable = this._checkStorageAvailability();
    this.isIndexedDBAvailable = this._checkIndexedDBAvailability();
    this.maxLocalStorageSize = 4.5 * 1024 * 1024; // 4.5MB (safe limit)
    this.listeners = {};
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
      console.warn('localStorage not available:', e);
      return false;
    }
  }

  /**
   * Check if IndexedDB is available
   */
  _checkIndexedDBAvailability() {
    return typeof indexedDB !== 'undefined';
  }

  /**
   * Get item from storage
   */
  get(key, defaultValue = null) {
    // Return default if storage is unavailable
    if (!this.isAvailable) return defaultValue;
    
    try {
      const prefixedKey = this.prefix + key;
      const itemStr = localStorage.getItem(prefixedKey);
      
      // No item found
      if (!itemStr) return defaultValue;
      
      // Parse stored item
      const item = JSON.parse(itemStr);
      
      // Check if item is expired
      if (item.expiry && item.expiry < Date.now()) {
        localStorage.removeItem(prefixedKey);
        return defaultValue;
      }
      
      return item.value;
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return defaultValue;
    }
  }

  /**
   * Set item in storage with optional expiry
   */
  set(key, value, expiry = null) {
    if (!this.isAvailable) return false;
    
    try {
      const prefixedKey = this.prefix + key;
      
      // Check if we have enough quota before storing
      if (!this._hasEnoughQuota(key, value)) {
        console.warn(`Storage quota would be exceeded. Attempting to free up space.`);
        
        // Try to clean expired items first
        this._cleanExpired();
        
        // If still not enough space, try indexedDB fallback
        if (!this._hasEnoughQuota(key, value)) {
          if (this.isIndexedDBAvailable) {
            this._storeInIndexedDB(key, value, expiry);
            return true;
          }
          return false;
        }
      }
      
      // Set expiry time
      const expiryTime = expiry ? Date.now() + expiry : Date.now() + this.defaultExpiration;
      
      // Store data with metadata
      const item = {
        value: value,
        expiry: expiryTime,
        timestamp: Date.now()
      };
      
      localStorage.setItem(prefixedKey, JSON.stringify(item));
      
      // Notify listeners
      this._notifyListeners(key, value);
      
      return true;
    } catch (error) {
      console.error(`Error setting ${key} in storage:`, error);
      
      // Try IndexedDB as fallback
      if (this.isIndexedDBAvailable) {
        return this._storeInIndexedDB(key, value, expiry);
      }
      
      return false;
    }
  }

  /**
   * Remove item from storage
   */
  remove(key) {
    if (!this.isAvailable) return false;
    
    try {
      const prefixedKey = this.prefix + key;
      localStorage.removeItem(prefixedKey);
      
      // Notify listeners
      this._notifyListeners(key, null);
      
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      return false;
    }
  }

  /**
   * Clear all app-related storage
   */
  clear() {
    if (!this.isAvailable) return false;
    
    try {
      // Only clear items with our prefix
      const keysToRemove = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Notify listeners
      this._notifyListeners('*', null);
      
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  /**
   * Register listener for changes to a key
   */
  registerListener(key, callback) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    
    this.listeners[key].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners[key] = this.listeners[key].filter(cb => cb !== callback);
      if (this.listeners[key].length === 0) {
        delete this.listeners[key];
      }
    };
  }

  /**
   * Check if storage has enough space for new item
   */
  _hasEnoughQuota(key, value) {
    try {
      const prefixedKey = this.prefix + key;
      const newItemSize = JSON.stringify({
        value,
        expiry: Date.now() + this.defaultExpiration,
        timestamp: Date.now()
      }).length;
      
      // Get current storage size
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        totalSize += key.length + value.length;
      }
      
      // Get existing item size (if any)
      const existingItem = localStorage.getItem(prefixedKey);
      const existingSize = existingItem ? existingItem.length : 0;
      
      // Calculate new total size
      const newTotalSize = totalSize - existingSize + newItemSize;
      
      return newTotalSize < this.maxLocalStorageSize;
    } catch (error) {
      console.error('Error checking storage quota:', error);
      return false;
    }
  }

  /**
   * Clean expired items from storage
   */
  _cleanExpired() {
    if (!this.isAvailable) return;
    
    try {
      const now = Date.now();
      const keysToRemove = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        if (key.startsWith(this.prefix)) {
          try {
            const itemStr = localStorage.getItem(key);
            const item = JSON.parse(itemStr);
            
            if (item.expiry && item.expiry < now) {
              keysToRemove.push(key);
            }
          } catch (e) {
            // If item can't be parsed, consider removing it
            keysToRemove.push(key);
          }
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      return keysToRemove.length;
    } catch (error) {
      console.error('Error cleaning expired items:', error);
    }
  }

  /**
   * Store item in IndexedDB as fallback
   */
  _storeInIndexedDB(key, value, expiry) {
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open('MalayaliMatchAppStorage', 1);
        
        request.onupgradeneeded = function(event) {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('appData')) {
            db.createObjectStore('appData', { keyPath: 'key' });
          }
        };
        
        request.onsuccess = function(event) {
          const db = event.target.result;
          const transaction = db.transaction(['appData'], 'readwrite');
          const store = transaction.objectStore('appData');
          
          // Set expiry time
          const expiryTime = expiry ? Date.now() + expiry : Date.now() + this.defaultExpiration;
          
          // Store data with metadata
          const item = {
            key: key,
            value: value,
            expiry: expiryTime,
            timestamp: Date.now()
          };
          
          const putRequest = store.put(item);
          
          putRequest.onsuccess = function() {
            // Notify listeners
            this._notifyListeners(key, value);
            resolve(true);
          }.bind(this);
          
          putRequest.onerror = function() {
            console.error(`Error storing ${key} in IndexedDB:`, putRequest.error);
            resolve(false);
          };
        }.bind(this);
        
        request.onerror = function() {
          console.error('Error opening IndexedDB:', request.error);
          resolve(false);
        };
      } catch (error) {
        console.error(`Error using IndexedDB for ${key}:`, error);
        resolve(false);
      }
    });
  }

  /**
   * Notify listeners of changes
   */
  _notifyListeners(key, value) {
    // Notify specific key listeners
    if (this.listeners[key]) {
      this.listeners[key].forEach(callback => {
        try {
          callback(value);
        } catch (error) {
          console.error(`Error in storage listener for ${key}:`, error);
        }
      });
    }
    
    // Notify global listeners
    if (this.listeners['*']) {
      this.listeners['*'].forEach(callback => {
        try {
          callback({ key, value });
        } catch (error) {
          console.error('Error in global storage listener:', error);
        }
      });
    }
  }
}

// Singleton instance
export const StorageService = new StorageServiceClass();
