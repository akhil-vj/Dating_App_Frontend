import React from 'react';
import { Edit2, Check, Shield, MapPin, Briefcase, GraduationCap, Heart } from 'lucide-react';

export const UserProfileCard = ({ profile, onEdit, isPremium }) => {
  const {
    name,
    age,
    photo,
    verified,
    completionPercentage,
    about,
    education,
    work,
    interests = [],
    place,
    religion,
    caste
  } = profile;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Cover & profile photo */}
      <div className="relative h-32 bg-gradient-to-r from-yellow-400 to-yellow-600">
        <div className="absolute -bottom-10 left-4">
          <div className="relative">
            <img
              src={photo}
              alt={name}
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />
            {verified && (
              <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full">
                <Check size={16} />
              </div>
            )}
          </div>
        </div>
        
        {/* Edit button */}
        <button 
          onClick={onEdit}
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
        >
          <Edit2 size={18} />
        </button>
      </div>
      
      {/* Profile info */}
      <div className="pt-12 px-4 pb-4">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold">{name}, {age}</h2>
          {isPremium && (
            <div className="ml-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs px-2 py-1 rounded-full">
              Premium
            </div>
          )}
        </div>
        
        {/* Profile completion */}
        <div className="mt-2">
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-gray-600">Profile completion</span>
            <span className="text-yellow-600 font-medium">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Basic Info */}
        <div className="mt-4 space-y-3">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">About</h3>
            <p className="text-gray-600">{about || "Add something about yourself..."}</p>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-600">
            <MapPin size={16} />
            <span>{place || "Add your location..."}</span>
          </div>
          
          {work && (
            <div className="flex items-center space-x-1 text-gray-600">
              <Briefcase size={16} />
              <span>{work}</span>
            </div>
          )}
          
          {education && (
            <div className="flex items-center space-x-1 text-gray-600">
              <GraduationCap size={16} />
              <span>{education}</span>
            </div>
          )}
          
          {religion && (
            <div className="flex items-center space-x-1 text-gray-600">
              <Shield size={16} />
              <span>{religion}{caste ? ` • ${caste}` : ''}</span>
            </div>
          )}
        </div>
        
        {/* Interests */}
        {interests && interests.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* CTA button */}
        <button
          onClick={onEdit}
          className="w-full mt-6 flex justify-center items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition-colors"
        >
          <span>Complete Your Profile</span>
          <Edit2 size={16} />
        </button>
      </div>
    </div>
  );
};
