/**
 * A utility to handle touch gestures like swipe for mobile users.
 * Makes interactions more natural on touchscreen devices.
 */
export class TouchGestureDetector {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      threshold: 50, // Minimum distance for a swipe
      restraint: 100, // Maximum perpendicular distance allowed
      allowedTime: 300, // Maximum time allowed for a swipe
      ...options
    };
    
    this.callbacks = {
      swipeLeft: [],
      swipeRight: [],
      swipeUp: [],
      swipeDown: [],
      tap: []
    };
    
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.touchStartTime = 0;
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    
    this.element.addEventListener('touchstart', this.handleTouchStart, false);
    this.element.addEventListener('touchmove', this.handleTouchMove, false);
    this.element.addEventListener('touchend', this.handleTouchEnd, false);
  }
  
  handleTouchStart(event) {
    const touch = event.changedTouches[0];
    
    this.touchStartX = touch.pageX;
    this.touchStartY = touch.pageY;
    this.touchStartTime = new Date().getTime();
  }
  
  handleTouchMove(event) {
    // Prevent scrolling if configured to do so
    if (this.options.preventScroll) {
      event.preventDefault();
    }
  }
  
  handleTouchEnd(event) {
    const touch = event.changedTouches[0];
    
    this.touchEndX = touch.pageX;
    this.touchEndY = touch.pageY;
    
    this.detectGesture();
  }
  
  detectGesture() {
    const touchDuration = new Date().getTime() - this.touchStartTime;
    const distanceX = this.touchEndX - this.touchStartX;
    const distanceY = this.touchEndY - this.touchStartY;
    const absDistanceX = Math.abs(distanceX);
    const absDistanceY = Math.abs(distanceY);
    
    // Check for tap
    if (touchDuration < this.options.allowedTime && absDistanceX < 10 && absDistanceY < 10) {
      this.triggerEvent('tap', { x: this.touchEndX, y: this.touchEndY });
      return;
    }
    
    // Check for swipes
    if (touchDuration <= this.options.allowedTime) {
      // Horizontal swipe
      if (absDistanceX >= this.options.threshold && absDistanceY <= this.options.restraint) {
        if (distanceX < 0) {
          // Swipe left
          this.triggerEvent('swipeLeft', { distance: absDistanceX });
        } else {
          // Swipe right
          this.triggerEvent('swipeRight', { distance: absDistanceX });
        }
      }
      // Vertical swipe
      else if (absDistanceY >= this.options.threshold && absDistanceX <= this.options.restraint) {
        if (distanceY < 0) {
          // Swipe up
          this.triggerEvent('swipeUp', { distance: absDistanceY });
        } else {
          // Swipe down
          this.triggerEvent('swipeDown', { distance: absDistanceY });
        }
      }
    }
  }
  
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
    return this; // Enable method chaining
  }
  
  off(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }
    return this;
  }
  
  triggerEvent(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }
  
  destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.callbacks = {
      swipeLeft: [],
      swipeRight: [],
      swipeUp: [],
      swipeDown: [],
      tap: []
    };
  }
}

// Helper function to create a gesture detector
export const createGestureDetector = (element, options) => {
  return new TouchGestureDetector(element, options);
};
