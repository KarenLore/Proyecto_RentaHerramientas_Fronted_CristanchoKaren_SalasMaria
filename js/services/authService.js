import { API_URL } from '../config.js';
import { showNotification } from '../utils/ui.js';

// AuthService Class for handling authentication
export class AuthService {
  // Login user
  static async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      
      const data = await response.json();
      
      // Save auth data to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      
      // Dispatch auth event
      window.dispatchEvent(new CustomEvent('auth:login'));
      
      return data;
    } catch (error) {
      showNotification(error.message, 'error');
      throw error;
    }
  }
  
  // Register user
  static async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
      
      const data = await response.json();
      
      // Save auth data to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      
      // Dispatch auth event
      window.dispatchEvent(new CustomEvent('auth:login'));
      
      return data;
    } catch (error) {
      showNotification(error.message, 'error');
      throw error;
    }
  }
  
  // Logout user
  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    
    // Dispatch auth event
    window.dispatchEvent(new CustomEvent('auth:logout'));
    
    showNotification('You have been logged out', 'info');
  }
  
  // Check if user is authenticated
  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }
  
  // Get current user role
  static getUserRole() {
    return localStorage.getItem('role') || null;
  }
  
  // Get current user token
  static getToken() {
    return localStorage.getItem('token') || null;
  }
  
  // Get user data
  static async getCurrentUser() {
    if (!this.isAuthenticated()) {
      return null;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/users/current`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }
}