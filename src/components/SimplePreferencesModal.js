import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

function SimplePreferencesModal({ isOpen, onClose, onSave }) {
  const [genderPreference, setGenderPreference] = useState('all');
  const [ageRange, setAgeRange] = useState({ min: 18, max: 50 });
  const [maxDistance, setMaxDistance] = useState(50);
  const [interestPreferences, setInterestPreferences] = useState([]);
  const [educationLevel, setEducationLevel] = useState('any');
  const [relationshipType, setRelationshipType] = useState('any');
  const [district, setDistrict] = useState('any');
  const { user } = useAuth();

  // Common interests that can be filtered
  const availableInterests = [
    'Travel', 'Cooking', 'Sports', 'Reading', 'Music', 
    'Movies', 'Art', 'Photography', 'Technology', 'Fitness', 
    'Nature', 'Dance', 'Writing', 'Gaming', 'Yoga'
  ];

  // Kerala districts
  const keralaDistricts = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 
    'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad',
    'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
  ];

  // Education levels
  const educationLevels = [
    'any', 'High School', 'Bachelor\'s', 'Master\'s', 'PhD', 'Diploma'
  ];

  // Relationship types
  const relationshipTypes = [
    'any', 'Friendship', 'Dating', 'Long-term', 'Marriage', 'Casual'
  ];

  useEffect(() => {
    // If user has existing preferences, load them
    if (user && user.preferences) {
      if (user.genderPreference) {
        setGenderPreference(user.genderPreference);
      }
      
      if (user.preferences.ageRange) {
        setAgeRange(user.preferences.ageRange);
      }
      
      if (user.preferences.maxDistance) {
        setMaxDistance(user.preferences.maxDistance);
      }

      if (user.preferences.interests && Array.isArray(user.preferences.interests)) {
        setInterestPreferences(user.preferences.interests);
      }

      if (user.preferences.educationLevel) {
        setEducationLevel(user.preferences.educationLevel);
      }

      if (user.preferences.relationshipType) {
        setRelationshipType(user.preferences.relationshipType);
      }

      if (user.preferences.district) {
        setDistrict(user.preferences.district);
      }
    }
  }, [user]);

  const handleInterestToggle = (interest) => {
    if (interestPreferences.includes(interest)) {
      setInterestPreferences(interestPreferences.filter(i => i !== interest));
    } else {
      setInterestPreferences([...interestPreferences, interest]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      genderPreference,
      ageRange,
      maxDistance,
      interests: interestPreferences,
      educationLevel,
      relationshipType,
      district
    });
  };

  const handleReset = () => {
    setGenderPreference('all');
    setAgeRange({ min: 18, max: 50 });
    setMaxDistance(50);
    setInterestPreferences([]);
    setEducationLevel('any');
    setRelationshipType('any');
    setDistrict('any');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border max-w-md w-full shadow-lg rounded-md bg-white mb-10">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-medium text-gray-900">Match Preferences</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-4 overflow-y-auto max-h-[70vh]">
          {/* Gender Preference */}
          <div className="mb-6">
            <h4 className="block text-gray-700 font-medium mb-2">
              Show me
            </h4>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  id="gender-men"
                  name="gender-preference"
                  type="radio"
                  checked={genderPreference === 'men'}
                  onChange={() => setGenderPreference('men')}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <label htmlFor="gender-men" className="ml-3 block text-gray-700">
                  Men
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="gender-women"
                  name="gender-preference"
                  type="radio"
                  checked={genderPreference === 'women'}
                  onChange={() => setGenderPreference('women')}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <label htmlFor="gender-women" className="ml-3 block text-gray-700">
                  Women
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="gender-all"
                  name="gender-preference"
                  type="radio"
                  checked={genderPreference === 'all'}
                  onChange={() => setGenderPreference('all')}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <label htmlFor="gender-all" className="ml-3 block text-gray-700">
                  Everyone
                </label>
              </div>
            </div>
          </div>
          
          {/* Age Range */}
          <div className="mb-6">
            <h4 className="block text-gray-700 font-medium mb-2">
              Age Range: {ageRange.min} - {ageRange.max} years
            </h4>
            <div className="px-2">
              <div className="text-xs flex justify-between text-gray-500 mb-1">
                <span>18</span>
                <span>75</span>
              </div>
              <input
                type="range"
                min="18"
                max="75"
                value={ageRange.min}
                onChange={(e) => setAgeRange({ ...ageRange, min: parseInt(e.target.value, 10) })}
                className="w-full mb-4 accent-indigo-600"
              />
              <input
                type="range"
                min="18"
                max="75"
                value={ageRange.max}
                onChange={(e) => {
                  const newMax = parseInt(e.target.value, 10);
                  setAgeRange({ ...ageRange, max: Math.max(newMax, ageRange.min) });
                }}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
          
          {/* Distance */}
          <div className="mb-6">
            <h4 className="block text-gray-700 font-medium mb-2">
              Maximum Distance: {maxDistance} km
            </h4>
            <div className="px-2">
              <div className="text-xs flex justify-between text-gray-500 mb-1">
                <span>1 km</span>
                <span>100 km</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={maxDistance}
                onChange={(e) => setMaxDistance(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          {/* Location Filter - Kerala Districts */}
          <div className="mb-6">
            <h4 className="block text-gray-700 font-medium mb-2">
              District
            </h4>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="any">Any district</option>
              {keralaDistricts.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          {/* Education Level */}
          <div className="mb-6">
            <h4 className="block text-gray-700 font-medium mb-2">
              Education Level
            </h4>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {educationLevels.map(level => (
                <option key={level} value={level}>
                  {level === 'any' ? 'Any education level' : level}
                </option>
              ))}
            </select>
          </div>

          {/* Relationship Type */}
          <div className="mb-6">
            <h4 className="block text-gray-700 font-medium mb-2">
              Looking For
            </h4>
            <select
              value={relationshipType}
              onChange={(e) => setRelationshipType(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {relationshipTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'any' ? 'Any relationship type' : type}
                </option>
              ))}
            </select>
          </div>

          {/* Interests */}
          <div className="mb-6">
            <h4 className="block text-gray-700 font-medium mb-2">
              Interests ({interestPreferences.length} selected)
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {availableInterests.map(interest => (
                <div key={interest} className="flex items-center">
                  <input
                    id={`interest-${interest}`}
                    type="checkbox"
                    checked={interestPreferences.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor={`interest-${interest}`} className="ml-2 block text-sm text-gray-700">
                    {interest}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between pt-4 border-t">
            <button
              type="button"
              onClick={handleReset}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset All
            </button>
            <div>
              <button
                type="button"
                onClick={onClose}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SimplePreferencesModal;
