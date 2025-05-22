import { homeView } from './views/homeView.js';
import { catalogView } from './views/catalogView.js';
import { toolDetailView } from './views/toolDetailView.js';
import { loginView } from './views/loginView.js';
import { registerView } from './views/registerView.js';
import { dashboardView } from './views/dashboardView.js';
import { notFoundView } from './views/notFoundView.js';
import { profileView } from './views/profileView.js';
import { supplierToolsView } from './views/supplierToolsView.js';
import { adminPanelView } from './views/adminPanelView.js';
import { checkAuthRoute } from './utils/auth.js';

// Router Class
class Router {
  constructor() {
    this.routes = [
      { path: '/', view: homeView, auth: false },
      { path: '/catalog', view: catalogView, auth: false },
      { path: '/tool/:id', view: toolDetailView, auth: false },
      { path: '/login', view: loginView, auth: false },
      { path: '/register', view: registerView, auth: false },
      { path: '/dashboard', view: dashboardView, auth: true },
      { path: '/profile', view: profileView, auth: true },
      { path: '/supplier/tools', view: supplierToolsView, auth: true, roles: ['SUPPLIER', 'ADMIN'] },
      { path: '/admin', view: adminPanelView, auth: true, roles: ['ADMIN'] }
    ];
    
    this.notFoundView = notFoundView;
  }
  
  // Initialize router
  init() {
    // Handle browser navigation
    window.addEventListener('popstate', () => {
      this.render(window.location.pathname);
    });
    
    // Initial render
    this.render(window.location.pathname);
  }
  
  // Navigate to a path
  navigate(path) {
    window.history.pushState(null, null, path);
    this.render(path);
  }
  
  // Match the path to a route
  match(path) {
    return this.routes.find(route => {
      // Check if route is exact match
      if (route.path === path) {
        return true;
      }
      
      // Check if route has parameters
      if (route.path.includes(':')) {
        const routeParts = route.path.split('/');
        const pathParts = path.split('/');
        
        if (routeParts.length !== pathParts.length) {
          return false;
        }
        
        const params = {};
        
        for (let i = 0; i < routeParts.length; i++) {
          if (routeParts[i].startsWith(':')) {
            const paramName = routeParts[i].substring(1);
            params[paramName] = pathParts[i];
          } else if (routeParts[i] !== pathParts[i]) {
            return false;
          }
        }
        
        route.params = params;
        return true;
      }
      
      return false;
    });
  }
  
  // Render the view for the current path
  render(path) {
    const mainContent = document.getElementById('main-content');
    
    // Find matching route
    const route = this.match(path);
    
    // If no route found, show 404
    if (!route) {
      mainContent.innerHTML = '';
      mainContent.appendChild(this.notFoundView());
      return;
    }
    
    // Check if route requires authentication
    if (!checkAuthRoute(route)) {
      return;
    }
    
    // Render the view
    mainContent.innerHTML = '';
    
    // Create wrapper with fade-in animation
    const wrapper = document.createElement('div');
    wrapper.className = 'page fade-in';
    
    // Render view into wrapper
    const view = route.view(route.params);
    wrapper.appendChild(view);
    
    // Append to main content
    mainContent.appendChild(wrapper);
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Update active nav link
    this.updateActiveNavLink(path);
  }
  
  // Update active nav link
  updateActiveNavLink(path) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      if (href === path || (href !== '/' && path.startsWith(href))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// Create and export router instance
export const router = new Router();