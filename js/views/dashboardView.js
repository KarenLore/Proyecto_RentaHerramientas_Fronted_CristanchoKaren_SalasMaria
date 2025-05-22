import { createElement, formatCurrency, formatDate } from '../utils/ui.js';
import { AuthService } from '../services/authService.js';
import { ReservationService } from '../services/reservationService.js';
import { RESERVATION_STATUSES } from '../config.js';

// Create and return the dashboard view
export const dashboardView = () => {
  const userRole = AuthService.getUserRole();
  
  // Dashboard layout
  const dashboard = createElement('div', { className: 'dashboard' });
  
  // Sidebar
  const sidebar = createElement('div', { className: 'sidebar' }, [
    createElement('div', { className: 'mb-6' }, [
      createElement('h3', { className: 'text-xl font-bold mb-4' }, 'Dashboard'),
      createElement('p', { className: 'text-gray mb-2' }, `Role: ${userRole || 'User'}`)
    ]),
    createElement('ul', { className: 'sidebar-menu' }, [
      createElement('li', { className: 'sidebar-item' }, [
        createElement('a', { 
          href: '#overview',
          className: 'sidebar-link active',
          onClick: (e) => {
            e.preventDefault();
            switchDashboardTab('overview');
          }
        }, [
          createElement('i', { className: 'bi bi-speedometer2' }),
          'Overview'
        ])
      ]),
      createElement('li', { className: 'sidebar-item' }, [
        createElement('a', { 
          href: '#reservations',
          className: 'sidebar-link',
          onClick: (e) => {
            e.preventDefault();
            switchDashboardTab('reservations');
          }
        }, [
          createElement('i', { className: 'bi bi-calendar-check' }),
          'My Reservations'
        ])
      ]),
      userRole === 'SUPPLIER' ? 
      createElement('li', { className: 'sidebar-item' }, [
        createElement('a', { 
          href: '#tools',
          className: 'sidebar-link',
          onClick: (e) => {
            e.preventDefault();
            switchDashboardTab('tools');
          }
        }, [
          createElement('i', { className: 'bi bi-tools' }),
          'My Tools'
        ])
      ]) : null,
      createElement('li', { className: 'sidebar-item' }, [
        createElement('a', { 
          href: '#profile',
          className: 'sidebar-link',
          onClick: (e) => {
            e.preventDefault();
            switchDashboardTab('profile');
          }
        }, [
          createElement('i', { className: 'bi bi-person' }),
          'Profile'
        ])
      ]),
      userRole === 'ADMIN' ? 
      createElement('li', { className: 'sidebar-item' }, [
        createElement('a', { 
          href: '/admin',
          className: 'sidebar-link'
        }, [
          createElement('i', { className: 'bi bi-shield' }),
          'Admin Panel'
        ])
      ]) : null
    ])
  ]);
  
  // Dashboard content
  const content = createElement('div', { className: 'dashboard-content' });
  
  // Add sections
  content.appendChild(createOverviewSection());
  content.appendChild(createReservationsSection());
  
  if (userRole === 'SUPPLIER') {
    content.appendChild(createToolsSection());
  }
  
  content.appendChild(createProfileSection());
  
  // Assemble dashboard
  dashboard.appendChild(sidebar);
  dashboard.appendChild(content);
  
  // Initialize dashboard
  setTimeout(() => {
    switchDashboardTab('overview');
  }, 10);
  
  return dashboard;
};

