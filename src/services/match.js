import { StorageService } from './storage';
import { notificationService } from './notification';

class MatchService {
  constructor() {
    this.likes = StorageService.get('LIKES') || [];
    this.matches = StorageService.get('MATCHES') || [];
    this.passes = StorageService.get('PASSES') || [];
    this.listeners = {
      likes: [],
      matches: [],
      passes: []
    };
  }
  
  // Add a profile to likes
  addLike(profile) {
    const like = {
      ...profile,
      timestamp: new Date().toISOString()
    };
    
    this.likes = [...this.likes, like];
    StorageService.set('LIKES', this.likes);
    
    // Check if this is a match
    const isMatch = profile.likesYou === true;
    
    if (isMatch) {
      this.addMatch(profile);
    }
    
    // Notify listeners
    this._notifyListeners('likes', this.likes);
    
    return isMatch;
  }
  
  // Add a profile to matches
  addMatch(profile) {
    const match = {
      ...profile,
      matchedAt: new Date().toISOString()
    };
    
    this.matches = [...this.matches, match];
    StorageService.set('MATCHES', this.matches);
    
    // Show notification
    notificationService.showInAppNotification(
      `You matched with ${profile.name}!`, 
      'success',
      5000
    );
    
    // Show browser notification
    notificationService.showNotification(
      'New Match!',
      {
        body: `You matched with ${profile.name}!`,
        icon: profile.photo
      }
    );
    
    // Notify listeners
    this._notifyListeners('matches', this.matches);
    
    return match;
  }
  
  // Add a profile to passes
  addPass(profile) {
    const pass = {
      ...profile,
      timestamp: new Date().toISOString()
    };
    
    this.passes = [...this.passes, pass];
    StorageService.set('PASSES', this.passes);
    
    // Notify listeners
    this._notifyListeners('passes', this.passes);
  }
  
  // Remove a like
  removeLike(profileId) {
    this.likes = this.likes.filter(like => like.id !== profileId);
    StorageService.set('LIKES', this.likes);
    
    // Notify listeners
    this._notifyListeners('likes', this.likes);
  }
  
  // Remove a pass
  removePass(profileId) {
    this.passes = this.passes.filter(pass => pass.id !== profileId);
    StorageService.set('PASSES', this.passes);
    
    // Notify listeners
    this._notifyListeners('passes', this.passes);
  }
  
  // Get all likes
  getLikes() {
    return this.likes;
  }
  
  // Get all matches
  getMatches() {
    return this.matches;
  }
  
  // Get all passes
  getPasses() {
    return this.passes;
  }
  
  // Register listener for data changes
  registerListener(type, callback) {
    if (!this.listeners[type]) {
      return null;
    }
    
    this.listeners[type].push(callback);
    return () => {
      this.listeners[type] = this.listeners[type].filter(listener => listener !== callback);
    };
  }
  
  // Private method to notify listeners
  _notifyListeners(type, data) {
    if (!this.listeners[type]) {
      return;
    }
    
    this.listeners[type].forEach(listener => {
      listener(data);
    });
  }
}

export const matchService = new MatchService();
