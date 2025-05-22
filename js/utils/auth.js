import { AuthService } from '../services/authService.js';
import { router } from '../router.js';
import { showNotification } from './ui.js';

// Check if user is authenticated
export const checkAuth = () => {
  // Add auth-related classes to body
  if (AuthService.isAuthenticated()) {
    document.body.classList.add('is-authenticated');
    document.body.classList.remove('is-guest');
    
    const role = AuthService.getUserRole();
    if (role) {
      document.body.classList.add(`role-${role.toLowerCase()}`);
    }
  } else {
    document.body.classList.add('is-guest');
    document.body.classList.remove('is-authenticated');
    document.body.classList.remove('role-admin', 'role-supplier', 'role-client');
  }
  
  // Update navbar
  updateNavbar();
  
  // Listen for auth events
  window.addEventListener('auth:login', updateNavbar);
  window.addEventListener('auth:logout', updateNavbar);
};

// Update navbar based on auth state
const updateNavbar = () => {
  const userDropdownToggle = document.getElementById('user-dropdown-toggle');
  const guestNav = document.getElementById('guest-nav');
  const userNav = document.getElementById('user-nav');
  
  if (AuthService.isAuthenticated()) {
    if (guestNav) guestNav.classList.add('hidden');
    if (userNav) userNav.classList.remove('hidden');
    
    // Update user role display
    const roleDisplay = document.getElementById('user-role');
    if (roleDisplay) {
      const role = AuthService.getUserRole();
      roleDisplay.textContent = role || 'User';
    }
  } else {
    if (guestNav) guestNav.classList.remove('hidden');
    if (userNav) userNav.classList.add('hidden');
  }
};

// Check if user has access to a route
export const checkAuthRoute = (route) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const userRole = AuthService.getUserRole();
  
  // If route requires authentication and user is not authenticated
  if (route.auth && !isAuthenticated) {
    showNotification('Please log in to access this page', 'warning');
    router.navigate('/login');
    return false;
  }
  
  // If route is login/register and user is already authenticated
  if ((route.path === '/login' || route.path === '/register') && isAuthenticated) {
    router.navigate('/dashboard');
    return false;
  }
  
  // If route requires specific roles
  if (route.roles && isAuthenticated) {
    if (!route.roles.includes(userRole)) {
      showNotification('You do not have permission to access this page', 'error');
      router.navigate('/dashboard');
      return false;
    }
  }
  
  return true;
};

// Check if user has a specific role
export const hasRole = (role) => {
  const userRole = AuthService.getUserRole();
  return userRole === role;
};