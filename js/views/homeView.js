import { createElement } from '../utils/ui.js';
import { TOOL_CATEGORIES, TOOL_IMAGES, SITE_CONFIG } from '../config.js';

export const homeView = () => {
  const container = createElement('div', { className: 'container' });
  
  // Hero section
  const hero = createElement('div', { className: 'hero' }, [
    createElement('div', { className: 'hero-pattern' }),
    createElement('div', { className: 'container' }, [
      createElement('div', { className: 'hero-content' }, [
        createElement('h1', { className: 'hero-title' }, 'Alquila las Herramientas Perfectas para tu Proyecto'),
        createElement('p', { className: 'hero-text' }, 'Accede a herramientas de alta calidad sin la necesidad de comprarlas. Nuestra plataforma hace que tus proyectos sean más fáciles y económicos.'),
        createElement('div', { className: 'flex gap-4' }, [
          createElement('a', { 
            href: '/catalog',
            className: 'btn btn-lg btn-accent'
          }, [
            createElement('i', { className: 'bi bi-search' }),
            'Explorar Herramientas'
          ]),
          createElement('a', { 
            href: '/register',
            className: 'btn btn-lg btn-outline'
          }, [
            createElement('i', { className: 'bi bi-person-plus' }),
            'Únete Ahora'
          ])
        ])
      ])
    ])
  ]);

  // Sobre Nosotros section
  const aboutUs = createElement('section', { className: 'section bg-gray-50' }, [
    createElement('div', { className: 'container' }, [
      createElement('h2', { className: 'text-center text-3xl font-bold mb-8' }, 'Sobre Nosotros'),
      createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-8 items-center' }, [
        createElement('div', {}, [
          createElement('img', {
            src: 'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg',
            alt: 'Equipo RentaTools',
            className: 'rounded-lg shadow-lg'
          })
        ]),
        createElement('div', {}, [
          createElement('h3', { className: 'text-2xl font-bold mb-4' }, '¿Quiénes Somos?'),
          createElement('p', { className: 'mb-4' }, 'Somos la plataforma líder en alquiler de herramientas y equipos de construcción en México. Conectamos a propietarios de herramientas con personas que las necesitan, creando una comunidad colaborativa y eficiente.'),
          createElement('h3', { className: 'text-2xl font-bold mb-4' }, 'Nuestra Misión'),
          createElement('p', { className: 'mb-4' }, 'Facilitar el acceso a herramientas de calidad para todos los profesionales y entusiastas del bricolaje, promoviendo la economía colaborativa y el uso eficiente de recursos.'),
          createElement('h3', { className: 'text-2xl font-bold mb-4' }, 'Nuestros Valores'),
          createElement('ul', { className: 'list-disc pl-5' }, [
            createElement('li', {}, 'Calidad y Confiabilidad'),
            createElement('li', {}, 'Transparencia'),
            createElement('li', {}, 'Servicio al Cliente'),
            createElement('li', {}, 'Innovación')
          ])
        ])
      ])
    ])
  ]);

  // Categorías section
  const categories = createElement('section', { className: 'section' }, [
    createElement('div', { className: 'container' }, [
      createElement('h2', { className: 'text-center mb-8' }, 'Explora por Categoría'),
      createElement('div', { className: 'features-grid' }, 
        TOOL_CATEGORIES.map(category => 
          createElement('a', { 
            href: `/catalog?category=${category.id}`,
            className: 'feature-card hover-lift'
          }, [
            createElement('div', { className: 'feature-icon' }, [
              createElement('i', { className: category.icon })
            ]),
            createElement('h3', { className: 'feature-title' }, category.name),
            createElement('p', { className: 'feature-text' }, `Explora nuestra colección de ${category.name.toLowerCase()} para tus proyectos.`)
          ])
        )
      )
    ])
  ]);

  // Cómo Funciona section
  const howItWorks = createElement('section', { className: 'section' }, [
    createElement('div', { className: 'container' }, [
      createElement('h2', { className: 'text-center mb-8' }, '¿Cómo Funciona?'),
      createElement('div', { className: 'features-grid' }, [
        createElement('div', { className: 'feature-card' }, [
          createElement('div', { className: 'feature-icon' }, [
            createElement('i', { className: 'bi bi-search' })
          ]),
          createElement('h3', { className: 'feature-title' }, 'Encuentra Herramientas'),
          createElement('p', { className: 'feature-text' }, 'Explora nuestro catálogo de herramientas de alta calidad para cualquier proyecto.')
        ]),
        createElement('div', { className: 'feature-card' }, [
          createElement('div', { className: 'feature-icon' }, [
            createElement('i', { className: 'bi bi-calendar-check' })
          ]),
          createElement('h3', { className: 'feature-title' }, 'Reserva en Línea'),
          createElement('p', { className: 'feature-text' }, 'Selecciona las fechas y reserva tus herramientas con nuestro sistema fácil de usar.')
        ]),
        createElement('div', { className: 'feature-card' }, [
          createElement('div', { className: 'feature-icon' }, [
            createElement('i', { className: 'bi bi-truck' })
          ]),
          createElement('h3', { className: 'feature-title' }, 'Recibe tus Herramientas'),
          createElement('p', { className: 'feature-text' }, 'Recoge tus herramientas o solicita entrega a domicilio.')
        ]),
        createElement('div', { className: 'feature-card' }, [
          createElement('div', { className: 'feature-icon' }, [
            createElement('i', { className: 'bi bi-arrow-repeat' })
          ]),
          createElement('h3', { className: 'feature-title' }, 'Devuelve al Terminar'),
          createElement('p', { className: 'feature-text' }, 'Simplemente devuelve las herramientas cuando tu proyecto esté completo.')
        ])
      ])
    ])
  ]);

  // Testimonios section
  const testimonials = createElement('section', { 
    className: 'section',
    style: 'background-color: var(--color-gray-100); padding: var(--space-12) 0;'
  }, [
    createElement('div', { className: 'container' }, [
      createElement('h2', { className: 'text-center mb-8' }, 'Lo que Dicen Nuestros Clientes'),
      createElement('div', { className: 'features-grid' }, [
        createElement('div', { className: 'card' }, [
          createElement('div', { className: 'card-body' }, [
            createElement('p', { className: 'card-text' }, '"RentaTools me ahorró miles de pesos en mi proyecto de renovación. Las herramientas estaban en perfecto estado y el servicio fue excelente."'),
            createElement('div', { className: 'flex items-center mt-4' }, [
              createElement('img', { 
                src: 'https://randomuser.me/api/portraits/men/32.jpg',
                alt: 'Cliente',
                className: 'rounded-full',
                width: '50',
                height: '50'
              }),
              createElement('div', { className: 'ml-2' }, [
                createElement('strong', {}, 'Miguel Hernández'),
                createElement('div', { className: 'text-sm text-gray' }, 'Propietario')
              ])
            ])
          ])
        ]),
        createElement('div', { className: 'card' }, [
          createElement('div', { className: 'card-body' }, [
            createElement('p', { className: 'card-text' }, '"Como contratista profesional, dependo de herramientas de calidad. Esta plataforma ha sido revolucionaria para acceder a equipos especializados sin necesidad de comprarlos."'),
            createElement('div', { className: 'flex items-center mt-4' }, [
              createElement('img', { 
                src: 'https://randomuser.me/api/portraits/women/44.jpg',
                alt: 'Cliente',
                className: 'rounded-full',
                width: '50',
                height: '50'
              }),
              createElement('div', { className: 'ml-2' }, [
                createElement('strong', {}, 'Ana Martínez'),
                createElement('div', { className: 'text-sm text-gray' }, 'Contratista')
              ])
            ])
          ])
        ]),
        createElement('div', { className: 'card' }, [
          createElement('div', { className: 'card-body' }, [
            createElement('p', { className: 'card-text' }, '"Necesitaba una mezcladora de concreto por un fin de semana. Alquilar fue mucho más práctico que comprar. ¡Definitivamente volveré a usar este servicio!"'),
            createElement('div', { className: 'flex items-center mt-4' }, [
              createElement('img', { 
                src: 'https://randomuser.me/api/portraits/men/67.jpg',
                alt: 'Cliente',
                className: 'rounded-full',
                width: '50',
                height: '50'
              }),
              createElement('div', { className: 'ml-2' }, [
                createElement('strong', {}, 'David Torres'),
                createElement('div', { className: 'text-sm text-gray' }, 'Entusiasta DIY')
              ])
            ])
          ])
        ])
      ])
    ])
  ]);

  // CTA section
  const cta = createElement('section', { 
    className: 'section',
    style: 'background-color: var(--color-primary-dark); color: var(--color-white); padding: var(--space-12) 0; text-align: center;'
  }, [
    createElement('div', { className: 'container' }, [
      createElement('h2', { className: 'mb-4' }, '¿Listo para Comenzar?'),
      createElement('p', { className: 'mb-6' }, 'Únete a miles de clientes satisfechos que ahorran dinero y completan proyectos con nuestro servicio de alquiler de herramientas.'),
      createElement('a', { 
        href: '/register',
        className: 'btn btn-lg btn-accent'
      }, 'Crea tu Cuenta')
    ])
  ]);

  // Assemble view
  const view = createElement('div', {});
  view.appendChild(hero);
  view.appendChild(aboutUs);
  container.appendChild(categories);
  container.appendChild(howItWorks);
  container.appendChild(testimonials);
  view.appendChild(container);
  view.appendChild(cta);

  return view;
};