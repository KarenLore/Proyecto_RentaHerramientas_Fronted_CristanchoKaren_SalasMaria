import { createElement } from '../utils/ui.js';
import { SITE_CONFIG } from '../config.js';

// Create and return the footer component
export const renderFooter = () => {
  const footer = createElement('footer', { className: 'footer' });
  
  const container = createElement('div', { className: 'container' });
  
  // Footer grid
  const footerGrid = createElement('div', { className: 'footer-grid' });
  
  // Company info column
  const companyColumn = createElement('div', { className: 'footer-column' }, [
    createElement('h4', {}, 'About Us'),
    createElement('p', {}, SITE_CONFIG.description),
    createElement('div', { className: 'footer-social' }, [
      createElement('a', { 
        href: SITE_CONFIG.social.facebook,
        target: '_blank',
        className: 'social-icon'
      }, [
        createElement('i', { className: 'bi bi-facebook' })
      ]),
      createElement('a', { 
        href: SITE_CONFIG.social.twitter,
        target: '_blank',
        className: 'social-icon'
      }, [
        createElement('i', { className: 'bi bi-twitter-x' })
      ]),
      createElement('a', { 
        href: SITE_CONFIG.social.instagram,
        target: '_blank',
        className: 'social-icon'
      }, [
        createElement('i', { className: 'bi bi-instagram' })
      ])
    ])
  ]);
  
  // Links column
  const linksColumn = createElement('div', { className: 'footer-column' }, [
    createElement('h4', {}, 'Quick Links'),
    createElement('ul', { className: 'footer-links' }, [
      createElement('li', { className: 'footer-link' }, [
        createElement('a', { href: '/' }, 'Home')
      ]),
      createElement('li', { className: 'footer-link' }, [
        createElement('a', { href: '/catalog' }, 'Browse Tools')
      ]),
      createElement('li', { className: 'footer-link' }, [
        createElement('a', { href: '/login' }, 'Login')
      ]),
      createElement('li', { className: 'footer-link' }, [
        createElement('a', { href: '/register' }, 'Create Account')
      ])
    ])
  ]);
  
  // Categories column
  const categoriesColumn = createElement('div', { className: 'footer-column' }, [
    createElement('h4', {}, 'Categories'),
    createElement('ul', { className: 'footer-links' }, [
      createElement('li', { className: 'footer-link' }, [
        createElement('a', { href: '/catalog?category=1' }, 'Power Tools')
      ]),
      createElement('li', { className: 'footer-link' }, [
        createElement('a', { href: '/catalog?category=2' }, 'Hand Tools')
      ]),
      createElement('li', { className: 'footer-link' }, [
        createElement('a', { href: '/catalog?category=4' }, 'Garden Tools')
      ]),
      createElement('li', { className: 'footer-link' }, [
        createElement('a', { href: '/catalog?category=5' }, 'Ladders & Scaffolding')
      ])
    ])
  ]);
  
  // Contact column
  const contactColumn = createElement('div', { className: 'footer-column' }, [
    createElement('h4', {}, 'Contact Us'),
    createElement('ul', { className: 'footer-links' }, [
      createElement('li', { className: 'footer-link' }, [
        createElement('i', { className: 'bi bi-envelope' }),
        ' ',
        createElement('a', { href: `mailto:${SITE_CONFIG.contact.email}` }, SITE_CONFIG.contact.email)
      ]),
      createElement('li', { className: 'footer-link' }, [
        createElement('i', { className: 'bi bi-telephone' }),
        ' ',
        createElement('a', { href: `tel:${SITE_CONFIG.contact.phone.replace(/\D/g, '')}` }, SITE_CONFIG.contact.phone)
      ]),
      createElement('li', { className: 'footer-link' }, [
        createElement('i', { className: 'bi bi-geo-alt' }),
        ' ',
        SITE_CONFIG.contact.address
      ])
    ])
  ]);
  
  // Footer bottom
  const footerBottom = createElement('div', { className: 'footer-bottom' }, [
    createElement('p', {}, `© ${new Date().getFullYear()} ${SITE_CONFIG.name}. All rights reserved.`)
  ]);
  
  // Assemble footer
  footerGrid.appendChild(companyColumn);
  footerGrid.appendChild(linksColumn);
  footerGrid.appendChild(categoriesColumn);
  footerGrid.appendChild(contactColumn);
  
  container.appendChild(footerGrid);
  container.appendChild(footerBottom);
  footer.appendChild(container);
  
  return footer;
};