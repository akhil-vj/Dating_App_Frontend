import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingIndicator } from './LoadingIndicator';

function ProfileCompletionScreen() {
  // Remove unused 'user' from destructuring or use it in the component
  const { loading, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    gender: '',
    birthdate: '',
    bio: '',
    location: '',
    lookingFor: '',
    interests: [],
    photo: null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle interests selection (checkboxes)
  const handleInterestChange = (interest) => {
    setFormData(prev => {
      if (prev.interests.includes(interest)) {
        return {
          ...prev,
          interests: prev.interests.filter(item => item !== interest)
        };
      } else {
        return {
          ...prev,
          interests: [...prev.interests, interest]
        };
      }
    });
  };

  // Handle photo upload
  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        photo: e.target.files[0]
      }));
    }
  };

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // In a real app, send this data to your backend
      console.log('Profile data to submit:', formData);
      
      // Update the user profile with data
      const result = await updateProfile(formData);
      
      if (result.success) {
        // Redirect to gender preference selection
        navigate('/gender-preference');
      } else {
        setError(result.error || 'Failed to save profile. Please try again.');
      }
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      console.error('Profile completion error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingIndicator />
        <span className="ml-2">Loading your profile...</span>
      </div>
    );
  }

  // Predefined list of interests
  const interestOptions = [
    'Travel', 'Cooking', 'Sports', 'Reading', 'Music', 'Movies', 
    'Art', 'Photography', 'Technology', 'Gaming', 'Fitness', 'Nature'
  ];

  // Render different steps based on currentStep
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Birth Date</label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">About You</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Tell us about yourself..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Looking For</label>
              <select
                name="lookingFor"
                value={formData.lookingFor}
                onChange={handleChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select option</option>
                <option value="relationship">Relationship</option>
                <option value="friendship">Friendship</option>
                <option value="casual">Casual</option>
              </select>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Interests & Photo</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Interests</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {interestOptions.map((interest) => (
                  <div key={interest} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id={`interest-${interest}`}
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={() => handleInterestChange(interest)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor={`interest-${interest}`} className="font-medium text-gray-700">{interest}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
              <div className="mt-1 flex items-center">
                {formData.photo ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(formData.photo)}
                      alt="Profile preview"
                      className="h-32 w-32 object-cover rounded-full"
                    />
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, photo: null }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center items-center w-full">
                    <label
                      htmlFor="profile-photo"
                      className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Upload a file
                    </label>
                    <input
                      id="profile-photo"
                      name="photo"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Let's set up your profile to help you find better matches
          </p>
          
          {/* Progress indicator */}
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                    index + 1 === currentStep
                      ? 'bg-indigo-600 text-white'
                      : index + 1 < currentStep
                      ? 'bg-indigo-200 text-indigo-800'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200">
              <div
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                className="transition-all duration-500 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
              ></div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={currentStep === totalSteps ? handleSubmit : handleNextStep}>
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Previous
              </button>
            ) : (
              <div></div> // Empty div to maintain layout with flex-between
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <LoadingIndicator />
                  <span className="ml-2">Saving...</span>
                </span>
              ) : currentStep === totalSteps ? 'Complete Profile' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileCompletionScreen;
