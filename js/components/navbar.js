import { AuthService } from '../services/authService.js';
import { createElement } from '../utils/ui.js';
import { SITE_CONFIG } from '../config.js';

// Create and return the navbar component
export const renderNavbar = () => {
  const header = createElement('header', { className: 'header' });
  
  const container = createElement('div', { className: 'container' });
  
  const navbar = createElement('nav', { className: 'navbar' });
  
  // Logo
  const logo = createElement('a', { 
    className: 'logo',
    href: '/'
  }, [
    createElement('i', { className: 'bi bi-tools' }),
    SITE_CONFIG.name
  ]);
  
  // Navigation links
  const navLinks = createElement('ul', { className: 'nav-links' }, [
    createElement('li', {}, [
      createElement('a', { className: 'nav-link', href: '/' }, [
        createElement('i', { className: 'bi bi-house' }),
        'Home'
      ])
    ]),
    createElement('li', {}, [
      createElement('a', { className: 'nav-link', href: '/catalog' }, [
        createElement('i', { className: 'bi bi-grid' }),
        'Catalog'
      ])
    ])
  ]);
  
  // Guest navigation (shown when not logged in)
  const guestNav = createElement('div', { 
    id: 'guest-nav',
    className: AuthService.isAuthenticated() ? 'hidden' : ''
  }, [
    createElement('a', { 
      className: 'btn btn-outline mr-2',
      href: '/login'
    }, 'Login'),
    createElement('a', { 
      className: 'btn btn-primary',
      href: '/register'
    }, 'Register')
  ]);
  
  // User navigation (shown when logged in)
  const userNav = createElement('div', { 
    id: 'user-nav',
    className: AuthService.isAuthenticated() ? '' : 'hidden'
  }, [
    createElement('div', { className: 'user-menu' }, [
      createElement('button', { 
        id: 'user-dropdown-toggle',
        className: 'btn btn-outline'
      }, [
        createElement('i', { className: 'bi bi-person-circle' }),
        createElement('span', { className: 'ml-2' }, 'My Account'),
        createElement('i', { className: 'bi bi-chevron-down ml-2' })
      ]),
      createElement('div', { 
        className: 'user-dropdown hidden'
      }, [
        createElement('div', { 
          className: 'user-dropdown-item' 
        }, [
          createElement('i', { className: 'bi bi-person' }),
          'Role: ',
          createElement('span', { 
            id: 'user-role',
            className: 'font-bold'
          }, AuthService.getUserRole() || 'User')
        ]),
        createElement('a', { 
          className: 'user-dropdown-item',
          href: '/dashboard'
        }, [
          createElement('i', { className: 'bi bi-speedometer' }),
          'Dashboard'
        ]),
        createElement('a', { 
          className: 'user-dropdown-item',
          href: '/profile'
        }, [
          createElement('i', { className: 'bi bi-gear' }),
          'Profile'
        ]),
        // For supplier role
        AuthService.getUserRole() === 'SUPPLIER' ? 
        createElement('a', { 
          className: 'user-dropdown-item',
          href: '/supplier/tools'
        }, [
          createElement('i', { className: 'bi bi-tools' }),
          'My Tools'
        ]) : null,
        // For admin role
        AuthService.getUserRole() === 'ADMIN' ? 
        createElement('a', { 
          className: 'user-dropdown-item',
          href: '/admin'
        }, [
          createElement('i', { className: 'bi bi-shield' }),
          'Admin Panel'
        ]) : null,
        createElement('button', { 
          id: 'logout-btn',
          className: 'user-dropdown-item'
        }, [
          createElement('i', { className: 'bi bi-box-arrow-right' }),
          'Logout'
        ])
      ])
    ])
  ]);
  
  // Mobile menu button
  const hamburger = createElement('button', { 
    id: 'mobile-menu-toggle',
    className: 'hamburger'
  }, [
    createElement('i', { className: 'bi bi-list' })
  ]);
  
  // Assemble navbar
  navbar.appendChild(logo);
  navbar.appendChild(navLinks);
  navbar.appendChild(guestNav);
  navbar.appendChild(userNav);
  navbar.appendChild(hamburger);
  
  container.appendChild(navbar);
  header.appendChild(container);
  
  return header;
};