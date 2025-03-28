import { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';

export const usePreferences = () => {
  const [preferences, setPreferences] = useState(() => {
    return StorageService.get('PREFERENCES') || {
      minAge: 18,
      maxAge: 35,
      distance: 50,
      faith: 'Open to all',
      languages: ['English'],
      lookingFor: 'Everyone',
      status: 'Single',
      height: 160,
      interests: []
    };
  });
  
  const [locationPermission, setLocationPermission] = useState('default');

  useEffect(() => {
    StorageService.set('PREFERENCES', preferences);
  }, [preferences]);

  useEffect(() => {
    // Check if location is already permitted
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state);
        
        // Listen for changes in permission
        result.addEventListener('change', () => {
          setLocationPermission(result.state);
        });
      });
    }
  }, []);

  const updatePreferences = (updates) => {
    setPreferences(prev => ({
      ...prev,
      ...updates
    }));
  };

  const requestLocationPermission = () => {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            
            updatePreferences({ location: coords });
            setLocationPermission('granted');
            resolve(coords);
          },
          error => {
            setLocationPermission('denied');
            reject(error);
          }
        );
      } else {
        setLocationPermission('unsupported');
        reject(new Error('Geolocation is not supported by this browser'));
      }
    });
  };

  const resetPreferences = () => {
    const defaultPrefs = {
      minAge: 18,
      maxAge: 35,
      distance: 50,
      faith: 'Open to all',
      languages: ['English'],
      lookingFor: 'Everyone',
      status: 'Single',
      height: 160,
      interests: []
    };
    
    setPreferences(defaultPrefs);
    return defaultPrefs;
  };

  return {
    preferences,
    updatePreferences,
    locationPermission,
    requestLocationPermission,
    resetPreferences
  };
};
