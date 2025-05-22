import { createElement } from '../utils/ui.js';

// Create and return the 404 not found view
export const notFoundView = () => {
  const container = createElement('div', { className: 'container text-center py-16' });
  
  // 404 content
  const content = createElement('div', { className: 'max-w-md mx-auto' }, [
    createElement('div', { 
      className: 'text-9xl font-bold text-primary mb-4',
      style: 'font-size: 10rem; line-height: 1;'
    }, '404'),
    createElement('h1', { className: 'text-3xl font-bold mb-4' }, 'Page Not Found'),
    createElement('p', { className: 'text-gray mb-8' }, 'The page you are looking for doesn\'t exist or has been moved.'),
    createElement('div', { className: 'flex justify-center gap-4' }, [
      createElement('a', { 
        href: '/',
        className: 'btn btn-primary'
      }, [
        createElement('i', { className: 'bi bi-house mr-2' }),
        'Back to Home'
      ]),
      createElement('a', { 
        href: '/catalog',
        className: 'btn btn-outline'
      }, [
        createElement('i', { className: 'bi bi-search mr-2' }),
        'Browse Tools'
      ])
    ])
  ]);
  
  container.appendChild(content);
  return container;
};