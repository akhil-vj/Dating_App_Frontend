import React, { useState } from 'react';
import { ChevronRight, Bell, Shield, HelpCircle, LogOut, Moon, Sun, X, User, Heart, MessageSquare, Settings as SettingsIcon, Gift } from 'lucide-react';
import { StorageService } from '../services/storage';
import { useTheme } from '../providers/ThemeProvider';
import { useAuth } from '../hooks/useAuth';
import { HelpCenter } from './HelpCenter';
import { UserFeedbackModal } from './UserFeedbackModal';
import { useNavigate } from 'react-router-dom';
import { LoadingIndicator } from './LoadingIndicator';

export const SettingsScreen = ({ onClose, onShowPreferences }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, setGenderPreference, logout } = useAuth();
  const navigate = useNavigate();
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    return StorageService.get('NOTIFICATION_SETTINGS') || { 
      matches: true,
      messages: true,
      likes: true,
      system: true
    };
  });
  const [genderPreference, setGenderPref] = useState(user?.genderPreference || 'all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleNotificationToggle = (key) => {
    const updatedSettings = {
      ...notifications,
      [key]: !notifications[key]
    };
    setNotifications(updatedSettings);
    StorageService.set('NOTIFICATION_SETTINGS', updatedSettings);
  };

  const handleGenderPrefChange = async (newPreference) => {
    if (newPreference === user.genderPreference) return;
    
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });
    
    try {
      const result = await setGenderPreference(newPreference);
      if (result.success) {
        setGenderPref(newPreference);
        setMessage({ text: 'Preference updated successfully!', type: 'success' });
      } else {
        setMessage({ text: result.error || 'Failed to update preference', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'An unexpected error occurred', type: 'error' });
      console.error('Error updating gender preference:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };
  
  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    
    try {
      const result = await logout();
      
      if (result.success) {
        // Redirect to login page
        navigate('/login');
      } else {
        console.error('Logout failed:', result.error);
        // Show error message if needed
      }
    } catch (error) {
      console.error('Unexpected error during logout:', error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };
  
  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  const handleLogout = () => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      // Redirect to login page would happen via routing
    }
  };
  
  const handleFeedbackSubmit = (feedbackData) => {
    // In a real app, this would send the feedback to a server
    console.log('Feedback submitted:', feedbackData);
    // Store feedback locally for demo purposes
    const existingFeedback = StorageService.get('USER_FEEDBACK') || [];
    StorageService.set('USER_FEEDBACK', [...existingFeedback, {
      ...feedbackData,
      timestamp: new Date().toISOString()
    }]);
  };

  return (
    <div className="bg-white h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Settings</h1>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close settings"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Settings sections */}
      <div className="p-4 pb-20">
        {/* Account section */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Account</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button 
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              onClick={() => {/* Navigate to profile settings */}}
            >
              <div className="flex items-center">
                <User size={20} className="text-gray-500 mr-3" />
                <span>Personal Information</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            
            <div className="border-t border-gray-100"></div>
            
            <button 
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              onClick={onShowPreferences}
            >
              <div className="flex items-center">
                <Heart size={20} className="text-gray-500 mr-3" />
                <span>Dating Preferences</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Notifications section */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Notifications</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Bell size={20} className="text-gray-500 mr-3" />
                <span>New Matches</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={notifications.matches}
                  onChange={() => handleNotificationToggle('matches')}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
              </label>
            </div>
            
            <div className="border-t border-gray-100"></div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare size={20} className="text-gray-500 mr-3" />
                <span>New Messages</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={notifications.messages}
                  onChange={() => handleNotificationToggle('messages')}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
              </label>
            </div>
            
            <div className="border-t border-gray-100"></div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Heart size={20} className="text-gray-500 mr-3" />
                <span>Likes & Interests</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={notifications.likes}
                  onChange={() => handleNotificationToggle('likes')}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Premium section */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Premium</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button 
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              onClick={() => {/* Show premium features */}}
            >
              <div className="flex items-center">
                <Gift size={20} className="text-yellow-500 mr-3" />
                <div className="flex flex-col items-start">
                  <span>Upgrade to Premium</span>
                  <span className="text-xs text-gray-500">Get unlimited likes, see who likes you & more</span>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* App Settings section */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">App Settings</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                {theme === 'dark' ? (
                  <Moon size={20} className="text-gray-500 mr-3" />
                ) : (
                  <Sun size={20} className="text-gray-500 mr-3" />
                )}
                <span>Dark Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
              </label>
            </div>
            
            <div className="border-t border-gray-100"></div>
            
            <button 
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              onClick={() => {/* Navigate to privacy settings */}}
            >
              <div className="flex items-center">
                <Shield size={20} className="text-gray-500 mr-3" />
                <span>Privacy & Security</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Profile Preferences section */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Profile Preferences</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <span>Show me</span>
              </div>
              <div className="space-y-2">
                {['men', 'women', 'all'].map(pref => (
                  <button
                    key={pref}
                    onClick={() => handleGenderPrefChange(pref)}
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-between p-3 rounded border ${
                      genderPreference === pref 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-300'
                    }`}
                  >
                    <span className="capitalize">
                      {pref === 'all' ? 'Everyone' : pref}
                    </span>
                    {genderPreference === pref && (
                      <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Support section */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Support</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button 
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              onClick={() => setShowHelpCenter(true)}
            >
              <div className="flex items-center">
                <HelpCircle size={20} className="text-gray-500 mr-3" />
                <span>Help Center</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            
            <div className="border-t border-gray-100"></div>
            
            <button 
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              onClick={() => setShowFeedback(true)}
            >
              <div className="flex items-center">
                <SettingsIcon size={20} className="text-gray-500 mr-3" />
                <span>Send Feedback</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Logout button */}
        <button 
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          className="w-full bg-gray-100 text-red-600 py-3 rounded-lg hover:bg-gray-200 transition-colors mt-6"
        >
          <div className="flex items-center justify-center">
            {isLoggingOut ? (
              <span className="flex items-center justify-center">
                <LoadingIndicator color="white" />
                <span className="ml-2">Logging out...</span>
              </span>
            ) : (
              <>
                <LogOut size={18} className="mr-2" />
                <span>Log Out</span>
              </>
            )}
          </div>
        </button>

        <div className="text-center text-xs text-gray-400 mt-6">
          <p>Version 1.0.0</p>
          <p className="mt-1">© 2023 Malayali Match. All rights reserved.</p>
        </div>
      </div>
      
      {/* Help center modal */}
      {showHelpCenter && (
        <HelpCenter onClose={() => setShowHelpCenter(false)} />
      )}
      
      {/* Feedback modal */}
      {showFeedback && (
        <UserFeedbackModal 
          onClose={() => setShowFeedback(false)}
          onSubmit={handleFeedbackSubmit}
        />
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">Log Out?</h3>
            <p className="mb-6 text-gray-600">Are you sure you want to log out of your account?</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleLogoutCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
