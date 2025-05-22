import { createElement, formatCurrency, showModal } from '../utils/ui.js';
import { AuthService } from '../services/authService.js';
import { TOOL_IMAGES } from '../config.js';
import { router } from '../router.js';

// Create and return the tool detail view
export const toolDetailView = (params) => {
  const container = createElement('div', { className: 'container' });
  
  // Breadcrumb navigation
  const breadcrumb = createElement('div', { className: 'flex items-center mb-6 text-sm' }, [
    createElement('a', { href: '/', className: 'text-gray' }, 'Home'),
    createElement('span', { className: 'mx-2 text-gray' }, '/'),
    createElement('a', { href: '/catalog', className: 'text-gray' }, 'Catalog'),
    createElement('span', { className: 'mx-2 text-gray' }, '/'),
    createElement('span', {}, 'Tool Details')
  ]);
  
  // Loading state
  const loading = createElement('div', { className: 'skeleton-loader' }, [
    createElement('div', { className: 'skeleton skeleton-title' }),
    createElement('div', { className: 'skeleton skeleton-text' }),
    createElement('div', { className: 'skeleton skeleton-text' })
  ]);
  
  // Tool detail container (will be populated later)
  const toolDetail = createElement('div', { id: 'tool-detail' }, [loading]);
  
  // Assemble view
  container.appendChild(breadcrumb);
  container.appendChild(toolDetail);
  
  // Load tool details
  setTimeout(() => {
    loadToolDetail(params.id);
  }, 10);
  
  return container;
};

