import React from 'react';
import { X, MapPin, Heart, Calendar, ChevronRight, Shield } from 'lucide-react';

export const ProfileDetailsModal = ({ profile, onClose = () => {}, onLike, onPass, onStartChat }) => {
  // Add null checks for profile properties
  const { 
    photo = '',
    name = '',
    age = '',
    place = '',
    about = '',
    work = '',
    education = '',
    interests = [], // Default to empty array
    religion = '',
    caste = '',
    photos = [] // Default to empty array
  } = profile || {};

  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="sticky top-0 z-10 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Profile Details</h2>
          <button 
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Images */}
        <div className="relative h-96">
          <img
            src={photo}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h2 className="text-2xl font-bold text-white">{name}, {age}</h2>
            <p className="text-white/90">{place}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">About</h3>
              <p className="text-gray-600">{about}</p>
            </div>
            <button
              onClick={() => {
                if (onStartChat) {
                  // Ensure photo property exists before passing to chat
                  const profileWithPhoto = {
                    ...profile,
                    photo: photo || profile.image,
                    id: profile.id || Date.now() // Ensure ID exists
                  };
                  onStartChat(profileWithPhoto);
                }
              }}
              className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition-colors"
            >
              Message
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Work</h3>
              <p className="text-gray-600">{work}</p>
            </div>
            <div>
              <h3 className="font-semibold">Education</h3>
              <p className="text-gray-600">{education}</p>
            </div>
          </div>

          {/* Only render interests section if there are interests */}
          {interests.length > 0 && (
            <div>
              <h3 className="font-semibold">Interests</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {interests.map((interest, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Religion</h3>
              <p className="text-gray-600">{religion}</p>
            </div>
            <div>
              <h3 className="font-semibold">Caste</h3>
              <p className="text-gray-600">{caste}</p>
            </div>
          </div>

          {/* Only render photos section if there are additional photos */}
          {photos.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Photos</h3>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`${name}'s photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
