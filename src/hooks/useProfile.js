import { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { validateProfile } from '../utils/validation';

export const useProfile = () => {
  const [profile, setProfile] = useState(() => 
    StorageService.get('USER_PROFILE') || {
      name: '',
      photo: '/api/placeholder/150/150',
      verified: false,
      completionPercentage: 0,
      photos: [],
      about: '',
      work: '',
      education: '',
      dateOfBirth: '',
      age: '',
      caste: '',
      religion: '',
      place: '',
      interests: []
    }
  );

  const [errors, setErrors] = useState({});
  const [isDobSet, setIsDobSet] = useState(() => StorageService.get('DOB_SET') || false);

  useEffect(() => {
    StorageService.set('USER_PROFILE', profile);
  }, [profile]);

  useEffect(() => {
    StorageService.set('DOB_SET', isDobSet);
  }, [isDobSet]);

  const calculateProfileCompletion = (profileData) => {
    const requiredFields = [
      { field: 'name', weight: 15 },
      { field: 'photo', weight: 15 },
      { field: 'dateOfBirth', weight: 15 },
      { field: 'religion', weight: 10 },
      { field: 'place', weight: 10 },
      { field: 'education', weight: 10 },
      { field: 'work', weight: 10 },
      { field: 'about', weight: 15 }
    ];

    let completionPercentage = 0;

    requiredFields.forEach(({ field, weight }) => {
      if (field === 'photo' && profileData[field] !== '/api/placeholder/150/150') {
        completionPercentage += weight;
      } else if (profileData[field] && profileData[field].toString().trim().length > 0) {
        completionPercentage += weight;
      }
    });

    return completionPercentage;
  };

  // Enhanced updateProfile function with better validation
  const updateProfile = (field, value) => {
    // Special validation for different fields
    let validatedValue = value;
    let validationError = null;
    
    switch (field) {
      case 'name':
        // Name should be at least 2 characters and not contain numbers
        if (value.trim().length < 2) {
          validationError = 'Name should be at least 2 characters';
        } else if (/\d/.test(value)) {
          validationError = 'Name should not contain numbers';
        }
        break;
        
      case 'dateOfBirth':
        if (isDobSet) {
          return false; // Prevent DOB update if already set
        }
        
        // Validate age to be at least 18 years
        const dobDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const m = today.getMonth() - dobDate.getMonth();
        
        if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
          age--;
        }
        
        if (age < 18) {
          validationError = 'You must be at least 18 years old';
          break;
        }
        
        // Add calculated age to profile
        setProfile(prev => ({
          ...prev,
          age: age
        }));
        
        setIsDobSet(true);
        break;
        
      case 'email':
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          validationError = 'Please enter a valid email address';
        }
        break;
        
      case 'phone':
        // Basic phone validation - allow digits, spaces, and some special chars
        const phoneRegex = /^\+?([0-9]{2})?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
        if (!phoneRegex.test(value)) {
          validationError = 'Please enter a valid phone number';
        }
        break;
        
      default:
        // No special validation for other fields
        break;
    }
    
    if (validationError) {
      setErrors(prev => ({
        ...prev,
        [field]: validationError
      }));
      return false;
    }

    setProfile(prev => {
      const updated = { ...prev, [field]: validatedValue };
      const validation = validateProfile(updated);
      setErrors(validation.errors);
      
      // Calculate new completion percentage
      const completionPercentage = calculateProfileCompletion(updated);
      return {
        ...updated,
        completionPercentage
      };
    });
    return true;
  };
  
  // Add function to update multiple fields at once
  const updateMultipleFields = (updates) => {
    let isValid = true;
    
    // Process each field individually to ensure proper validation
    Object.entries(updates).forEach(([field, value]) => {
      const fieldUpdateSuccess = updateProfile(field, value);
      if (!fieldUpdateSuccess) {
        isValid = false;
      }
    });
    
    return isValid;
  };
  
  // Add function to add and remove photos
  const addPhoto = (photoUrl) => {
    setProfile(prev => {
      const updatedPhotos = [...(prev.photos || []), photoUrl];
      return {
        ...prev,
        photos: updatedPhotos,
        completionPercentage: calculateProfileCompletion({
          ...prev,
          photos: updatedPhotos
        })
      };
    });
    return true;
  };
  
  const removePhoto = (photoIndex) => {
    setProfile(prev => {
      if (!prev.photos || photoIndex >= prev.photos.length) {
        return prev;
      }
      
      const updatedPhotos = [...prev.photos];
      updatedPhotos.splice(photoIndex, 1);
      
      return {
        ...prev,
        photos: updatedPhotos,
        completionPercentage: calculateProfileCompletion({
          ...prev,
          photos: updatedPhotos
        })
      };
    });
    return true;
  };
  
  // Add missing saveProfile function
  const saveProfile = () => {
    // Save the profile data to storage
    try {
      StorageService.set('USER_PROFILE', profile);
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      return false;
    }
  };
  
  // Return enhanced profile hooks
  return {
    profile,
    errors,
    isDobSet,
    updateProfile,
    updateMultipleFields,
    addPhoto,
    removePhoto,
    saveProfile,
    setIsDobSet
  };
};