// Create overview section
const createOverviewSection = () => {
  const section = createElement('div', { 
    id: 'dashboard-overview',
    className: 'dashboard-section'
  }, [
    createElement('div', { className: 'dashboard-header' }, [
      createElement('h2', { className: 'dashboard-title' }, 'Dashboard Overview'),
      createElement('p', { className: 'dashboard-subtitle' }, 'Welcome back to your Tool Rental dashboard.')
    ]),
    createElement('div', { className: 'stats-grid' }, [
      createElement('div', { className: 'stat-card' }, [
        createElement('h3', { className: 'stat-title' }, 'Active Reservations'),
        createElement('div', { className: 'stat-value' }, '3'),
        createElement('div', { className: 'stat-change positive' }, [
          createElement('i', { className: 'bi bi-arrow-up' }),
          ' 20% from last month'
        ])
      ]),
      createElement('div', { className: 'stat-card' }, [
        createElement('h3', { className: 'stat-title' }, 'Total Spent'),
        createElement('div', { className: 'stat-value' }, '$245.50'),
        createElement('div', { className: 'stat-change positive' }, [
          createElement('i', { className: 'bi bi-arrow-up' }),
          ' 15% from last month'
        ])
      ]),
      createElement('div', { className: 'stat-card' }, [
        createElement('h3', { className: 'stat-title' }, 'Completed Rentals'),
        createElement('div', { className: 'stat-value' }, '12'),
        createElement('div', { className: 'stat-change positive' }, [
          createElement('i', { className: 'bi bi-arrow-up' }),
          ' 5% from last month'
        ])
      ]),
      AuthService.getUserRole() === 'SUPPLIER' ?
      createElement('div', { className: 'stat-card' }, [
        createElement('h3', { className: 'stat-title' }, 'Tools Listed'),
        createElement('div', { className: 'stat-value' }, '8'),
        createElement('div', { className: 'stat-change positive' }, [
          createElement('i', { className: 'bi bi-arrow-up' }),
          ' 2 new this month'
        ])
      ]) :
      createElement('div', { className: 'stat-card' }, [
        createElement('h3', { className: 'stat-title' }, 'Saved Tools'),
        createElement('div', { className: 'stat-value' }, '5'),
        createElement('div', { className: 'stat-change neutral' }, 'No change')
      ])
    ]),
    createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6 mt-8' }, [
      createElement('div', { className: 'card p-6' }, [
        createElement('div', { className: 'flex justify-between items-center mb-4' }, [
          createElement('h3', { className: 'text-xl font-bold' }, 'Recent Activity'),
          createElement('a', { href: '#', className: 'text-primary text-sm' }, 'View All')
        ]),
        createElement('div', { className: 'space-y-4' }, [
          createElement('div', { className: 'flex items-start' }, [
            createElement('div', { 
              className: 'bg-primary-light rounded-full p-2 mr-3',
              style: 'color: white;'
            }, [
              createElement('i', { className: 'bi bi-calendar-check' })
            ]),
            createElement('div', {}, [
              createElement('p', { className: 'font-medium' }, 'New Reservation Confirmed'),
              createElement('p', { className: 'text-sm text-gray' }, 'Power Drill - 3 days'),
              createElement('p', { className: 'text-xs text-gray' }, '2 hours ago')
            ])
          ]),
          createElement('div', { className: 'flex items-start' }, [
            createElement('div', { 
              className: 'bg-success rounded-full p-2 mr-3',
              style: 'color: white;'
            }, [
              createElement('i', { className: 'bi bi-check-circle' })
            ]),
            createElement('div', {}, [
              createElement('p', { className: 'font-medium' }, 'Rental Completed'),
              createElement('p', { className: 'text-sm text-gray' }, 'Circular Saw - 2 days'),
              createElement('p', { className: 'text-xs text-gray' }, '2 days ago')
            ])
          ]),
          createElement('div', { className: 'flex items-start' }, [
            createElement('div', { 
              className: 'bg-accent rounded-full p-2 mr-3',
              style: 'color: white;'
            }, [
              createElement('i', { className: 'bi bi-star' })
            ]),
            createElement('div', {}, [
              createElement('p', { className: 'font-medium' }, 'Review Submitted'),
              createElement('p', { className: 'text-sm text-gray' }, 'You gave 5 stars to Electric Lawn Mower'),
              createElement('p', { className: 'text-xs text-gray' }, '4 days ago')
            ])
          ])
        ])
      ]),
      createElement('div', { className: 'card p-6' }, [
        createElement('div', { className: 'flex justify-between items-center mb-4' }, [
          createElement('h3', { className: 'text-xl font-bold' }, 'Upcoming Reservations'),
          createElement('a', { href: '#reservations', className: 'text-primary text-sm' }, 'View All')
        ]),
        createElement('div', { className: 'space-y-4' }, [
          createElement('div', { className: 'flex justify-between pb-4 border-b' }, [
            createElement('div', {}, [
              createElement('p', { className: 'font-medium' }, 'Power Drill'),
              createElement('p', { className: 'text-sm text-gray' }, 'Jul 15 - Jul 18, 2023')
            ]),
            createElement('div', {}, [
              createElement('span', { className: 'badge badge-success' }, 'Approved')
            ])
          ]),
          createElement('div', { className: 'flex justify-between pb-4 border-b' }, [
            createElement('div', {}, [
              createElement('p', { className: 'font-medium' }, 'Pressure Washer'),
              createElement('p', { className: 'text-sm text-gray' }, 'Jul 22 - Jul 23, 2023')
            ]),
            createElement('div', {}, [
              createElement('span', { className: 'badge badge-warning' }, 'Pending')
            ])
          ])
        ])
      ])
    ])
  ]);
  
  return section;
};

