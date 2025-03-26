import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  User, 
  Star, 
  X 
} from 'lucide-react';

// Simulated profile data
const sampleProfiles = [
  {
    id: 1,
    name: 'Jenifer',
    age: 22,
    college: 'Pazhasiraja college, 2025',
    location: 'Wayanad',
    religion: 'Christian',
    image: '/api/placeholder/400/400',
    bio: 'Ente favourite spot'
  }
];

const ArikeDatingApp = () => {
  const [currentScreen, setCurrentScreen] = useState('discover');
  const [currentProfileIndex] = useState(0);

  const renderDiscoverScreen = () => {
    const profile = sampleProfiles[currentProfileIndex];
    
    return (
      <div className="relative h-full">
        {/* Profile Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${profile.image})`,
            filter: 'brightness(0.9)'
          }}
        />
        
        {/* Profile Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold">{profile.name} {profile.age}</h2>
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                  Verified
                </span>
              </div>
              <p>{profile.college}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span>📍 {profile.location}</span>
                <span>• {profile.religion}</span>
              </div>
              <p className="mt-2 italic">"{profile.bio}"</p>
            </div>
            <button className="bg-yellow-500 p-2 rounded-full">
              <MessageCircle color="white" />
            </button>
          </div>
          
          {/* Swipe Buttons */}
          <div className="flex justify-center space-x-8 mt-4 pb-4">
            <button 
              className="bg-white/20 p-4 rounded-full backdrop-blur-sm"
              onClick={() => handleSwipe(false)}
            >
              <X color="white" size={32} />
            </button>
            <button 
              className="bg-white/20 p-4 rounded-full backdrop-blur-sm"
              onClick={() => handleSwipe(true)}
            >
              <Heart color="white" size={32} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderNotesScreen = () => (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Notes</h1>
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <div className="flex justify-center mb-4">
          <img 
            src="/api/placeholder/100/100" 
            alt="Notes Icon" 
            className="w-16 h-16"
          />
        </div>
        <p>Notes sent to you will be shown here</p>
      </div>
      <div className="mt-4 bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold">Interested in you</h2>
        <p className="text-gray-500">Premium members can see all their likes</p>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded mt-2">
          Upgrade
        </button>
      </div>
    </div>
  );

  const renderMatchesScreen = () => (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Matches</h1>
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <div className="flex justify-center mb-4">
          <img 
            src="/api/placeholder/100/100" 
            alt="Matches Icon" 
            className="w-16 h-16"
          />
        </div>
        <p>You don't have any matches yet</p>
        <p className="text-gray-500 mt-2">Keep swiping to find your perfect match!</p>
      </div>
    </div>
  );

  const renderProfileScreen = () => (
    <div className="p-4">
      <div className="flex flex-col items-center">
        <img 
          src="/api/placeholder/150/150" 
          alt="Profile" 
          className="rounded-full w-32 h-32 object-cover"
        />
        <div className="flex items-center mt-2">
          <h2 className="text-xl font-bold mr-2">Akhil</h2>
          <span className="text-blue-500">✓</span>
        </div>
        <p className="text-gray-500">55% profile complete</p>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
          <div className="flex items-center">
            <span className="mr-3">✏️</span>
            <span>Edit Profile</span>
          </div>
          <span className="text-red-500">!</span>
        </div>
        
        {[
          'Preferences', 
          'Your Likes', 
          'Recent Passes', 
          'Instagram', 
          'Help Center'
        ].map((item) => (
          <div 
            key={item} 
            className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
          >
            <span>{item}</span>
            <span>➡️</span>
          </div>
        ))}

        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4 rounded-lg text-white text-center">
          <span className="text-white font-bold">arike Select</span>
        </div>
      </div>
    </div>
  );

  const handleSwipe = (like) => {
    // Implement swipe logic
    console.log(like ? 'Liked' : 'Passed');
  };

  const renderBottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white flex justify-around p-3 border-t">
      <button 
        className={`${currentScreen === 'discover' ? 'text-yellow-500' : 'text-gray-500'}`}
        onClick={() => setCurrentScreen('discover')}
      >
        <Star />
      </button>
      <button 
        className={`${currentScreen === 'notes' ? 'text-yellow-500' : 'text-gray-500'}`}
        onClick={() => setCurrentScreen('notes')}
      >
        <MessageCircle />
      </button>
      <button 
        className={`${currentScreen === 'matches' ? 'text-yellow-500' : 'text-gray-500'}`}
        onClick={() => setCurrentScreen('matches')}
      >
        <Heart />
      </button>
      <button 
        className={`${currentScreen === 'profile' ? 'text-yellow-500' : 'text-gray-500'}`}
        onClick={() => setCurrentScreen('profile')}
      >
        <User />
      </button>
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-grow relative">
        {currentScreen === 'discover' && renderDiscoverScreen()}
        {currentScreen === 'notes' && renderNotesScreen()}
        {currentScreen === 'matches' && renderMatchesScreen()}
        {currentScreen === 'profile' && renderProfileScreen()}
      </div>
      {renderBottomNavigation()}
    </div>
  );
};

export default ArikeDatingApp;