// Load tool detail
const loadToolDetail = async (toolId) => {
  const toolDetailContainer = document.getElementById('tool-detail');
  
  if (!toolDetailContainer) return;
  
  try {
    // In a real app, this would be an API call
    // For demo, we'll create a mock tool
    const mockTool = {
      id: toolId,
      name: 'Professional Power Drill',
      description: 'High-performance cordless drill with variable speed and torque settings. Perfect for a wide range of drilling and fastening applications. Includes a lithium-ion battery, charger, and carrying case.',
      model: 'XR2000',
      brand: 'PowerMaster',
      costPerDay: 24.99,
      availableQuantity: 5,
      category: 'Power Tools',
      supplier: 'ToolPro Rentals',
      specs: [
        { name: 'Power', value: '20V' },
        { name: 'Chuck Size', value: '1/2 inch' },
        { name: 'Weight', value: '3.5 lbs' },
        { name: 'Battery', value: 'Lithium-ion' },
        { name: 'Runtime', value: 'Up to 2 hours' },
        { name: 'Speed', value: '0-1500 RPM' }
      ],
      features: [
        'Variable speed trigger',
        'LED work light',
        'Ergonomic grip design',
        'Battery level indicator',
        'Forward/reverse switch',
        'Keyless chuck'
      ],
      reviews: [
        { 
          user: 'John D.',
          rating: 5,
          comment: 'Excellent drill! Very powerful and the battery lasts a long time.',
          date: '2023-05-15'
        },
        { 
          user: 'Sarah M.',
          rating: 4,
          comment: 'Great tool, but a bit heavy for extended use.',
          date: '2023-04-22'
        },
        { 
          user: 'Mike R.',
          rating: 5,
          comment: 'Professional quality. Worth every penny.',
          date: '2023-03-10'
        }
      ]
    };
    
    // Choose image based on tool name
    const imgKey = mockTool.name.toLowerCase().includes('drill') ? 'power-drill' :
                  mockTool.name.toLowerCase().includes('saw') ? 'circular-saw' :
                  mockTool.name.toLowerCase().includes('lawn') ? 'lawn-mower' :
                  mockTool.name.toLowerCase().includes('ladder') ? 'ladder' :
                  mockTool.name.toLowerCase().includes('pressure') ? 'pressure-washer' :
                  mockTool.name.toLowerCase().includes('hammer') ? 'hammer' :
                  'default';
    
    // Create tool detail layout
    const toolDetail = createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-8' });
    
    // Tool image
    const imageColumn = createElement('div', {}, [
      createElement('div', { 
        className: 'card overflow-hidden',
        style: 'height: 400px;'
      }, [
        createElement('img', {
          src: TOOL_IMAGES[imgKey],
          alt: mockTool.name,
          className: 'w-full h-full object-cover'
        })
      ]),
      createElement('div', { 
        className: 'flex gap-2 mt-4',
        style: 'display: none;' // Hide thumbnails for now
      }, [
        createElement('div', { 
          className: 'border-2 border-primary cursor-pointer overflow-hidden',
          style: 'width: 80px; height: 80px;'
        }, [
          createElement('img', {
            src: TOOL_IMAGES[imgKey],
            alt: 'Thumbnail 1',
            className: 'w-full h-full object-cover'
          })
        ])
      ])
    ]);
    
    // Tool info
    const infoColumn = createElement('div', {}, [
      createElement('h1', { className: 'text-3xl font-bold mb-2' }, mockTool.name),
      createElement('div', { className: 'flex items-center mb-4' }, [
        createElement('div', { className: 'flex' }, [
          createElement('i', { className: 'bi bi-star-fill text-warning' }),
          createElement('i', { className: 'bi bi-star-fill text-warning' }),
          createElement('i', { className: 'bi bi-star-fill text-warning' }),
          createElement('i', { className: 'bi bi-star-fill text-warning' }),
          createElement('i', { className: 'bi bi-star-half text-warning' })
        ]),
        createElement('span', { className: 'ml-2 text-sm text-gray' }, `(${mockTool.reviews.length} reviews)`)
      ]),
      createElement('div', { className: 'text-xl font-bold text-primary mb-4' }, 
        formatCurrency(mockTool.costPerDay) + ' / day'
      ),
      createElement('div', { className: 'mb-4' }, [
        createElement('span', { className: 'badge badge-success mr-2' }, 
          `${mockTool.availableQuantity} Available`
        ),
        createElement('span', { className: 'badge badge-primary' }, mockTool.category)
      ]),
      createElement('p', { className: 'mb-6' }, mockTool.description),
      createElement('div', { className: 'grid grid-cols-2 gap-4 mb-6' }, [
        createElement('div', {}, [
          createElement('span', { className: 'text-gray' }, 'Brand: '),
          createElement('span', { className: 'font-semibold' }, mockTool.brand)
        ]),
        createElement('div', {}, [
          createElement('span', { className: 'text-gray' }, 'Model: '),
          createElement('span', { className: 'font-semibold' }, mockTool.model)
        ]),
        createElement('div', {}, [
          createElement('span', { className: 'text-gray' }, 'Supplier: '),
          createElement('span', { className: 'font-semibold' }, mockTool.supplier)
        ])
      ]),
      createElement('form', { 
        id: 'reservation-form',
        className: 'card p-4 mb-6'
      }, [
        createElement('h3', { className: 'text-xl font-bold mb-4' }, 'Rent this Tool'),
        createElement('div', { className: 'grid grid-cols-2 gap-4 mb-4' }, [
          createElement('div', { className: 'form-group' }, [
            createElement('label', { className: 'form-label', for: 'start-date' }, 'Start Date'),
            createElement('input', {
              type: 'date',
              id: 'start-date',
              className: 'form-control',
              min: new Date().toISOString().split('T')[0],
              required: true
            })
          ]),
          createElement('div', { className: 'form-group' }, [
            createElement('label', { className: 'form-label', for: 'end-date' }, 'End Date'),
            createElement('input', {
              type: 'date',
              id: 'end-date',
              className: 'form-control',
              min: new Date().toISOString().split('T')[0],
              required: true
            })
          ])
        ]),
        createElement('div', { className: 'form-group mb-4' }, [
          createElement('label', { className: 'form-label', for: 'quantity' }, 'Quantity'),
          createElement('input', {
            type: 'number',
            id: 'quantity',
            className: 'form-control',
            min: '1',
            max: mockTool.availableQuantity.toString(),
            value: '1',
            required: true
          })
        ]),
        createElement('div', { 
          className: 'mt-4',
          id: 'price-calculation'
        }, 'Select dates to calculate total price'),
        createElement('button', {
          type: 'submit',
          className: 'btn btn-primary btn-block mt-4',
          onClick: (e) => handleReservation(e, mockTool)
        }, [
          createElement('i', { className: 'bi bi-calendar-check' }),
          ' Reserve Now'
        ])
      ])
    ]);
    
    // Tool tabs
    const tabsSection = createElement('div', { className: 'col-span-full mt-8' }, [
      createElement('div', { className: 'border-b mb-4' }, [
        createElement('div', { className: 'flex' }, [
          createElement('button', {
            className: 'px-4 py-2 font-medium border-b-2 border-primary',
            'data-tab': 'specs',
            onClick: (e) => switchTab(e, 'specs')
          }, 'Specifications'),
          createElement('button', {
            className: 'px-4 py-2 font-medium text-gray',
            'data-tab': 'features',
            onClick: (e) => switchTab(e, 'features')
          }, 'Features'),
          createElement('button', {
            className: 'px-4 py-2 font-medium text-gray',
            'data-tab': 'reviews',
            onClick: (e) => switchTab(e, 'reviews')
          }, 'Reviews')
        ])
      ]),
      // Specs tab
      createElement('div', {
        id: 'tab-specs',
        className: 'tab-content'
      }, [
        createElement('div', { className: 'grid grid-cols-2 gap-4' },
          mockTool.specs.map(spec => 
            createElement('div', { className: 'flex justify-between py-2 border-b' }, [
              createElement('span', { className: 'font-medium' }, spec.name),
              createElement('span', {}, spec.value)
            ])
          )
        )
      ]),
      // Features tab
      createElement('div', {
        id: 'tab-features',
        className: 'tab-content hidden'
      }, [
        createElement('ul', { className: 'list-disc pl-5' },
          mockTool.features.map(feature => 
            createElement('li', { className: 'mb-2' }, feature)
          )
        )
      ]),
      // Reviews tab
      createElement('div', {
        id: 'tab-reviews',
        className: 'tab-content hidden'
      }, [
        createElement('div', { className: 'mb-6' },
          mockTool.reviews.map(review => 
            createElement('div', { className: 'card mb-4 p-4' }, [
              createElement('div', { className: 'flex justify-between mb-2' }, [
                createElement('div', { className: 'font-medium' }, review.user),
                createElement('div', { className: 'text-gray text-sm' }, new Date(review.date).toLocaleDateString())
              ]),
              createElement('div', { className: 'flex mb-2' },
                Array.from({ length: 5 }).map((_, i) => 
                  createElement('i', { 
                    className: i < review.rating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-gray-300'
                  })
                )
              ),
              createElement('p', {}, review.comment)
            ])
          )
        ),
        createElement('button', {
          className: 'btn btn-outline',
          onClick: () => showReviewForm(mockTool.id)
        }, 'Write a Review')
      ])
    ]);
    
    // Similar tools section
    const similarTools = createElement('div', { className: 'col-span-full mt-8' }, [
      createElement('h2', { className: 'text-2xl font-bold mb-6' }, 'Similar Tools'),
      createElement('div', { className: 'tool-grid' }, [
        createElement('div', { className: 'card' }, [
          createElement('img', {
            src: TOOL_IMAGES['circular-saw'],
            alt: 'Circular Saw',
            className: 'card-img'
          }),
          createElement('div', { className: 'card-body' }, [
            createElement('h3', { className: 'card-title' }, 'Circular Saw'),
            createElement('div', { className: 'flex items-center mb-4' }, [
              createElement('span', { className: 'badge badge-primary mr-2' }, 'Power Tools'),
              createElement('span', { className: 'text-sm text-gray' }, 'CutRight CS1500')
            ])
          ]),
          createElement('div', { className: 'card-footer' }, [
            createElement('div', { className: 'card-price' }, '$29.99/day'),
            createElement('a', {
              href: '/tool/2',
              className: 'btn btn-primary btn-sm'
            }, 'View Details')
          ])
        ]),
        createElement('div', { className: 'card' }, [
          createElement('img', {
            src: TOOL_IMAGES['hammer'],
            alt: 'Hammer Drill',
            className: 'card-img'
          }),
          createElement('div', { className: 'card-body' }, [
            createElement('h3', { className: 'card-title' }, 'Hammer Drill'),
            createElement('div', { className: 'flex items-center mb-4' }, [
              createElement('span', { className: 'badge badge-primary mr-2' }, 'Power Tools'),
              createElement('span', { className: 'text-sm text-gray' }, 'ConstructPro HD750')
            ])
          ]),
          createElement('div', { className: 'card-footer' }, [
            createElement('div', { className: 'card-price' }, '$28.50/day'),
            createElement('a', {
              href: '/tool/6',
              className: 'btn btn-primary btn-sm'
            }, 'View Details')
          ])
        ])
      ])
    ]);
    
    // Assemble tool detail
    toolDetail.appendChild(imageColumn);
    toolDetail.appendChild(infoColumn);
    toolDetail.appendChild(tabsSection);
    toolDetail.appendChild(similarTools);
    
    // Replace loading state with content
    toolDetailContainer.innerHTML = '';
    toolDetailContainer.appendChild(toolDetail);
    
    // Add date change handlers
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const quantityInput = document.getElementById('quantity');
    
    if (startDateInput && endDateInput && quantityInput) {
      startDateInput.addEventListener('change', () => updatePriceCalculation(mockTool));
      endDateInput.addEventListener('change', () => updatePriceCalculation(mockTool));
      quantityInput.addEventListener('change', () => updatePriceCalculation(mockTool));
    }
    
  } catch (error) {
    console.error('Error loading tool details:', error);
    toolDetailContainer.innerHTML = '<div class="alert alert-error">Failed to load tool details</div>';
  }
};

