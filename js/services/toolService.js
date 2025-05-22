import { API_URL } from '../config.js';
import { AuthService } from './authService.js';
import { showNotification } from '../utils/ui.js';

export class ToolService {
  static async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async getAllTools() {
    try {
      const response = await fetch(`${API_URL}/api/tools`);
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching tools:', error);
      showNotification(error.message || 'Failed to fetch tools', 'error');
      return [];
    }
  }

  static async getToolById(id) {
    try {
      const response = await fetch(`${API_URL}/api/tools/${id}`);
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error fetching tool ${id}:`, error);
      showNotification(error.message || 'Failed to fetch tool details', 'error');
      return null;
    }
  }

  static async createTool(toolData) {
    if (!AuthService.isAuthenticated()) {
      showNotification('You must be logged in to add tools', 'error');
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/api/tools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AuthService.getToken()}`
        },
        body: JSON.stringify(toolData)
      });
      const result = await this.handleResponse(response);
      showNotification('Tool created successfully', 'success');
      return result;
    } catch (error) {
      console.error('Error creating tool:', error);
      showNotification(error.message || 'Failed to create tool', 'error');
      return null;
    }
  }
  
  // Update tool
  static async updateTool(id, toolData) {
    if (!AuthService.isAuthenticated()) {
      showNotification('You must be logged in to update tools', 'error');
      return null;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/tools/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AuthService.getToken()}`
        },
        body: JSON.stringify(toolData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update tool');
      }
      
      showNotification('Tool updated successfully', 'success');
      return await response.json();
    } catch (error) {
      console.error(`Error updating tool ${id}:`, error);
      showNotification(error.message, 'error');
      return null;
    }
  }
  
  // Delete tool
  static async deleteTool(id) {
    if (!AuthService.isAuthenticated()) {
      showNotification('You must be logged in to delete tools', 'error');
      return false;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/tools/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete tool');
      }
      
      showNotification('Tool deleted successfully', 'success');
      return true;
    } catch (error) {
      console.error(`Error deleting tool ${id}:`, error);
      showNotification(error.message, 'error');
      return false;
    }
  }
  
  // Get tools by category
  static async getToolsByCategory(categoryId) {
    try {
      const response = await fetch(`${API_URL}/api/tools?category=${categoryId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tools by category');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching tools for category ${categoryId}:`, error);
      return [];
    }
  }
  
  // Get tools by supplier
  static async getToolsBySupplier(supplierId) {
    try {
      const response = await fetch(`${API_URL}/api/tools?supplier=${supplierId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch supplier tools');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching tools for supplier ${supplierId}:`, error);
      return [];
    }
  }
  
  // Search tools
  static async searchTools(query) {
    try {
      const response = await fetch(`${API_URL}/api/tools/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }
}