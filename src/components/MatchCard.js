import React from 'react';
import { Heart, X, MessageCircle, Info } from 'lucide-react';

export const MatchCard = ({ 
  profile, 
  onLike, 
  onPass, 
  onViewDetails, 
  onMessage,
  isActive = true 
}) => {
  const {
    name,
    age,
    photo,
    religion,
    location,
    bio,
    distance,
    verified
  } = profile;
  
  return (
    <div 
      className={`relative w-full h-[70vh] md:h-[600px] rounded-xl overflow-hidden shadow-xl ${
        isActive ? 'z-10' : 'z-0 hidden md:block md:opacity-70'
      }`}
    >
      {/* Main image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${photo})` }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      
      {/* Details section */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {/* Basic info */}
        <div className="flex items-center mb-1">
          <h2 className="text-white text-3xl font-bold mr-2">{name}, {age}</h2>
          {verified && (
            <span className="bg-blue-500 text-xs text-white px-2 py-1 rounded-full">
              Verified
            </span>
          )}
        </div>
        
        <div className="flex items-center text-white opacity-90 mb-3">
          <p>{location} • {distance ? `${distance} km away` : 'Nearby'}</p>
        </div>
        
        {/* Religion tag if available */}
        {religion && (
          <span className="inline-block bg-white/20 text-white text-sm px-3 py-1 rounded-full mb-3">
            {religion}
          </span>
        )}
        
        {/* Bio */}
        <p className="text-white text-opacity-95 line-clamp-2 mb-6">{bio}</p>
        
        {/* Action buttons */}
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => onPass(profile)}
            className="bg-white p-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X color="#F43F5E" size={28} />
          </button>
          
          <button
            onClick={() => onViewDetails(profile)}
            className="bg-white p-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <Info color="#0EA5E9" size={28} />
          </button>
          
          <button
            onClick={() => onLike(profile)}
            className="bg-white p-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <Heart color="#F59E0B" size={28} />
          </button>
        </div>
      </div>
      
      {/* Message button (top right) */}
      <button
        onClick={() => onMessage(profile)}
        className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/30 transition-colors"
      >
        <MessageCircle size={20} />
      </button>
    </div>
  );
};