// Switch tab
const switchTab = (e, tabId) => {
  // Update tab buttons
  const tabButtons = document.querySelectorAll('[data-tab]');
  tabButtons.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.className = 'px-4 py-2 font-medium border-b-2 border-primary';
    } else {
      btn.className = 'px-4 py-2 font-medium text-gray';
    }
  });
  
  // Show selected tab content
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => {
    if (content.id === `tab-${tabId}`) {
      content.classList.remove('hidden');
    } else {
      content.classList.add('hidden');
    }
  });
};

// Update price calculation
const updatePriceCalculation = (tool) => {
  const startDateInput = document.getElementById('start-date');
  const endDateInput = document.getElementById('end-date');
  const quantityInput = document.getElementById('quantity');
  const priceCalculation = document.getElementById('price-calculation');
  
  if (!startDateInput.value || !endDateInput.value || !quantityInput.value) {
    priceCalculation.textContent = 'Select dates to calculate total price';
    return;
  }
  
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);
  
  // Validate dates
  if (endDate < startDate) {
    priceCalculation.innerHTML = '<span class="text-error">End date must be after start date</span>';
    return;
  }
  
  // Calculate days (including start and end day)
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  
  // Calculate total price
  const quantity = parseInt(quantityInput.value);
  const totalPrice = days * tool.costPerDay * quantity;
  
  // Update price calculation
  priceCalculation.innerHTML = `
    <div class="p-4 bg-gray-100 rounded-lg">
      <div class="flex justify-between mb-2">
        <span>${formatCurrency(tool.costPerDay)} x ${days} days</span>
        <span>${formatCurrency(tool.costPerDay * days)}</span>
      </div>
      <div class="flex justify-between mb-2">
        <span>Quantity: ${quantity}</span>
        <span>x ${quantity}</span>
      </div>
      <div class="border-t pt-2 flex justify-between font-bold">
        <span>Total:</span>
        <span>${formatCurrency(totalPrice)}</span>
      </div>
    </div>
  `;
};

