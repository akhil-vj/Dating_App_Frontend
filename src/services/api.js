// API service using native fetch instead of axios

const API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

// Create API service object
const api = {
  // Base headers for JSON requests
  headers() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  },
  
  // GET request
  async get(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers(),
        ...options,
      });
      
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  },
  
  // POST request
  async post(endpoint, data, options = {}) {
    const url = `${API_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify(data),
        ...options,
      });
      
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  },
  
  // PUT request
  async put(endpoint, data, options = {}) {
    const url = `${API_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.headers(),
        body: JSON.stringify(data),
        ...options,
      });
      
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  },
  
  // DELETE request
  async delete(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.headers(),
        ...options,
      });
      
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  },
  
  // Response handler
  async handleResponse(response) {
    // Handle 401 Unauthorized
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Redirect to login page if in browser environment
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      
      throw new Error('Unauthorized access. Please log in again.');
    }
    
    // Check if the request was successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }
    
    // If response is no-content
    if (response.status === 204) {
      return null;
    }
    
    // Parse JSON response
    try {
      const data = await response.json();
      return data;
    } catch (error) {
      // If response is not JSON
      return response;
    }
  },
  
  // Error handler
  handleError(error) {
    console.error('API request error:', error);
    throw error;
  }
};

export default api;
