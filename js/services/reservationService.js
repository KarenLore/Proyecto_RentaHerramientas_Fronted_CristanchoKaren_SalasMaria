import { API_URL } from '../config.js';
import { AuthService } from './authService.js';
import { showNotification } from '../utils/ui.js';

// ReservationService for handling reservation-related API calls
export class ReservationService {
  // Create a new reservation
  static async createReservation(reservationData) {
    if (!AuthService.isAuthenticated()) {
      showNotification('You must be logged in to make reservations', 'error');
      return null;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AuthService.getToken()}`
        },
        body: JSON.stringify(reservationData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create reservation');
      }
      
      showNotification('Reservation created successfully', 'success');
      return await response.json();
    } catch (error) {
      console.error('Error creating reservation:', error);
      showNotification(error.message, 'error');
      return null;
    }
  }
  
  // Get all reservations for current user
  static async getUserReservations() {
    if (!AuthService.isAuthenticated()) {
      return [];
    }
    
    try {
      const response = await fetch(`${API_URL}/api/reservations/user`, {
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user reservations:', error);
      return [];
    }
  }
  
  // Get all reservations for supplier
  static async getSupplierReservations() {
    if (!AuthService.isAuthenticated()) {
      return [];
    }
    
    try {
      const response = await fetch(`${API_URL}/api/reservations/supplier`, {
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch supplier reservations');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching supplier reservations:', error);
      return [];
    }
  }
  
  // Get reservation by ID
  static async getReservationById(id) {
    if (!AuthService.isAuthenticated()) {
      showNotification('You must be logged in to view reservations', 'error');
      return null;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/reservations/${id}`, {
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch reservation details');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching reservation ${id}:`, error);
      return null;
    }
  }
  
  // Update reservation status
  static async updateReservationStatus(id, status) {
    if (!AuthService.isAuthenticated()) {
      showNotification('You must be logged in to update reservations', 'error');
      return null;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/reservations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AuthService.getToken()}`
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update reservation status');
      }
      
      showNotification('Reservation status updated', 'success');
      return await response.json();
    } catch (error) {
      console.error(`Error updating reservation ${id}:`, error);
      showNotification(error.message, 'error');
      return null;
    }
  }
  
  // Cancel reservation
  static async cancelReservation(id) {
    if (!AuthService.isAuthenticated()) {
      showNotification('You must be logged in to cancel reservations', 'error');
      return false;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/reservations/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel reservation');
      }
      
      showNotification('Reservation cancelled successfully', 'success');
      return true;
    } catch (error) {
      console.error(`Error cancelling reservation ${id}:`, error);
      showNotification(error.message, 'error');
      return false;
    }
  }
  
  // Check tool availability for given dates
  static async checkAvailability(toolId, startDate, endDate) {
    try {
      const response = await fetch(
        `${API_URL}/api/tools/${toolId}/availability?startDate=${startDate}&endDate=${endDate}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to check availability');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error checking availability:', error);
      return { available: false, message: 'Error checking availability' };
    }
  }
}