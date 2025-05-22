import { createElement } from '../utils/ui.js';
import { ToolService } from '../services/toolService.js';
import { TOOL_CATEGORIES, TOOL_IMAGES } from '../config.js';

// Create and return the catalog view
export const catalogView = () => {
  const container = createElement('div', { className: 'container' });
  
  // Page header
  const header = createElement('div', { className: 'mb-8' }, [
    createElement('h1', {}, 'Tool Catalog'),
    createElement('p', { className: 'text-gray' }, 'Browse and rent high-quality tools for your projects.')
  ]);
  
  // Filters section
  const filters = createElement('div', { className: 'filters' }, [
    createElement('div', { className: 'filter-group' }, [
      createElement('label', { className: 'form-label', for: 'search' }, 'Search'),
      createElement('div', { className: 'flex' }, [
        createElement('input', {
          type: 'text',
          id: 'search',
          className: 'form-control',
          placeholder: 'Search tools...'
        }),
        createElement('button', {
          id: 'search-btn',
          className: 'btn btn-primary ml-2',
          onClick: () => handleSearch()
        }, [
          createElement('i', { className: 'bi bi-search' })
        ])
      ])
    ]),
    createElement('div', { className: 'filter-group' }, [
      createElement('label', { className: 'form-label', for: 'category' }, 'Category'),
      createElement('select', {
        id: 'category',
        className: 'form-control',
        onChange: () => handleFilters()
      }, [
        createElement('option', { value: '' }, 'All Categories'),
        ...TOOL_CATEGORIES.map(category => 
          createElement('option', { value: category.id }, category.name)
        )
      ])
    ]),
    createElement('div', { className: 'filter-group' }, [
      createElement('label', { className: 'form-label', for: 'sort' }, 'Sort By'),
      createElement('select', {
        id: 'sort',
        className: 'form-control',
        onChange: () => handleFilters()
      }, [
        createElement('option', { value: 'name' }, 'Name (A-Z)'),
        createElement('option', { value: 'name_desc' }, 'Name (Z-A)'),
        createElement('option', { value: 'price_asc' }, 'Price (Low to High)'),
        createElement('option', { value: 'price_desc' }, 'Price (High to Low)')
      ])
    ])
  ]);
  
  // Results section
  const results = createElement('div', { className: 'mb-8' }, [
    createElement('div', { className: 'flex justify-between items-center mb-4' }, [
      createElement('div', { id: 'result-count' }, 'Loading tools...'),
      createElement('div', { id: 'view-toggle', className: 'flex gap-2' }, [
        createElement('button', {
          className: 'btn btn-sm btn-outline active',
          id: 'grid-view-btn',
          onClick: () => toggleView('grid')
        }, [
          createElement('i', { className: 'bi bi-grid' })
        ]),
        createElement('button', {
          className: 'btn btn-sm btn-outline',
          id: 'list-view-btn',
          onClick: () => toggleView('list')
        }, [
          createElement('i', { className: 'bi bi-list-ul' })
        ])
      ])
    ]),
    createElement('div', { 
      className: 'tool-grid',
      id: 'tool-results'
    }, [
      // Loading state
      createElement('div', { className: 'skeleton-loader' }, [
        createElement('div', { className: 'card' }, [
          createElement('div', { className: 'skeleton skeleton-image' }),
          createElement('div', { className: 'card-body' }, [
            createElement('div', { className: 'skeleton skeleton-title' }),
            createElement('div', { className: 'skeleton skeleton-text' }),
            createElement('div', { className: 'skeleton skeleton-text' })
          ])
        ])
      ]),
      createElement('div', { className: 'skeleton-loader' }, [
        createElement('div', { className: 'card' }, [
          createElement('div', { className: 'skeleton skeleton-image' }),
          createElement('div', { className: 'card-body' }, [
            createElement('div', { className: 'skeleton skeleton-title' }),
            createElement('div', { className: 'skeleton skeleton-text' }),
            createElement('div', { className: 'skeleton skeleton-text' })
          ])
        ])
      ]),
      createElement('div', { className: 'skeleton-loader' }, [
        createElement('div', { className: 'card' }, [
          createElement('div', { className: 'skeleton skeleton-image' }),
          createElement('div', { className: 'card-body' }, [
            createElement('div', { className: 'skeleton skeleton-title' }),
            createElement('div', { className: 'skeleton skeleton-text' }),
            createElement('div', { className: 'skeleton skeleton-text' })
          ])
        ])
      ]),
      createElement('div', { className: 'skeleton-loader' }, [
        createElement('div', { className: 'card' }, [
          createElement('div', { className: 'skeleton skeleton-image' }),
          createElement('div', { className: 'card-body' }, [
            createElement('div', { className: 'skeleton skeleton-title' }),
            createElement('div', { className: 'skeleton skeleton-text' }),
            createElement('div', { className: 'skeleton skeleton-text' })
          ])
        ])
      ])
    ])
  ]);
  
  // Pagination
  const pagination = createElement('div', { 
    className: 'pagination',
    id: 'pagination'
  });
  
  // Assemble view
  container.appendChild(header);
  container.appendChild(filters);
  container.appendChild(results);
  container.appendChild(pagination);
  
  // Initialize view after rendering
  setTimeout(() => {
    initCatalogView();
  }, 10);
  
  return container;
};

