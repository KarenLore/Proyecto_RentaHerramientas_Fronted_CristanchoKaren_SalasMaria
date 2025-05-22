import { router } from './router.js';
import { AuthService } from './services/authService.js';
import { renderNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { checkAuth } from './utils/auth.js';

// Initialize the application
const initApp = () => {
  const app = document.getElementById('app');
  
  // Render common elements
  renderCommonElements();
  
  // Initialize the router
  router.init();
  
  // Check authentication status
  checkAuth();
  
  // Add event listeners
  addEventListeners();
};

// Render common elements like navbar and footer
const renderCommonElements = () => {
  const app = document.getElementById('app');
  
  // Create main content container
  const mainContent = document.createElement('main');
  mainContent.id = 'main-content';
  
  // Append elements to app
  app.innerHTML = '';
  app.appendChild(renderNavbar());
  app.appendChild(mainContent);
  app.appendChild(renderFooter());
};

// Add global event listeners
const addEventListeners = () => {
  // Handle navigation links
  document.addEventListener('click', (e) => {
    // Find closest anchor tag
    const link = e.target.closest('a');
    
    if (link && link.getAttribute('href') && !link.getAttribute('target') && !link.hasAttribute('data-no-route')) {
      e.preventDefault();
      const url = link.getAttribute('href');
      router.navigate(url);
    }
  });
  
  // Handle mobile menu toggle
  document.addEventListener('click', (e) => {
    if (e.target.id === 'mobile-menu-toggle' || e.target.closest('#mobile-menu-toggle')) {
      const navLinks = document.querySelector('.nav-links');
      navLinks.classList.toggle('active');
    }
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.getElementById('mobile-menu-toggle');
    
    if (navLinks && navLinks.classList.contains('active') && !e.target.closest('.nav-links') && e.target !== hamburger && !e.target.closest('#mobile-menu-toggle')) {
      navLinks.classList.remove('active');
    }
  });
  
  // Handle sidebar toggle in dashboard
  document.addEventListener('click', (e) => {
    if (e.target.id === 'sidebar-toggle' || e.target.closest('#sidebar-toggle')) {
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.querySelector('.sidebar-overlay');
      
      if (sidebar) {
        sidebar.classList.toggle('active');
        
        // Create overlay if it doesn't exist
        if (!overlay) {
          const newOverlay = document.createElement('div');
          newOverlay.className = 'sidebar-overlay';
          document.body.appendChild(newOverlay);
          
          setTimeout(() => {
            newOverlay.classList.add('active');
          }, 10);
          
          // Add click event to close sidebar
          newOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            newOverlay.classList.remove('active');
            
            setTimeout(() => {
              newOverlay.remove();
            }, 300);
          });
        } else {
          overlay.classList.toggle('active');
        }
      }
    }
  });
  
  // Handle user dropdown toggle
  document.addEventListener('click', (e) => {
    if (e.target.id === 'user-dropdown-toggle' || e.target.closest('#user-dropdown-toggle')) {
      const dropdown = document.querySelector('.user-dropdown');
      
      if (dropdown) {
        dropdown.classList.toggle('hidden');
      }
    } else if (!e.target.closest('.user-dropdown')) {
      const dropdown = document.querySelector('.user-dropdown');
      
      if (dropdown && !dropdown.classList.contains('hidden')) {
        dropdown.classList.add('hidden');
      }
    }
  });
  
  // Handle logout
  document.addEventListener('click', (e) => {
    if (e.target.id === 'logout-btn' || e.target.closest('#logout-btn')) {
      e.preventDefault();
      AuthService.logout();
      router.navigate('/');
    }
  });
  
  // Handle modal close
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop') || e.target.classList.contains('modal-close')) {
      const modal = e.target.closest('.modal-backdrop') || e.target.closest('.modal').parentNode;
      
      if (modal) {
        modal.classList.remove('active');
        
        setTimeout(() => {
          modal.remove();
        }, 300);
      }
    }
  });
};

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);

// Export functions for testing
export { initApp, renderCommonElements, addEventListeners };