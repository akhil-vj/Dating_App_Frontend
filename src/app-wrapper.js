import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './providers/ThemeProvider';
import { NotificationProvider } from './components/NotificationSystem'; 
import { FullPageLoader } from './components/LoadingIndicator';
import { WelcomeTour } from './components/WelcomeTour';
import { AccessibilityHelper } from './components/AccessibilityHelper';
import MalayaliMatchApp from './App';
import { appInitialization } from './services/appInitialization';
import { StorageService } from './services/storage';
import { analyticsService } from './services/analytics';

// Main app wrapper component that initializes services and provides contexts
const AppWrapper = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState(null);
  const [showTour, setShowTour] = useState(false);
  
  useEffect(() => {
    const initApp = async () => {
      try {
        // Track page load
        analyticsService.trackPageView('app_launch');
        
        // Initialize app services
        const result = await appInitialization.initialize();
        
        if (!result.success) {
          console.error('App initialization failed:', result.error);
          setInitError(result.error);
        } else {
          // Check if tour should be shown (first time users)
          const hasCompletedTour = StorageService.get('TOUR_COMPLETED');
          const isFirstLaunch = !StorageService.get('APP_LAUNCHED_BEFORE');
          
          if (!hasCompletedTour && isFirstLaunch) {
            setShowTour(true);
          }
          
          // Mark that app has been launched before
          StorageService.set('APP_LAUNCHED_BEFORE', true);
        }
      } catch (error) {
        console.error('Unexpected error during initialization:', error);
        setInitError(error.message);
        analyticsService.trackError('app_init_failed', { 
          message: error.message 
        });
      } finally {
        // Even if initialization fails, we still want to show the app
        // with appropriate error notifications
        setIsInitializing(false);
      }
    };
    
    initApp();
    
    // Setup keyboard shortcut handling
    const handleKeyboardShortcut = (e) => {
      // Example shortcut: Ctrl+/ to open help
      if (e.key === '/' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        // Would dispatch an action to show help modal
      }
    };
    
    document.addEventListener('keydown', handleKeyboardShortcut);
    
    return () => {
      document.removeEventListener('keydown', handleKeyboardShortcut);
    };
  }, []);
  
  // Handle tour completion
  const handleTourComplete = () => {
    setShowTour(false);
    analyticsService.trackAction('completed_intro_tour');
  };
  
  // Show loader while initializing
  if (isInitializing) {
    return <FullPageLoader />;
  }
  
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider initialError={initError}>
          <AccessibilityHelper />
          <MalayaliMatchApp />
          
          {/* Show tour if needed */}
          {showTour && (
            <WelcomeTour onComplete={handleTourComplete} />
          )}
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default AppWrapper;
