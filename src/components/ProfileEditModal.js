import React, { useState } from 'react';
import { X, Camera, Trash2, Plus, Shield, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { validateProfile, validatePhoto } from '../utils/validation';
import { FaithOptions } from '../types/preferences';

export const ProfileEditModal = ({ profile, onSave, onClose, onVerify }) => {
  const [formData, setFormData] = useState({ ...profile });
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleInterestAdd = () => {
    const interest = document.getElementById('new-interest').value.trim();
    if (!interest) return;

    if (formData.interests?.includes(interest)) {
      setErrors(prev => ({
        ...prev,
        interests: 'This interest is already in your list'
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      interests: [...(prev.interests || []), interest]
    }));

    document.getElementById('new-interest').value = '';
  };

  const handleInterestRemove = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validatePhoto(file);
    if (!validation.isValid) {
      setErrors(prev => ({
        ...prev,
        photo: validation.errors.join(', ')
      }));
      return;
    }

    setIsUploading(true);
    setErrors(prev => ({ ...prev, photo: null }));

    try {
      // Simulate upload with file reader
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photo: reader.result
        }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading photo:', error);
      setErrors(prev => ({
        ...prev,
        photo: 'Failed to upload photo'
      }));
      setIsUploading(false);
    }
  };

  const handleAdditionalPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validatePhoto(file);
    if (!validation.isValid) {
      setErrors(prev => ({
        ...prev,
        photos: validation.errors.join(', ')
      }));
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload with file reader
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photos: [...(prev.photos || []), reader.result]
        }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading additional photo:', error);
      setErrors(prev => ({
        ...prev,
        photos: 'Failed to upload photo'
      }));
      setIsUploading(false);
    }
  };

  const handleRemoveAdditionalPhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateProfile(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setShowValidationError(true);
      // Scroll to first error
      const firstErrorField = Object.keys(validation.errors)[0];
      document.getElementsByName(firstErrorField)[0]?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto py-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
            <div className="flex items-start">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                  {formData.photo && formData.photo !== '/api/placeholder/150/150' ? (
                    <img 
                      src={formData.photo} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Camera size={32} />
                    </div>
                  )}
                </div>
                
                <div className="absolute -bottom-1 -right-1">
                  {formData.verified ? (
                    <div className="bg-blue-500 text-white p-1 rounded-full">
                      <Shield size={16} />
                    </div>
                  ) : (
                    <button 
                      type="button"
                      onClick={onVerify}
                      className="bg-yellow-500 text-white p-1 rounded-full"
                    >
                      <Shield size={16} />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="ml-4 space-y-2">
                <button
                  type="button"
                  onClick={handlePhotoUpload}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md text-sm flex items-center"
                  disabled={isUploading}
                >
                  <Camera size={16} className="mr-2" />
                  {isUploading ? 'Uploading...' : 'Change Photo'}
                </button>
                {!formData.verified && (
                  <p className="text-xs text-blue-600">
                    Verify your profile to get a blue badge
                  </p>
                )}
                {errors.photo && (
                  <p className="text-xs text-red-500">{errors.photo}</p>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              value={formData.dateOfBirth || ''}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500 ${
                errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={profile.isDobSet}
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
            )}
            {profile.isDobSet && (
              <p className="mt-1 text-xs text-gray-500">
                Date of birth cannot be changed after it's set
              </p>
            )}
          </div>
          
          {/* About */}
          <div>
            <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-2">About Me</label>
            <textarea
              name="about"
              id="about"
              rows={4}
              value={formData.about || ''}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500 ${
                errors.about ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Share a little about yourself..."
            ></textarea>
            {errors.about && (
              <p className="mt-1 text-sm text-red-500">{errors.about}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="place" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="inline mr-1" /> Location
            </label>
            <input
              type="text"
              name="place"
              id="place"
              value={formData.place || ''}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500 ${
                errors.place ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Where do you live?"
            />
            {errors.place && (
              <p className="mt-1 text-sm text-red-500">{errors.place}</p>
            )}
          </div>

          {/* Work */}
          <div>
            <label htmlFor="work" className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase size={16} className="inline mr-1" /> Work
            </label>
            <input
              type="text"
              name="work"
              id="work"
              value={formData.work || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="What do you do for work?"
            />
          </div>

          {/* Education */}
          <div>
            <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
              <GraduationCap size={16} className="inline mr-1" /> Education
            </label>
            <input
              type="text"
              name="education"
              id="education"
              value={formData.education || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Your education background"
            />
          </div>

          {/* Religion & Caste */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="religion" className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
              <select
                name="religion"
                id="religion"
                value={formData.religion || ''}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="">Select religion</option>
                {FaithOptions.map(faith => (
                  faith !== 'Open to all' && (
                    <option key={faith} value={faith}>{faith}</option>
                  )
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="caste" className="block text-sm font-medium text-gray-700 mb-2">Caste</label>
              <input
                type="text"
                name="caste"
                id="caste"
                value={formData.caste || ''}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.interests?.map((interest, index) => (
                <div 
                  key={index} 
                  className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                >
                  <span className="text-sm">{interest}</span>
                  <button
                    type="button"
                    onClick={() => handleInterestRemove(interest)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                id="new-interest"
                className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Add an interest..."
              />
              <button
                type="button"
                onClick={handleInterestAdd}
                className="bg-yellow-500 text-white px-3 py-2 rounded-r-lg hover:bg-yellow-600"
              >
                <Plus size={20} />
              </button>
            </div>
            {errors.interests && (
              <p className="mt-1 text-sm text-red-500">{errors.interests}</p>
            )}
          </div>

          {/* Additional Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Photos</label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {formData.photos?.map((photo, index) => (
                <div key={index} className="relative h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={photo} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAdditionalPhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              
              <label className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-yellow-500">
                <input
                  type="file"
                  onChange={handleAdditionalPhotoUpload}
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                />
                <Plus size={24} className="text-gray-400" />
              </label>
            </div>
            {errors.photos && (
              <p className="mt-1 text-sm text-red-500">{errors.photos}</p>
            )}
            <p className="text-xs text-gray-500">Add up to 6 photos to your profile</p>
          </div>

          {/* Save Button */}
          <div className="sticky bottom-0 bg-white py-4 border-t">
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Save Profile
            </button>
          </div>

          {/* Show validation error message */}
          {showValidationError && Object.keys(errors).length > 0 && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg">
              <p className="font-medium">Please correct the following errors:</p>
              <ul className="list-disc list-inside text-sm mt-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}: {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