// Create reservations section
const createReservationsSection = () => {
  const section = createElement('div', { 
    id: 'dashboard-reservations',
    className: 'dashboard-section hidden'
  }, [
    createElement('div', { className: 'dashboard-header' }, [
      createElement('h2', { className: 'dashboard-title' }, 'My Reservations'),
      createElement('p', { className: 'dashboard-subtitle' }, 'Manage your tool reservations.')
    ]),
    createElement('div', { className: 'mb-6 flex justify-between items-center' }, [
      createElement('div', { className: 'flex gap-2' }, [
        createElement('button', { 
          className: 'btn btn-sm btn-primary active',
          'data-filter': 'all',
          onClick: (e) => filterReservations(e, 'all')
        }, 'All'),
        createElement('button', { 
          className: 'btn btn-sm btn-outline',
          'data-filter': 'active',
          onClick: (e) => filterReservations(e, 'active')
        }, 'Active'),
        createElement('button', { 
          className: 'btn btn-sm btn-outline',
          'data-filter': 'completed',
          onClick: (e) => filterReservations(e, 'completed')
        }, 'Completed'),
        createElement('button', { 
          className: 'btn btn-sm btn-outline',
          'data-filter': 'cancelled',
          onClick: (e) => filterReservations(e, 'cancelled')
        }, 'Cancelled')
      ]),
      createElement('a', { 
        href: '/catalog',
        className: 'btn btn-primary'
      }, [
        createElement('i', { className: 'bi bi-plus' }),
        ' New Reservation'
      ])
    ]),
    createElement('div', { className: 'table-container' }, [
      createElement('table', { className: 'table' }, [
        createElement('thead', {}, [
          createElement('tr', {}, [
            createElement('th', {}, 'Tool'),
            createElement('th', {}, 'Dates'),
            createElement('th', {}, 'Price'),
            createElement('th', {}, 'Status'),
            createElement('th', {}, 'Actions')
          ])
        ]),
        createElement('tbody', { id: 'reservations-table-body' }, [
          // Loading state
          createElement('tr', {}, [
            createElement('td', { colSpan: '5', className: 'text-center py-4' }, [
              createElement('div', { className: 'spinner' })
            ])
          ])
        ])
      ])
    ])
  ]);
  
  return section;
};

