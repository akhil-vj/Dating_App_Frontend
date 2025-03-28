import React, { useState } from 'react';
import { useMatching } from '../hooks/useMatching';
import { LoadingIndicator } from './LoadingIndicator';
import ProfileCard from './ProfileCard';
import NoMoreProfiles from './NoMoreProfiles';
import SimplePreferencesModal from './SimplePreferencesModal';

function DiscoverScreen() {
  const { profiles, loading, error, hasMore, refreshRecommendations, updatePreferences } = useMatching();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedProfiles, setViewedProfiles] = useState(new Set());
  const [showPreferences, setShowPreferences] = useState(false);

  const handleLike = (profileId) => {
    // In a real app, send this to your API
    console.log('Liked profile:', profileId);
    handleNext();
  };

  const handlePass = (profileId) => {
    // In a real app, send this to your API
    console.log('Passed on profile:', profileId);
    handleNext();
  };

  const handleNext = () => {
    // Mark the current profile as viewed
    if (profiles[currentIndex]) {
      setViewedProfiles(prev => new Set(prev).add(profiles[currentIndex].id));
    }
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  const handleSavePreferences = (preferences) => {
    updatePreferences(preferences);
    setShowPreferences(false);
    // Reset the view after updating preferences
    setCurrentIndex(0);
    setViewedProfiles(new Set());
    refreshRecommendations();
  };

  // Calculate if we have profiles left to show
  const noMoreProfilesToShow = !loading && profiles.length > 0 && currentIndex >= profiles.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingIndicator />
        <span className="ml-2">Finding people near you...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={refreshRecommendations}
          className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!profiles.length || !hasMore) {
    return (
      <>
        <NoMoreProfiles 
          onRefresh={refreshRecommendations} 
          onOpenPreferences={() => setShowPreferences(true)}
        />
        <SimplePreferencesModal 
          isOpen={showPreferences}
          onClose={() => setShowPreferences(false)}
          onSave={handleSavePreferences}
        />
      </>
    );
  }

  // Show the "no more profiles" component when we've gone through all profiles
  if (noMoreProfilesToShow) {
    return (
      <>
        <NoMoreProfiles 
          onRefresh={refreshRecommendations}
          onOpenPreferences={() => setShowPreferences(true)}
        />
        <SimplePreferencesModal 
          isOpen={showPreferences}
          onClose={() => setShowPreferences(false)}
          onSave={handleSavePreferences}
        />
      </>
    );
  }

  // Display the current profile
  const currentProfile = profiles[currentIndex];

  return (
    <div className="max-w-md mx-auto p-4">
      {currentProfile && (
        <ProfileCard 
          profile={currentProfile}
          onLike={() => handleLike(currentProfile.id)}
          onPass={() => handlePass(currentProfile.id)}
        />
      )}
      <SimplePreferencesModal 
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        onSave={handleSavePreferences}
      />
    </div>
  );
}

export default DiscoverScreen;