// Handle reservation form submission
const handleReservation = (e, tool) => {
  e.preventDefault();
  
  // Check if user is authenticated
  if (!AuthService.isAuthenticated()) {
    showModal(
      'Login Required',
      'You need to be logged in to make a reservation.',
      [
        {
          text: 'Login',
          btnClass: 'btn-primary',
          onClick: (modal) => {
            modal.remove();
            router.navigate('/login');
          }
        },
        {
          text: 'Cancel',
          btnClass: 'btn-outline',
          onClick: (modal) => modal.remove()
        }
      ]
    );
    return;
  }
  
  // Get form values
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const quantity = document.getElementById('quantity').value;
  
  // Validate form
  if (!startDate || !endDate || !quantity) {
    showModal(
      'Missing Information',
      'Please fill out all fields to complete your reservation.',
      [
        {
          text: 'OK',
          btnClass: 'btn-primary',
          onClick: (modal) => modal.remove()
        }
      ]
    );
    return;
  }
  
  // Validate dates
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  
  if (endDateObj < startDateObj) {
    showModal(
      'Invalid Dates',
      'End date must be after start date.',
      [
        {
          text: 'OK',
          btnClass: 'btn-primary',
          onClick: (modal) => modal.remove()
        }
      ]
    );
    return;
  }
  
  // Calculate days
  const days = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) + 1;
  
  // Calculate total price
  const totalPrice = days * tool.costPerDay * parseInt(quantity);
  
  // Show confirmation modal
  showModal(
    'Confirm Reservation',
    `
      <p>Please confirm your reservation details:</p>
      <div class="mt-4">
        <div class="flex justify-between mb-2">
          <span class="font-medium">Tool:</span>
          <span>${tool.name}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="font-medium">Start Date:</span>
          <span>${new Date(startDate).toLocaleDateString()}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="font-medium">End Date:</span>
          <span>${new Date(endDate).toLocaleDateString()}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="font-medium">Quantity:</span>
          <span>${quantity}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="font-medium">Total Price:</span>
          <span class="font-bold">${formatCurrency(totalPrice)}</span>
        </div>
      </div>
    `,
    [
      {
        text: 'Confirm & Pay',
        btnClass: 'btn-primary',
        onClick: (modal) => {
          // In a real app, this would submit to the API
          // For demo, we'll simulate success
          modal.remove();
          
          // Show success message
          showModal(
            'Reservation Successful',
            `
              <div class="text-center">
                <i class="bi bi-check-circle-fill text-success text-4xl mb-4"></i>
                <p class="mb-4">Your reservation has been confirmed!</p>
                <p>You will receive a confirmation email shortly.</p>
              </div>
            `,
            [
              {
                text: 'View My Reservations',
                btnClass: 'btn-primary',
                onClick: (modal) => {
                  modal.remove();
                  router.navigate('/dashboard');
                }
              }
            ]
          );
        }
      },
      {
        text: 'Cancel',
        btnClass: 'btn-outline',
        onClick: (modal) => modal.remove()
      }
    ]
  );
};

