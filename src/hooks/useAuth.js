import { useState, useEffect, useContext, createContext } from 'react';

// Create auth context
const AuthContext = createContext(null);

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('authToken');
        
        // If no token, user is not logged in
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Check if token is valid by trying to get user data
        // In a real app, this would verify the token with your backend
        const userData = JSON.parse(localStorage.getItem('userData') || 'null');
        
        if (userData) {
          console.log('User loaded from storage:', userData.name);
          setUser(userData);
        } else {
          // Clear invalid storage data
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call to your authentication endpoint
      // const response = await api.post('/auth/login', { email, password });
      
      // For demo purposes, simulate successful login with demo accounts
      if (email === 'demo@example.com' && password === 'password') {
        // Mock successful login
        const userData = {
          id: '123456',
          name: 'Demo User',
          email: 'demo@example.com',
          photo: null,
          completedOnboarding: true, // Track if user completed onboarding
          lastLogin: new Date().toISOString(),
          // Add other user fields as needed
          genderPreference: 'all',
          preferences: {
            ageRange: { min: 18, max: 40 },
            maxDistance: 50,
            interests: ['Travel', 'Music', 'Food']
          }
        };
        
        // Save token and user data to localStorage if rememberMe is enabled
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        if (rememberMe) {
          localStorage.setItem('authToken', mockToken);
          localStorage.setItem('userData', JSON.stringify(userData));
        } else {
          // Use session storage if not remembering
          sessionStorage.setItem('authToken', mockToken);
          sessionStorage.setItem('userData', JSON.stringify(userData));
        }
        
        // Update state
        setUser(userData);
        
        return { success: true };
      }
      
      // Mock failed login
      return { 
        success: false, 
        error: 'Invalid email or password. Try using demo@example.com / password' 
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Login failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call to your registration endpoint
      // const response = await api.post('/auth/register', userData);
      
      // For demo purposes, simulate successful registration
      const { email, name, password } = userData;
      
      // Simple validation
      if (!email || !name || !password) {
        return {
          success: false,
          error: 'Please fill in all required fields'
        };
      }
      
      // Create mock user data
      const newUser = {
        id: 'new-' + Date.now(),
        name,
        email,
        photo: null,
        // Add default preferences
        genderPreference: 'all',
        preferences: {
          ageRange: { min: 18, max: 40 },
          maxDistance: 25
        }
      };
      
      // Save token and user data to localStorage
      const mockToken = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('userData', JSON.stringify(newUser));
      
      // Update state
      setUser(newUser);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: 'Registration failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // In a real app, you would call an API endpoint to invalidate the token
      // await api.post('/auth/logout');
      
      // Clear local and session storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userData');
      
      // Clear user state
      setUser(null);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { 
        success: false, 
        error: 'Failed to logout. Please try again.' 
      };
    }
  };

  // Update user function
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call to update the profile
      // const response = await api.put('/profile', profileData);
      
      // For demo, we'll update the user data in localStorage
      if (user) {
        const updatedUser = {
          ...user,
          ...profileData,
          // You might handle photo upload separately in a real app
        };
        
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        sessionStorage.setItem('userData', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        return { success: true };
      }
      
      return { 
        success: false, 
        error: 'User not found. Please log in again.' 
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        error: 'Failed to update profile. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Update gender preference
  const setGenderPreference = async (preference) => {
    try {
      setLoading(true);
      
      // In a real app, this would update the preference on the server
      // const response = await api.put('/preferences/gender', { preference });
      
      if (user) {
        const updatedUser = {
          ...user,
          genderPreference: preference
        };
        
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        sessionStorage.setItem('userData', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        return { success: true };
      }
      
      return { 
        success: false, 
        error: 'User not found. Please log in again.' 
      };
    } catch (error) {
      console.error('Preference update error:', error);
      return { 
        success: false, 
        error: 'Failed to update preference. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Password reset request
  const requestPasswordReset = async (email) => {
    try {
      // In a real app, this would send a password reset email
      // const response = await api.post('/auth/reset-password-request', { email });
      
      // For demo, just simulate success
      return { success: true };
    } catch (error) {
      console.error('Password reset request error:', error);
      return { 
        success: false, 
        error: 'Failed to request password reset. Please try again.' 
      };
    }
  };

  // Password reset
  const resetPassword = async (token, newPassword) => {
    try {
      // In a real app, this would verify the token and update the password
      // const response = await api.post('/auth/reset-password', { token, newPassword });
      
      // For demo, just simulate success
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { 
        success: false, 
        error: 'Failed to reset password. Please try again.' 
      };
    }
  };

  // Track login steps completion
  const completeOnboarding = async () => {
    try {
      if (user) {
        const updatedUser = {
          ...user,
          completedOnboarding: true
        };
        
        // Update storage
        if (localStorage.getItem('userData')) {
          localStorage.setItem('userData', JSON.stringify(updatedUser));
        }
        if (sessionStorage.getItem('userData')) {
          sessionStorage.setItem('userData', JSON.stringify(updatedUser));
        }
        
        // Update state
        setUser(updatedUser);
        
        return { success: true };
      }
      
      return { success: false, error: 'No active user session' };
    } catch (error) {
      console.error('Onboarding completion error:', error);
      return { success: false, error: 'Failed to update onboarding status' };
    }
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    setGenderPreference,
    requestPasswordReset,
    resetPassword,
    completeOnboarding, // Add the new function
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
