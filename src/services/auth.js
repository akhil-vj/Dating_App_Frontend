import { api } from './api';

// Simple token-based authentication service
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export const auth = {
  // Get current user from local storage or session
  getCurrentUser: async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userData = localStorage.getItem(USER_DATA_KEY);
    
    if (!token || !userData) {
      return null;
    }

    try {
      // Validate token with backend if needed
      // const response = await api.get('/auth/validate');
      // if (!response.success) {
      //   return null;
      // }
      
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error validating auth token:', error);
      return null;
    }
  },
  
  // Login user
  login: async (email, password) => {
    try {
      // Replace with actual API call in production
      // const response = await api.post('/auth/login', { email, password });
      
      // Demo implementation for prototype
      if (email && password) {
        const userData = {
          id: 'user-123',
          email,
          name: email.split('@')[0],
          // Add other user data as needed
        };
        
        // Store auth data
        localStorage.setItem(AUTH_TOKEN_KEY, 'demo-token-' + Date.now());
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
        
        return userData;
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Register user
  register: async (userData) => {
    try {
      // Replace with actual API call in production
      // const response = await api.post('/auth/register', userData);
      
      // Demo implementation for prototype
      if (userData.email && userData.password) {
        const newUser = {
          id: 'user-' + Date.now(),
          email: userData.email,
          name: userData.name || userData.email.split('@')[0],
          // Add other user data as needed
        };
        
        // Store auth data
        localStorage.setItem(AUTH_TOKEN_KEY, 'demo-token-' + Date.now());
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(newUser));
        
        return newUser;
      }
      
      throw new Error('Invalid user data');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Logout user
  logout: async () => {
    try {
      // Replace with actual API call in production if needed
      // await api.post('/auth/logout');
      
      // Clear auth data
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  }
};
