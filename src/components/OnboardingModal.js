import React, { useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { FaithOptions } from '../types/preferences';

export const OnboardingModal = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState({
    lookingFor: '',
    minAge: 18,
    maxAge: 35,
    distance: 50,
    faith: 'Open to all',
    interests: []
  });
  
  // Predefined interest options
  const interestOptions = [
    'Travel', 'Cooking', 'Reading', 'Fitness', 'Music', 'Art',
    'Dancing', 'Hiking', 'Photography', 'Technology', 'Movies', 'Sports'
  ];
  
  const steps = [
    // Welcome step
    {
      title: "Welcome to Malayali Match",
      content: (
        <div className="text-center">
          <div className="mb-6 text-yellow-500 text-6xl">❤️</div>
          <p className="text-lg mb-6">
            Let's set up your profile to find your perfect match!
          </p>
          <button
            onClick={() => setStep(1)}
            className="w-full bg-yellow-500 text-white py-3 rounded-full hover:bg-yellow-600 transition-colors"
          >
            Let's Get Started
          </button>
          <button
            onClick={onSkip}
            className="w-full mt-3 bg-transparent text-gray-600 py-2 hover:text-gray-800"
          >
            Skip for Now
          </button>
        </div>
      )
    },
    // Who are you interested in?
    {
      title: "Who are you interested in?",
      content: (
        <div>
          <div className="space-y-3 mb-6">
            {['Women', 'Men', 'Everyone'].map((option) => (
              <div 
                key={option}
                onClick={() => setPreferences({...preferences, lookingFor: option})}
                className={`p-4 border rounded-lg flex items-center cursor-pointer ${
                  preferences.lookingFor === option ? 'border-yellow-500 bg-yellow-50' : ''
                }`}
              >
                <span className="flex-1">{option}</span>
                {preferences.lookingFor === option && (
                  <Check className="text-yellow-500" size={20} />
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!preferences.lookingFor}
            className={`w-full py-3 rounded-full transition-colors ${
              preferences.lookingFor 
                ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      )
    },
    // Age and distance preference
    {
      title: "Age & Distance",
      content: (
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
            <div className="flex justify-between mb-2">
              <span>{preferences.minAge}</span>
              <span>{preferences.maxAge}</span>
            </div>
            <div className="flex gap-4">
              <input
                type="range"
                min="18"
                max={preferences.maxAge}
                value={preferences.minAge}
                onChange={(e) => setPreferences({
                  ...preferences, 
                  minAge: parseInt(e.target.value)
                })}
                className="w-full"
              />
              <input
                type="range"
                min={preferences.minAge}
                max="65"
                value={preferences.maxAge}
                onChange={(e) => setPreferences({
                  ...preferences, 
                  maxAge: parseInt(e.target.value)
                })}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Distance ({preferences.distance} km)
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={preferences.distance}
              onChange={(e) => setPreferences({
                ...preferences,
                distance: parseInt(e.target.value)
              })}
              className="w-full"
            />
          </div>
          
          <button
            onClick={() => setStep(3)}
            className="w-full bg-yellow-500 text-white py-3 rounded-full hover:bg-yellow-600"
          >
            Continue
          </button>
        </div>
      )
    },
    // Religion preference
    {
      title: "Religion Preference",
      content: (
        <div>
          <div className="space-y-3 mb-6">
            {FaithOptions.map((option) => (
              <div 
                key={option}
                onClick={() => setPreferences({...preferences, faith: option})}
                className={`p-4 border rounded-lg flex items-center cursor-pointer ${
                  preferences.faith === option ? 'border-yellow-500 bg-yellow-50' : ''
                }`}
              >
                <span className="flex-1">{option}</span>
                {preferences.faith === option && (
                  <Check className="text-yellow-500" size={20} />
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => setStep(4)}
            className="w-full bg-yellow-500 text-white py-3 rounded-full hover:bg-yellow-600"
          >
            Continue
          </button>
        </div>
      )
    },
    // Select interests
    {
      title: "Select your interests",
      content: (
        <div>
          <p className="text-gray-600 mb-4">
            Choose at least 3 interests that you enjoy
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {interestOptions.map((interest) => (
              <div
                key={interest}
                onClick={() => {
                  const isSelected = preferences.interests.includes(interest);
                  setPreferences({
                    ...preferences,
                    interests: isSelected
                      ? preferences.interests.filter(i => i !== interest)
                      : [...preferences.interests, interest]
                  });
                }}
                className={`px-4 py-2 rounded-full cursor-pointer transition-colors ${
                  preferences.interests.includes(interest)
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {interest}
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              // Complete onboarding
              onComplete(preferences);
            }}
            disabled={preferences.interests.length < 3}
            className={`w-full py-3 rounded-full transition-colors ${
              preferences.interests.length >= 3
                ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Complete Setup
          </button>
        </div>
      )
    }
  ];
  
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-md mx-auto p-6">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1 w-10 rounded-full ${
                    index <= step ? 'bg-yellow-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-6">{steps[step].title}</h2>
          {steps[step].content}
        </div>
      </div>
    </div>
  );
};
