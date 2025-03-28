import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/storage';

// Theme context
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {}
});

// Custom hook for using theme
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get from storage or default to light
    return StorageService.get('APP_THEME') || 'light';
  });

  // Apply theme when it changes
  useEffect(() => {
    // Update document with theme classes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to storage
    StorageService.set('APP_THEME', theme);
  }, [theme]);
  
  // Handle system preference changes
  useEffect(() => {
    // Only if user hasn't explicitly set a theme
    if (!StorageService.get('APP_THEME_EXPLICIT')) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        setTheme(e.matches ? 'dark' : 'light');
      };
      
      // Set initial value
      handleChange(mediaQuery);
      
      // Add listener
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.addListener) {
        // Deprecated but for older browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    StorageService.set('APP_THEME_EXPLICIT', true);
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Explicitly set theme
  const setExplicitTheme = (newTheme) => {
    StorageService.set('APP_THEME_EXPLICIT', true);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setExplicitTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