// Create tools section (for suppliers)
const createToolsSection = () => {
  const section = createElement('div', { 
    id: 'dashboard-tools',
    className: 'dashboard-section hidden'
  }, [
    createElement('div', { className: 'dashboard-header' }, [
      createElement('h2', { className: 'dashboard-title' }, 'My Tools'),
      createElement('p', { className: 'dashboard-subtitle' }, 'Manage your tool listings.')
    ]),
    createElement('div', { className: 'mb-6 flex justify-between items-center' }, [
      createElement('div', { className: 'flex gap-2' }, [
        createElement('button', { 
          className: 'btn btn-sm btn-primary active',
          'data-filter': 'all',
          onClick: (e) => filterTools(e, 'all')
        }, 'All'),
        createElement('button', { 
          className: 'btn btn-sm btn-outline',
          'data-filter': 'active',
          onClick: (e) => filterTools(e, 'active')
        }, 'Active'),
        createElement('button', { 
          className: 'btn btn-sm btn-outline',
          'data-filter': 'inactive',
          onClick: (e) => filterTools(e, 'inactive')
        }, 'Inactive')
      ]),
      createElement('a', { 
        href: '/supplier/tools/new',
        className: 'btn btn-primary'
      }, [
        createElement('i', { className: 'bi bi-plus' }),
        ' Add Tool'
      ])
    ]),
    createElement('div', { className: 'table-container' }, [
      createElement('table', { className: 'table' }, [
        createElement('thead', {}, [
          createElement('tr', {}, [
            createElement('th', {}, 'Tool Name'),
            createElement('th', {}, 'Category'),
            createElement('th', {}, 'Price/Day'),
            createElement('th', {}, 'Availability'),
            createElement('th', {}, 'Status'),
            createElement('th', {}, 'Actions')
          ])
        ]),
        createElement('tbody', { id: 'tools-table-body' }, [
          // Loading state
          createElement('tr', {}, [
            createElement('td', { colSpan: '6', className: 'text-center py-4' }, [
              createElement('div', { className: 'spinner' })
            ])
          ])
        ])
      ])
    ])
  ]);
  
  return section;
};

// Create profile section
const createProfileSection = () => {
  const section = createElement('div', { 
    id: 'dashboard-profile',
    className: 'dashboard-section hidden'
  }, [
    createElement('div', { className: 'dashboard-header' }, [
      createElement('h2', { className: 'dashboard-title' }, 'My Profile'),
      createElement('p', { className: 'dashboard-subtitle' }, 'Manage your account information.')
    ]),
    createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6' }, [
      createElement('div', { className: 'md:col-span-1' }, [
        createElement('div', { className: 'card p-6 text-center' }, [
          createElement('div', { 
            className: 'w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4',
            style: 'font-size: 4rem; color: var(--color-gray-400);'
          }, [
            createElement('i', { className: 'bi bi-person' })
          ]),
          createElement('h3', { className: 'text-xl font-bold' }, 'John Doe'),
          createElement('p', { className: 'text-gray' }, AuthService.getUserRole() || 'User'),
          createElement('button', { 
            className: 'btn btn-outline btn-sm mt-4',
            onClick: () => alert('Feature not implemented in demo')
          }, 'Change Photo')
        ])
      ]),
      createElement('div', { className: 'md:col-span-2' }, [
        createElement('div', { className: 'card p-6' }, [
          createElement('h3', { className: 'text-xl font-bold mb-6' }, 'Account Information'),
          createElement('form', { id: 'profile-form' }, [
            createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-4' }, [
              createElement('div', { className: 'form-group' }, [
                createElement('label', { className: 'form-label', for: 'profile-name' }, 'Full Name'),
                createElement('input', {
                  type: 'text',
                  id: 'profile-name',
                  className: 'form-control',
                  value: 'John Doe'
                })
              ]),
              createElement('div', { className: 'form-group' }, [
                createElement('label', { className: 'form-label', for: 'profile-email' }, 'Email'),
                createElement('input', {
                  type: 'email',
                  id: 'profile-email',
                  className: 'form-control',
                  value: 'john.doe@example.com'
                })
              ])
            ]),
            createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-4' }, [
              createElement('div', { className: 'form-group' }, [
                createElement('label', { className: 'form-label', for: 'profile-phone' }, 'Phone'),
                createElement('input', {
                  type: 'tel',
                  id: 'profile-phone',
                  className: 'form-control',
                  value: '+1 (555) 123-4567'
                })
              ]),
              createElement('div', { className: 'form-group' }, [
                createElement('label', { className: 'form-label', for: 'profile-address' }, 'Address'),
                createElement('input', {
                  type: 'text',
                  id: 'profile-address',
                  className: 'form-control',
                  value: '123 Main St, Anytown, USA'
                })
              ])
            ]),
            createElement('button', { 
              type: 'button',
              className: 'btn btn-primary mt-4',
              onClick: () => alert('Profile updated successfully (demo)')
            }, 'Save Changes')
          ])
        ]),
        createElement('div', { className: 'card p-6 mt-6' }, [
          createElement('h3', { className: 'text-xl font-bold mb-6' }, 'Change Password'),
          createElement('form', { id: 'password-form' }, [
            createElement('div', { className: 'form-group mb-4' }, [
              createElement('label', { className: 'form-label', for: 'current-password' }, 'Current Password'),
              createElement('input', {
                type: 'password',
                id: 'current-password',
                className: 'form-control',
                placeholder: '••••••••'
              })
            ]),
            createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-4' }, [
              createElement('div', { className: 'form-group' }, [
                createElement('label', { className: 'form-label', for: 'new-password' }, 'New Password'),
                createElement('input', {
                  type: 'password',
                  id: 'new-password',
                  className: 'form-control',
                  placeholder: 'Enter new password'
                })
              ]),
              createElement('div', { className: 'form-group' }, [
                createElement('label', { className: 'form-label', for: 'confirm-new-password' }, 'Confirm New Password'),
                createElement('input', {
                  type: 'password',
                  id: 'confirm-new-password',
                  className: 'form-control',
                  placeholder: 'Confirm new password'
                })
              ])
            ]),
            createElement('button', { 
              type: 'button',
              className: 'btn btn-primary mt-4',
              onClick: () => alert('Password changed successfully (demo)')
            }, 'Change Password')
          ])
        ])
      ])
    ])
  ]);
  
  return section;
};

