import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingIndicator } from './LoadingIndicator';

function GenderPreferenceScreen() {
  const { setGenderPreference } = useAuth();
  const navigate = useNavigate();
  const [selectedPreference, setSelectedPreference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPreference) {
      setError('Please select your preference');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const result = await setGenderPreference(selectedPreference);
      if (result.success) {
        // Redirect to main app after preference is set
        navigate('/');
      } else {
        setError(result.error || 'Failed to save preference. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Gender preference error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const options = [
    { value: 'men', label: 'Men', icon: '👨', description: 'Show male profiles only' },
    { value: 'women', label: 'Women', icon: '👩', description: 'Show female profiles only' },
    { value: 'all', label: 'Everyone', icon: '👥', description: 'Show all profiles' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Who would you like to see?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose your preference to help us show you relevant matches
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {options.map((option) => (
              <div key={option.value} className="relative">
                <button
                  type="button"
                  onClick={() => setSelectedPreference(option.value)}
                  className={`w-full flex items-center p-4 border-2 rounded-lg hover:bg-gray-50 focus:outline-none ${
                    selectedPreference === option.value
                      ? 'border-indigo-500 ring-2 ring-indigo-200'
                      : 'border-gray-300'
                  }`}
                >
                  <div className="flex-shrink-0 text-2xl mr-4">{option.icon}</div>
                  <div className="flex-1 text-left">
                    <div className="text-lg font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.description}</div>
                  </div>
                  {selectedPreference === option.value && (
                    <div className="ml-3 flex-shrink-0 text-indigo-600">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <LoadingIndicator />
                  <span className="ml-2">Saving preference...</span>
                </span>
              ) : 'Continue'}
            </button>
          </div>
          
          <div className="text-center text-sm">
            <p className="text-gray-500">
              You can change this preference later in your settings
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GenderPreferenceScreen;
