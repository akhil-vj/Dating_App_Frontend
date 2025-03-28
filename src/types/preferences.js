// Faith options for religion preferences
export const FaithOptions = [
  'Open to all',
  'Hindu',
  'Muslim',
  'Christian',
  'Buddhist',
  'Sikh',
  'Jain',
  'Jewish',
  'Spiritual',
  'Atheist'
];

// Language options
export const LanguageOptions = [
  'Malayalam',
  'English',
  'Hindi',
  'Tamil',
  'Kannada',
  'Telugu'
];

// Relationship status options
export const StatusOptions = [
  'Single',
  'Divorced',
  'Widowed',
  'Separated'
];

// Relationship goal options
export const GoalOptions = [
  'Marriage',
  'Long-term relationship',
  'Casual dating',
  'Friendship',
  'Not sure yet'
];

// Height options (in cm)
export const generateHeightOptions = () => {
  const options = [];
  // Generate heights from 140cm (4'7") to 210cm (6'11")
  for (let cm = 140; cm <= 210; cm++) {
    const feet = Math.floor(cm / 30.48);
    const inches = Math.round((cm / 2.54) % 12);
    options.push({
      value: cm,
      label: `${cm} cm (${feet}'${inches}")`
    });
  }
  return options;
};

// Default preferences structure
export const defaultPreferences = {
  lookingFor: 'Everyone', // 'Women', 'Men', 'Everyone'
  minAge: 18,
  maxAge: 40,
  distance: 50, // in km
  faith: 'Open to all',
  languages: ['Malayalam', 'English'],
  status: 'Single',
  height: {
    min: 150,
    max: 190
  },
  interests: [],
  intention: 'Long-term relationship', // From GoalOptions
  education: 'Open to all', // Education level preference
  verified: false, // Prefer verified profiles only?
  photoCount: 1 // Minimum number of photos
};

// User report reasons
export const ReportReasons = [
  'Fake profile',
  'Inappropriate content',
  'Harassment',
  'Scam/spam',
  'Underage user',
  'Other'
];

// User profile validation rules
export const ValidationRules = {
  name: {
    min: 2,
    max: 50
  },
  bio: {
    min: 0,
    max: 500
  },
  photos: {
    min: 1,
    max: 6,
    formats: ['jpg', 'jpeg', 'png', 'webp'],
    maxSize: 5000000 // 5MB
  },
  age: {
    min: 18,
    max: 100
  }
};

// Match status types
export const MatchStatus = {
  PENDING: 'pending',
  MATCHED: 'matched',
  REJECTED: 'rejected',
  EXPIRED: 'expired'
};