// Initialize catalog view
const initCatalogView = () => {
  // Get URL params for initial filters
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  const searchParam = urlParams.get('search');
  
  // Set initial filter values from URL
  if (categoryParam) {
    document.getElementById('category').value = categoryParam;
  }
  
  if (searchParam) {
    document.getElementById('search').value = searchParam;
  }
  
  // Load tools with initial filters
  loadTools();
  
  // Add search event listener
  const searchInput = document.getElementById('search');
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });
};

// Load tools based on filters
const loadTools = async () => {
  const toolResults = document.getElementById('tool-results');
  const resultCount = document.getElementById('result-count');
  
  if (!toolResults) return;
  
  try {
    // In a real app, this would be an API call with filters
    // For demo, we'll create mock tools
    const mockTools = [
      {
        id: 1,
        name: 'Professional Power Drill',
        description: 'High-performance cordless drill with variable speed and torque settings.',
        model: 'XR2000',
        brand: 'PowerMaster',
        costPerDay: 24.99,
        availableQuantity: 5,
        category: 'Power Tools',
        supplier: 'ToolPro Rentals'
      },
      {
        id: 2,
        name: 'Circular Saw',
        description: 'Precision circular saw with laser guide and dust collection system.',
        model: 'CS1500',
        brand: 'CutRight',
        costPerDay: 29.99,
        availableQuantity: 3,
        category: 'Power Tools',
        supplier: 'Construction Equipment Co.'
      },
      {
        id: 3,
        name: 'Electric Lawn Mower',
        description: 'Eco-friendly electric lawn mower with adjustable cutting height.',
        model: 'Green 3000',
        brand: 'EcoMow',
        costPerDay: 35.50,
        availableQuantity: 2,
        category: 'Garden Tools',
        supplier: 'Green Garden Rentals'
      },
      {
        id: 4,
        name: 'Professional Ladder',
        description: 'Extendable aluminum ladder with safety lock system, reaches up to 20 feet.',
        model: 'SafeClimb',
        brand: 'HeightMaster',
        costPerDay: 18.75,
        availableQuantity: 8,
        category: 'Ladders & Scaffolding',
        supplier: 'Construction Equipment Co.'
      },
      {
        id: 5,
        name: 'Pressure Washer',
        description: 'Heavy-duty pressure washer perfect for cleaning driveways, decks, and exteriors.',
        model: 'HydroForce 2500',
        brand: 'CleanMax',
        costPerDay: 42.00,
        availableQuantity: 4,
        category: 'Cleaning Equipment',
        supplier: 'ToolPro Rentals'
      },
      {
        id: 6,
        name: 'Hammer Drill',
        description: 'Professional hammer drill for concrete and masonry work.',
        model: 'HD750',
        brand: 'ConstructPro',
        costPerDay: 28.50,
        availableQuantity: 6,
        category: 'Power Tools',
        supplier: 'Construction Equipment Co.'
      },
      {
        id: 7,
        name: 'Pipe Wrench Set',
        description: 'Complete set of professional pipe wrenches for plumbing work.',
        model: 'PW-Pro',
        brand: 'PipeMaster',
        costPerDay: 15.25,
        availableQuantity: 10,
        category: 'Plumbing Tools',
        supplier: 'Plumbing Pros'
      },
      {
        id: 8,
        name: 'Electric Chainsaw',
        description: 'Powerful electric chainsaw for cutting trees and large branches.',
        model: 'EC2000',
        brand: 'ForestCut',
        costPerDay: 32.75,
        availableQuantity: 3,
        category: 'Garden Tools',
        supplier: 'Green Garden Rentals'
      }
    ];
    
    // Apply filters
    let filteredTools = [...mockTools];
    const categoryFilter = document.getElementById('category').value;
    const searchFilter = document.getElementById('search').value.toLowerCase();
    const sortFilter = document.getElementById('sort').value;
    
    // Category filter
    if (categoryFilter) {
      const categoryName = TOOL_CATEGORIES.find(c => c.id.toString() === categoryFilter)?.name || '';
      filteredTools = filteredTools.filter(tool => tool.category === categoryName);
    }
    
    // Search filter
    if (searchFilter) {
      filteredTools = filteredTools.filter(tool => 
        tool.name.toLowerCase().includes(searchFilter) || 
        tool.description.toLowerCase().includes(searchFilter) ||
        tool.brand.toLowerCase().includes(searchFilter) ||
        tool.model.toLowerCase().includes(searchFilter)
      );
    }
    
    // Apply sorting
    switch (sortFilter) {
      case 'name_desc':
        filteredTools.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price_asc':
        filteredTools.sort((a, b) => a.costPerDay - b.costPerDay);
        break;
      case 'price_desc':
        filteredTools.sort((a, b) => b.costPerDay - a.costPerDay);
        break;
      case 'name':
      default:
        filteredTools.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Update result count
    resultCount.textContent = `${filteredTools.length} tools found`;
    
    // Clear loading state
    toolResults.innerHTML = '';
    
    // Check if no results
    if (filteredTools.length === 0) {
      toolResults.innerHTML = `
        <div class="col-span-full text-center py-8">
          <i class="bi bi-search text-4xl text-gray mb-4"></i>
          <h3>No tools found</h3>
          <p class="text-gray">Try adjusting your search or filters.</p>
        </div>
      `;
      return;
    }
    
    // Render tools
    filteredTools.forEach(tool => {
      const imgKey = tool.name.toLowerCase().includes('drill') ? 'power-drill' :
                    tool.name.toLowerCase().includes('saw') ? 'circular-saw' :
                    tool.name.toLowerCase().includes('lawn') ? 'lawn-mower' :
                    tool.name.toLowerCase().includes('ladder') ? 'ladder' :
                    tool.name.toLowerCase().includes('pressure') ? 'pressure-washer' :
                    tool.name.toLowerCase().includes('hammer') ? 'hammer' :
                    'default';
      
      const card = createElement('div', { className: 'card' }, [
        createElement('img', {
          src: TOOL_IMAGES[imgKey],
          alt: tool.name,
          className: 'card-img'
        }),
        createElement('div', { className: 'card-body' }, [
          createElement('h3', { className: 'card-title' }, tool.name),
          createElement('p', { className: 'card-text' }, tool.description),
          createElement('div', { className: 'flex items-center mb-4' }, [
            createElement('span', { className: 'badge badge-primary mr-2' }, tool.category),
            createElement('span', { className: 'text-sm text-gray' }, `${tool.brand} ${tool.model}`)
          ])
        ]),
        createElement('div', { className: 'card-footer' }, [
          createElement('div', { className: 'card-price' }, `$${tool.costPerDay}/day`),
          createElement('a', {
            href: `/tool/${tool.id}`,
            className: 'btn btn-primary btn-sm'
          }, 'View Details')
        ])
      ]);
      
      toolResults.appendChild(card);
    });
    
    // Create pagination
    renderPagination(filteredTools.length);
    
  } catch (error) {
    console.error('Error loading tools:', error);
    toolResults.innerHTML = '<div class="alert alert-error">Failed to load tools</div>';
  }
};

// Handle search
const handleSearch = () => {
  loadTools();
  
  // Update URL with search params
  const searchValue = document.getElementById('search').value;
  const categoryValue = document.getElementById('category').value;
  
  let url = '/catalog';
  const params = [];
  
  if (searchValue) {
    params.push(`search=${encodeURIComponent(searchValue)}`);
  }
  
  if (categoryValue) {
    params.push(`category=${encodeURIComponent(categoryValue)}`);
  }
  
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  
  // Update URL without refreshing page
  window.history.replaceState({}, '', url);
};

// Handle filters change
const handleFilters = () => {
  loadTools();
  
  // Update URL with filter params
  const searchValue = document.getElementById('search').value;
  const categoryValue = document.getElementById('category').value;
  
  let url = '/catalog';
  const params = [];
  
  if (searchValue) {
    params.push(`search=${encodeURIComponent(searchValue)}`);
  }
  
  if (categoryValue) {
    params.push(`category=${encodeURIComponent(categoryValue)}`);
  }
  
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  
  // Update URL without refreshing page
  window.history.replaceState({}, '', url);
};

// Toggle view between grid and list
const toggleView = (viewType) => {
  const toolResults = document.getElementById('tool-results');
  const gridBtn = document.getElementById('grid-view-btn');
  const listBtn = document.getElementById('list-view-btn');
  
  if (viewType === 'grid') {
    toolResults.className = 'tool-grid';
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
  } else {
    toolResults.className = 'tool-list';
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
  }
};

// Render pagination
const renderPagination = (totalItems) => {
  const pagination = document.getElementById('pagination');
  const itemsPerPage = 8;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  
  pagination.innerHTML = '';
  
  // Previous button
  const prevBtn = createElement('button', {
    className: 'pagination-item',
    disabled: true,
    onClick: () => changePage(currentPage - 1)
  }, [
    createElement('i', { className: 'bi bi-chevron-left' })
  ]);
  
  pagination.appendChild(prevBtn);
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = createElement('button', {
      className: i === 1 ? 'pagination-item active' : 'pagination-item',
      onClick: () => changePage(i)
    }, i.toString());
    
    pagination.appendChild(pageBtn);
  }
  
  // Next button
  const nextBtn = createElement('button', {
    className: 'pagination-item',
    onClick: () => changePage(2)
  }, [
    createElement('i', { className: 'bi bi-chevron-right' })
  ]);
  
  pagination.appendChild(nextBtn);
};

// Change page
const changePage = (pageNumber) => {
  // In a real app, this would load the new page of results
  // For demo, we'll just update the active page
  const paginationItems = document.querySelectorAll('.pagination-item');
  const prevBtn = paginationItems[0];
  const nextBtn = paginationItems[paginationItems.length - 1];
  const totalPages = paginationItems.length - 2; // Subtract prev and next buttons
  
  // Update active page
  paginationItems.forEach((item, index) => {
    if (index === 0 || index === paginationItems.length - 1) return; // Skip prev/next buttons
    
    if (index === pageNumber) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Update prev/next buttons
  prevBtn.disabled = pageNumber === 1;
  nextBtn.disabled = pageNumber === totalPages;
  
  // Scroll to top of results
  document.getElementById('tool-results').scrollIntoView({ behavior: 'smooth' });
};