import React, { useEffect } from 'react';

/**
 * A component that adds accessibility enhancements to the app.
 * It handles keyboard navigation, focus traps for modals,
 * and screen reader announcements.
 */
export const AccessibilityHelper = () => {
  // Create live region for screen reader announcements
  useEffect(() => {
    // Create the live region if it doesn't exist
    if (!document.getElementById('screen-reader-announcer')) {
      const announcer = document.createElement('div');
      announcer.id = 'screen-reader-announcer';
      announcer.className = 'sr-only';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      document.body.appendChild(announcer);
    }
    
    // Cleanup on unmount
    return () => {
      const announcer = document.getElementById('screen-reader-announcer');
      if (announcer) {
        announcer.remove();
      }
    };
  }, []);
  
  // Handle escape key for modals
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Close modals when escape key is pressed
      if (event.key === 'Escape') {
        const modals = document.querySelectorAll('[role="dialog"], [aria-modal="true"]');
        if (modals.length > 0) {
          // Find the close button of the top-most modal
          const topModal = modals[modals.length - 1];
          const closeButton = topModal.querySelector('[aria-label="Close"]');
          if (closeButton) {
            closeButton.click();
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Add keyboard navigation for common UI patterns
  useEffect(() => {
    // Setup tab traps for modals
    const setupFocusTraps = () => {
      const modals = document.querySelectorAll('[role="dialog"], [aria-modal="true"]');
      
      modals.forEach(modal => {
        // Skip already processed modals
        if (modal.getAttribute('data-focus-trap') === 'true') return;
        
        // Get all focusable elements
        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
          // Focus the first element when modal opens
          setTimeout(() => {
            firstElement.focus();
          }, 100);
          
          // Add keydown handler for tab key
          const handleTabKey = (e) => {
            if (e.key === 'Tab') {
              if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          };
          
          modal.addEventListener('keydown', handleTabKey);
          modal.setAttribute('data-focus-trap', 'true');
        }
      });
    };
    
    // Set up mutation observer to watch for new modals
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          setupFocusTraps();
        }
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    setupFocusTraps(); // Run once on mount
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return null; // This is a utility component that doesn't render anything
};

/**
 * Function to announce messages to screen readers
 */
export const announceToScreenReader = (message) => {
  const announcer = document.getElementById('screen-reader-announcer');
  if (announcer) {
    announcer.textContent = '';
    // Small delay to ensure screen readers register the change
    setTimeout(() => {
      announcer.textContent = message;
    }, 50);
  }
};

/**
 * Hook for keyboard shortcuts
 */
export const useKeyboardShortcut = (key, callback, modifiers = {}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { ctrlKey, shiftKey, altKey, metaKey } = event;
      
      // Check if key matches and all modifiers match
      if (
        event.key === key && 
        (!modifiers.ctrl || ctrlKey) && 
        (!modifiers.shift || shiftKey) && 
        (!modifiers.alt || altKey) && 
        (!modifiers.meta || metaKey)
      ) {
        callback(event);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback, modifiers]);
};
