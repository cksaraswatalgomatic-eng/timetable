// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API Client with JWT token management
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = this.getToken();
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('auth_token');
  }

  // Save token to localStorage
  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Remove token from localStorage
  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Make API request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Add JWT token to headers if available
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 403 && data.error === 'Token expired') {
          this.clearToken();
          window.location.reload();
          throw new Error('Session expired. Please login again.');
        }

        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  // PUT request
  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  // DELETE request
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // ============================================
  // Authentication Endpoints
  // ============================================

  async login(username, password) {
    const response = await this.post('/auth/login', { username, password });
    
    if (response.success && response.token) {
      this.setToken(response.token);
      return response;
    }
    
    throw new Error(response.error || 'Login failed');
  }

  logout() {
    this.clearToken();
  }

  async register(userData) {
    return this.post('/auth/register', userData);
  }

  async getUsers() {
    return this.get('/auth/users');
  }

  async updateUser(userId, updates) {
    return this.put(`/auth/users/${userId}`, updates);
  }

  async deleteUser(userId) {
    return this.delete(`/auth/users/${userId}`);
  }

  async changePassword(currentPassword, newPassword) {
    return this.post('/auth/change-password', { currentPassword, newPassword });
  }

  async resetPassword(userId, newPassword) {
    return this.post('/auth/reset-password', { userId, newPassword });
  }

  // Check if API is available
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Create singleton instance
export const apiClient = new ApiClient();
export default apiClient;
