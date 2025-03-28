import { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { useAuth } from './useAuth';
import keralaProfiles from '../data/keralaProfiles';

export const useMatching = () => {
  const [likes, setLikes] = useState(() => StorageService.get('LIKES') || []);
  const [passes, setPasses] = useState(() => StorageService.get('PASSES') || []);
  const [matches, setMatches] = useState(() => StorageService.get('MATCHES') || []);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [preferences, setPreferences] = useState({
    genderPreference: 'all',
    ageRange: { min: 18, max: 50 },
    maxDistance: 50,
    interests: [],
    educationLevel: 'any',
    relationshipType: 'any',
    district: 'any'
  });
  const { user } = useAuth();

  useEffect(() => {
    StorageService.set('LIKES', likes);
  }, [likes]);

  useEffect(() => {
    StorageService.set('PASSES', passes);
  }, [passes]);
  
  useEffect(() => {
    StorageService.set('MATCHES', matches);
  }, [matches]);

  // Function to refresh recommendations
  const refreshRecommendations = () => {
    setLoading(true);
    setRefreshTrigger(prev => prev + 1);
    // In a real app, this would reset viewed profiles in the backend
    setHasMore(true);
  };

  // Function to update preferences
  const updatePreferences = async (newPreferences) => {
    // In a real app, this would send to the backend API
    console.log('Updating preferences:', newPreferences);
    setPreferences(newPreferences);
    
    // Mock API response
    return { success: true };
  };

  useEffect(() => {
    // If user has preferences, load them
    if (user && user.preferences) {
      setPreferences(prev => ({
        ...prev,
        ...(user.preferences || {}),
        genderPreference: user.genderPreference || prev.genderPreference
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/matches');
        // const data = await response.json();
        
        // For demo purposes, use Kerala profiles and filter by preference
        let filteredProfiles = [];
        
        // Filter profiles based on user's gender preference
        if (preferences.genderPreference) {
          if (preferences.genderPreference === 'men') {
            filteredProfiles = keralaProfiles.getProfilesByGender('male');
          } else if (preferences.genderPreference === 'women') {
            filteredProfiles = keralaProfiles.getProfilesByGender('female');
          } else {
            // If preference is 'all', get all profiles
            filteredProfiles = keralaProfiles.getAllProfiles();
          }
          
          // Apply age filter if we have age preferences
          if (preferences.ageRange) {
            filteredProfiles = filteredProfiles.filter(profile => 
              profile.age >= preferences.ageRange.min && profile.age <= preferences.ageRange.max
            );
          }

          // Apply district filter
          if (preferences.district && preferences.district !== 'any') {
            filteredProfiles = filteredProfiles.filter(profile => 
              profile.location.toLowerCase().includes(preferences.district.toLowerCase())
            );
          }

          // Apply education level filter
          if (preferences.educationLevel && preferences.educationLevel !== 'any') {
            filteredProfiles = filteredProfiles.filter(profile => 
              profile.education && profile.education.toLowerCase().includes(preferences.educationLevel.toLowerCase())
            );
          }

          // Apply relationship type filter
          if (preferences.relationshipType && preferences.relationshipType !== 'any') {
            // In a real app, profiles would have a "lookingFor" field
            // This is a simplified version for the demo
            filteredProfiles = filteredProfiles.filter(profile => 
              profile.bio && profile.bio.toLowerCase().includes("looking for")
            );
          }

          // Apply interests filter
          if (preferences.interests && preferences.interests.length > 0) {
            filteredProfiles = filteredProfiles.filter(profile => {
              // Check if profile has any of the preferred interests
              return preferences.interests.some(interest => 
                profile.interests && profile.interests.includes(interest)
              );
            });
          }
          
          // Randomize order for variety
          filteredProfiles.sort(() => Math.random() - 0.5);

          // In a real app, you would filter out already viewed/matched profiles
          // This simulates having profiles to show
          if (filteredProfiles.length === 0) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        }
        
        setProfiles(filteredProfiles);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load profiles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfiles();
    }
  }, [user, refreshTrigger, preferences]);

  // Enhanced handleLike with match detection
  const handleLike = (profile) => {
    // Prevent double-processing
    if (isProcessingAction) return false;
    
    try {
      setIsProcessingAction(true);
      
      // Check if the profile is already in likes
      const isAlreadyLiked = likes.some(p => p.id === profile.id);
      if (isAlreadyLiked) {
        return false;
      }
      
      // Process like
      const timestamp = Date.now();
      const newLike = { ...profile, timestamp, likedAt: new Date().toISOString() };
      
      setLikes(prev => [...prev, newLike]);
      
      // Check for match
      let isMatch = false;
      
      // In a real app, we'd check with the backend
      // For the demo, simulate some profiles liking the user back (20% chance)
      isMatch = profile.likesYou || Math.random() < 0.2;
      
      if (isMatch) {
        // Create match record
        const match = {
          ...profile,
          matchedAt: new Date().toISOString()
        };
        
        setMatches(prev => [...prev, match]);
      }
      
      return { success: true, isMatch };
    } catch (error) {
      console.error('Error handling like:', error);
      return { success: false, error };
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Enhanced handlePass with improved storage management
  const handlePass = (profile) => {
    // Prevent double-processing
    if (isProcessingAction) return false;
    
    try {
      setIsProcessingAction(true);
      
      // Check if the profile is already in passes
      const isAlreadyPassed = passes.some(p => p.id === profile.id);
      if (isAlreadyPassed) {
        return false;
      }
      
      // Process pass
      const timestamp = Date.now();
      setPasses(prev => [...prev, { ...profile, timestamp, passedAt: new Date().toISOString() }]);
      
      // Manage storage limits - keep only the most recent 50 passes
      if (passes.length >= 50) {
        const newPasses = [...passes, { ...profile, timestamp }]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 50);
        
        setPasses(newPasses);
      }
      
      return true;
    } catch (error) {
      console.error('Error handling pass:', error);
      return false;
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Add undo functionality with time limit (within 5 seconds)
  const undoLike = (profileId) => {
    try {
      const likedProfile = likes.find(p => p.id === profileId);
      
      // Only allow undo for recent actions (within last 5 seconds)
      if (!likedProfile || Date.now() - likedProfile.timestamp > 5000) {
        return false;
      }
      
      setLikes(prev => prev.filter(p => p.id !== profileId));
      
      // Also remove from matches if it was a match
      if (matches.some(m => m.id === profileId)) {
        setMatches(prev => prev.filter(m => m.id !== profileId));
      }
      
      return true;
    } catch (error) {
      console.error('Error undoing like:', error);
      return false;
    }
  };

  const undoPass = (profileId) => {
    try {
      const passedProfile = passes.find(p => p.id === profileId);
      
      // Only allow undo for recent actions (within last 5 seconds)
      if (!passedProfile || Date.now() - passedProfile.timestamp > 5000) {
        return false;
      }
      
      setPasses(prev => prev.filter(p => p.id !== profileId));
      
      return true;
    } catch (error) {
      console.error('Error undoing pass:', error);
      return false;
    }
  };
  
  // Add function to get recommendation that haven't been liked or passed
  const getRecommendations = (allProfiles, limit = 10) => {
    try {
      // Filter out profiles that have been liked or passed
      const likedIds = new Set(likes.map(p => p.id));
      const passedIds = new Set(passes.map(p => p.id));
      
      const filteredProfiles = allProfiles.filter(
        profile => !likedIds.has(profile.id) && !passedIds.has(profile.id)
      );
      
      return filteredProfiles.slice(0, limit);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  };

  return {
    likes,
    passes,
    matches,
    handleLike,
    handlePass,
    undoLike,
    undoPass,
    getRecommendations,
    isProcessingAction,
    profiles,
    loading,
    error,
    hasMore,
    refreshRecommendations,
    updatePreferences
  };
};