// Switch dashboard tabs
const switchDashboardTab = (tabId) => {
  // Update sidebar links
  document.querySelectorAll('.sidebar-link').forEach(link => {
    if (link.getAttribute('href') === `#${tabId}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Show selected section
  document.querySelectorAll('.dashboard-section').forEach(section => {
    if (section.id === `dashboard-${tabId}`) {
      section.classList.remove('hidden');
    } else {
      section.classList.add('hidden');
    }
  });
  
  // Load data for the selected tab
  if (tabId === 'reservations') {
    loadReservations();
  } else if (tabId === 'tools') {
    loadTools();
  }
};

// Load reservations data
const loadReservations = async () => {
  const tableBody = document.getElementById('reservations-table-body');
  
  if (!tableBody) return;
  
  try {
    // In a real app, this would be an API call
    // For demo, we'll create mock reservations
    const mockReservations = [
      {
        id: 1,
        toolId: 1,
        toolName: 'Power Drill',
        startDate: '2023-07-15',
        endDate: '2023-07-18',
        totalCost: 74.97,
        status: 'APPROVED',
        supplierId: 1,
        supplierName: 'ToolPro Rentals'
      },
      {
        id: 2,
        toolId: 5,
        toolName: 'Pressure Washer',
        startDate: '2023-07-22',
        endDate: '2023-07-23',
        totalCost: 84.00,
        status: 'PENDING',
        supplierId: 1,
        supplierName: 'ToolPro Rentals'
      },
      {
        id: 3,
        toolId: 2,
        toolName: 'Circular Saw',
        startDate: '2023-06-10',
        endDate: '2023-06-12',
        totalCost: 89.97,
        status: 'COMPLETED',
        supplierId: 2,
        supplierName: 'Construction Equipment Co.'
      },
      {
        id: 4,
        toolId: 3,
        toolName: 'Electric Lawn Mower',
        startDate: '2023-05-05',
        endDate: '2023-05-07',
        totalCost: 106.50,
        status: 'COMPLETED',
        supplierId: 3,
        supplierName: 'Green Garden Rentals'
      },
      {
        id: 5,
        toolId: 4,
        toolName: 'Professional Ladder',
        startDate: '2023-04-20',
        endDate: '2023-04-21',
        totalCost: 37.50,
        status: 'CANCELLED',
        supplierId: 2,
        supplierName: 'Construction Equipment Co.'
      }
    ];
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear loading state
    tableBody.innerHTML = '';
    
    // Render reservations
    mockReservations.forEach(reservation => {
      const row = createElement('tr', { 'data-status': reservation.status.toLowerCase() });
      
      // Tool column
      row.appendChild(
        createElement('td', {}, [
          createElement('div', { className: 'font-medium' }, reservation.toolName),
          createElement('div', { className: 'text-sm text-gray' }, reservation.supplierName)
        ])
      );
      
      // Dates column
      row.appendChild(
        createElement('td', {}, [
          createElement('div', {}, formatDate(reservation.startDate)),
          createElement('div', { className: 'text-sm text-gray' }, `to ${formatDate(reservation.endDate)}`)
        ])
      );
      
      // Price column
      row.appendChild(
        createElement('td', {}, formatCurrency(reservation.totalCost))
      );
      
      // Status column
      const statusInfo = RESERVATION_STATUSES[reservation.status] || { label: reservation.status, color: 'gray' };
      
      row.appendChild(
        createElement('td', {}, [
          createElement('span', { className: `badge badge-${statusInfo.color}` }, statusInfo.label)
        ])
      );
      
      // Actions column
      const actions = [
        createElement('a', {
          href: `/reservation/${reservation.id}`,
          className: 'btn btn-sm btn-outline'
        }, 'View')
      ];
      
      if (reservation.status === 'PENDING') {
        actions.push(
          createElement('button', {
            className: 'btn btn-sm btn-error ml-2',
            onClick: () => cancelReservation(reservation.id)
          }, 'Cancel')
        );
      }
      
      if (reservation.status === 'COMPLETED') {
        actions.push(
          createElement('button', {
            className: 'btn btn-sm btn-secondary ml-2',
            onClick: () => writeReview(reservation.id, reservation.toolName)
          }, 'Review')
        );
      }
      
      row.appendChild(
        createElement('td', {}, [
          createElement('div', { className: 'flex' }, actions)
        ])
      );
      
      tableBody.appendChild(row);
    });
    
  } catch (error) {
    console.error('Error loading reservations:', error);
    tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Failed to load reservations</td></tr>';
  }
};

// Filter reservations
const filterReservations = (e, filter) => {
  // Update active button
  document.querySelectorAll('[data-filter]').forEach(btn => {
    if (btn.getAttribute('data-filter') === filter) {
      btn.classList.add('btn-primary');
      btn.classList.remove('btn-outline');
    } else {
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-outline');
    }
  });
  
  // Filter table rows
  const rows = document.querySelectorAll('#reservations-table-body tr');
  
  rows.forEach(row => {
    const status = row.getAttribute('data-status');
    
    if (filter === 'all') {
      row.style.display = '';
    } else if (filter === 'active' && (status === 'approved' || status === 'pending')) {
      row.style.display = '';
    } else if (filter === filter && status === filter) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
};

// Load tools data (for suppliers)
const loadTools = async () => {
  const tableBody = document.getElementById('tools-table-body');
  
  if (!tableBody) return;
  
  try {
    // In a real app, this would be an API call
    // For demo, we'll create mock tools
    const mockTools = [
      {
        id: 1,
        name: 'Professional Power Drill',
        category: 'Power Tools',
        costPerDay: 24.99,
        availableQuantity: 5,
        active: true
      },
      {
        id: 2,
        name: 'Circular Saw',
        category: 'Power Tools',
        costPerDay: 29.99,
        availableQuantity: 3,
        active: true
      },
      {
        id: 5,
        name: 'Pressure Washer',
        category: 'Cleaning Equipment',
        costPerDay: 42.00,
        availableQuantity: 4,
        active: true
      },
      {
        id: 6,
        name: 'Hammer Drill',
        category: 'Power Tools',
        costPerDay: 28.50,
        availableQuantity: 6,
        active: true
      },
      {
        id: 7,
        name: 'Pipe Wrench Set',
        category: 'Plumbing Tools',
        costPerDay: 15.25,
        availableQuantity: 0,
        active: false
      },
      {
        id: 8,
        name: 'Electric Chainsaw',
        category: 'Garden Tools',
        costPerDay: 32.75,
        availableQuantity: 3,
        active: true
      }
    ];
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear loading state
    tableBody.innerHTML = '';
    
    // Render tools
    mockTools.forEach(tool => {
      const row = createElement('tr', { 'data-status': tool.active ? 'active' : 'inactive' });
      
      // Tool name column
      row.appendChild(
        createElement('td', {}, [
          createElement('div', { className: 'font-medium' }, tool.name)
        ])
      );
      
      // Category column
      row.appendChild(
        createElement('td', {}, [
          createElement('span', { className: 'badge badge-primary' }, tool.category)
        ])
      );
      
      // Price column
      row.appendChild(
        createElement('td', {}, formatCurrency(tool.costPerDay))
      );
      
      // Availability column
      row.appendChild(
        createElement('td', {}, [
          createElement('span', { 
            className: tool.availableQuantity > 0 ? 'text-success' : 'text-error'
          }, `${tool.availableQuantity} available`)
        ])
      );
      
      // Status column
      row.appendChild(
        createElement('td', {}, [
          createElement('span', { 
            className: tool.active ? 'badge badge-success' : 'badge badge-error'
          }, tool.active ? 'Active' : 'Inactive')
        ])
      );
      
      // Actions column
      row.appendChild(
        createElement('td', {}, [
          createElement('div', { className: 'flex' }, [
            createElement('a', {
              href: `/tool/${tool.id}`,
              className: 'btn btn-sm btn-outline'
            }, 'View'),
            createElement('a', {
              href: `/supplier/tools/edit/${tool.id}`,
              className: 'btn btn-sm btn-primary ml-2'
            }, 'Edit'),
            createElement('button', {
              className: 'btn btn-sm btn-outline ml-2',
              onClick: () => toggleToolStatus(tool.id, !tool.active)
            }, tool.active ? 'Deactivate' : 'Activate')
          ])
        ])
      );
      
      tableBody.appendChild(row);
    });
    
  } catch (error) {
    console.error('Error loading tools:', error);
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4">Failed to load tools</td></tr>';
  }
};

// Filter tools
const filterTools = (e, filter) => {
  // Update active button
  document.querySelectorAll('[data-filter]').forEach(btn => {
    if (btn.getAttribute('data-filter') === filter) {
      btn.classList.add('btn-primary');
      btn.classList.remove('btn-outline');
    } else {
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-outline');
    }
  });
  
  // Filter table rows
  const rows = document.querySelectorAll('#tools-table-body tr');
  
  rows.forEach(row => {
    const status = row.getAttribute('data-status');
    
    if (filter === 'all') {
      row.style.display = '';
    } else if (filter === status) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
};

// Cancel reservation
const cancelReservation = (reservationId) => {
  // In a real app, this would call the API
  // For demo, we'll just show an alert
  if (confirm(`Are you sure you want to cancel reservation #${reservationId}?`)) {
    alert(`Reservation #${reservationId} has been cancelled (demo)`);
    
    // Update the UI
    const row = document.querySelector(`#reservations-table-body tr[data-reservation="${reservationId}"]`);
    if (row) {
      row.querySelector('.badge').className = 'badge badge-error';
      row.querySelector('.badge').textContent = 'Cancelled';
      row.setAttribute('data-status', 'cancelled');
    }
  }
};

// Write review
const writeReview = (reservationId, toolName) => {
  // In a real app, this would open a review form
  // For demo, we'll just show an alert
  alert(`You can now write a review for ${toolName} (Reservation #${reservationId})`);
};

// Toggle tool status
const toggleToolStatus = (toolId, activate) => {
  // In a real app, this would call the API
  // For demo, we'll just show an alert
  if (confirm(`Are you sure you want to ${activate ? 'activate' : 'deactivate'} tool #${toolId}?`)) {
    alert(`Tool #${toolId} has been ${activate ? 'activated' : 'deactivated'} (demo)`);
    
    // Update the UI
    const row = document.querySelector(`#tools-table-body tr[data-tool="${toolId}"]`);
    if (row) {
      const statusBadge = row.querySelector('td:nth-child(5) .badge');
      const statusButton = row.querySelector('td:nth-child(6) button:last-child');
      
      statusBadge.className = activate ? 'badge badge-success' : 'badge badge-error';
      statusBadge.textContent = activate ? 'Active' : 'Inactive';
      
      statusButton.textContent = activate ? 'Deactivate' : 'Activate';
      
      row.setAttribute('data-status', activate ? 'active' : 'inactive');
    }
  }
};