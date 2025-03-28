/**
 * Validation utilities for the dating app
 */

// Validate entire profile
export const validateProfile = (profile) => {
  const errors = {};
  
  // Name validation
  if (!profile.name?.trim()) {
    errors.name = 'Name is required';
  } else if (profile.name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (profile.name.length > 50) {
    errors.name = 'Name must be less than 50 characters';
  }
  
  // Date of Birth validation
  if (!profile.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  } else {
    const dob = new Date(profile.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    if (age < 18) {
      errors.dateOfBirth = 'You must be at least 18 years old';
    } else if (age > 100) {
      errors.dateOfBirth = 'Please enter a valid date of birth';
    }
  }
  
  // Location validation
  if (!profile.place?.trim()) {
    errors.place = 'Location is required';
  }
  
  // About validation
  if (profile.about && profile.about.length > 500) {
    errors.about = 'Bio must be less than 500 characters';
  }
  
  // Photo validation
  if (!profile.photo || profile.photo === '/api/placeholder/150/150') {
    errors.photo = 'Profile photo is required';
  }
  
  // Additional photos validation
  if (profile.photos && profile.photos.length > 6) {
    errors.photos = 'You can upload a maximum of 6 additional photos';
  }
  
  // Interests validation
  if (!profile.interests || profile.interests.length < 1) {
    errors.interests = 'Please add at least one interest';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate email
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate photo uploads
export const validatePhoto = (file) => {
  const errors = [];
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!file) {
    errors.push('Please select a file');
  } else {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push('File must be an image (JPG, PNG, or WebP)');
    }
    
    // Check file size
    if (file.size > maxSize) {
      errors.push('File must be less than 5MB');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate preferences
export const validatePreferences = (preferences) => {
  const errors = {};
  
  // Age range validation
  if (preferences.minAge && preferences.maxAge) {
    if (preferences.minAge < 18) {
      errors.minAge = 'Minimum age must be at least 18';
    }
    if (preferences.maxAge > 100) {
      errors.maxAge = 'Maximum age must be less than 100';
    }
    if (preferences.minAge > preferences.maxAge) {
      errors.ageRange = 'Minimum age cannot be greater than maximum age';
    }
  }
  
  // Distance validation
  if (preferences.distance && (preferences.distance < 1 || preferences.distance > 300)) {
    errors.distance = 'Distance must be between 1 and 300 km';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Calculate profile completion percentage
export const calculateProfileCompletion = (profile) => {
  const requiredFields = ['name', 'dateOfBirth', 'place', 'about', 'photo'];
  const bonusFields = ['work', 'education', 'religion', 'caste'];
  const bonusArrays = ['interests', 'photos'];
  
  let completionScore = 0;
  let totalPossibleScore = 0;
  
  // Check required fields (60% of score)
  requiredFields.forEach(field => {
    totalPossibleScore += 12;
    if (profile[field] && profile[field] !== '/api/placeholder/150/150') {
      completionScore += 12;
    }
  });
  
  // Check bonus fields (20% of score)
  bonusFields.forEach(field => {
    totalPossibleScore += 5;
    if (profile[field] && profile[field].trim()) {
      completionScore += 5;
    }
  });
  
  // Check bonus arrays (20% of score)
  bonusArrays.forEach(field => {
    totalPossibleScore += 10;
    if (profile[field]?.length > 0) {
      // Give partial credit based on how many items are added
      const maxItems = field === 'photos' ? 6 : 5;
      const itemCount = Math.min(profile[field].length, maxItems);
      const scorePerItem = 10 / maxItems;
      completionScore += itemCount * scorePerItem;
    }
  });
  
  const percentage = Math.round((completionScore / totalPossibleScore) * 100);
  return Math.min(percentage, 100); // Cap at 100%
};

// Fix unnecessary escape characters in regular expressions

// Before:
// const phoneRegex = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;

// After (fixed):
const phoneRegex = /^\+?([0-9]{2})?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
