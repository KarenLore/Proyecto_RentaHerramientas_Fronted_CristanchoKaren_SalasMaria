import { API_URL } from '../config.js';
import { AuthService } from './authService.js';
import { showNotification } from '../utils/ui.js';

export class CategoryService {
  static async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : data.categories || data;
  }

  static async getAllCategories() {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showNotification(error.message || 'Failed to fetch categories', 'error');
      return [];
    }
  }

  static async getCategoryById(id) {
    try {
      const response = await fetch(`${API_URL}/api/categories/${id}`);
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      showNotification(error.message || 'Failed to fetch category details', 'error');
      return null;
    }
  }

  static async createCategory(categoryData) {
    if (!AuthService.isAuthenticated()) {
      showNotification('You must be logged in to add categories', 'error');
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AuthService.getToken()}`
        },
        body: JSON.stringify(categoryData)
      });
      const result = await this.handleResponse(response);
      showNotification('Category created successfully', 'success');
      return result;
    } catch (error) {
      console.error('Error creating category:', error);
      showNotification(error.message || 'Failed to create category', 'error');
      return null;
    }
  }

  static async updateCategory(id, categoryData) {
    if (!AuthService.isAuthenticated()) {
      showNotification('You must be logged in to update categories', 'error');
      return null;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AuthService.getToken()}`
        },
        body: JSON.stringify(categoryData)
      });
      const result = await this.handleResponse(response);
      showNotification('Category updated successfully', 'success');
      return result;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      showNotification(error.message || 'Failed to update category', 'error');
      return null;
    }
  }

  static async deleteCategory(id) {
    if (!AuthService.isAuthenticated()) {
      showNotification('You must be logged in to delete categories', 'error');
      return false;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete category');
      }
      
      showNotification('Category deleted successfully', 'success');
      return true;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      showNotification(error.message || 'Failed to delete category', 'error');
      return false;
    }
  }
}