// Show review form
const showReviewForm = (toolId) => {
  // Check if user is authenticated
  if (!AuthService.isAuthenticated()) {
    showModal(
      'Login Required',
      'You need to be logged in to write a review.',
      [
        {
          text: 'Login',
          btnClass: 'btn-primary',
          onClick: (modal) => {
            modal.remove();
            router.navigate('/login');
          }
        },
        {
          text: 'Cancel',
          btnClass: 'btn-outline',
          onClick: (modal) => modal.remove()
        }
      ]
    );
    return;
  }
  
  // Show review form modal
  showModal(
    'Write a Review',
    `
      <form id="review-form">
        <div class="form-group mb-4">
          <label class="form-label">Rating</label>
          <div class="flex gap-2">
            <div class="rating-input">
              <input type="radio" id="star5" name="rating" value="5" checked>
              <label for="star5"><i class="bi bi-star-fill"></i></label>
              
              <input type="radio" id="star4" name="rating" value="4">
              <label for="star4"><i class="bi bi-star-fill"></i></label>
              
              <input type="radio" id="star3" name="rating" value="3">
              <label for="star3"><i class="bi bi-star-fill"></i></label>
              
              <input type="radio" id="star2" name="rating" value="2">
              <label for="star2"><i class="bi bi-star-fill"></i></label>
              
              <input type="radio" id="star1" name="rating" value="1">
              <label for="star1"><i class="bi bi-star-fill"></i></label>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="review-comment">Your Review</label>
          <textarea id="review-comment" class="form-control" rows="4" required></textarea>
        </div>
      </form>
    `,
    [
      {
        text: 'Submit',
        btnClass: 'btn-primary',
        onClick: (modal) => {
          // In a real app, this would submit to the API
          // For demo, we'll simulate success
          modal.remove();
          
          // Show success message
          showModal(
            'Review Submitted',
            `
              <div class="text-center">
                <i class="bi bi-check-circle-fill text-success text-4xl mb-4"></i>
                <p>Thank you for your review!</p>
              </div>
            `,
            [
              {
                text: 'OK',
                btnClass: 'btn-primary',
                onClick: (modal) => modal.remove()
              }
            ]
          );
        }
      },
      {
        text: 'Cancel',
        btnClass: 'btn-outline',
        onClick: (modal) => modal.remove()
      }
    ]
  );
};