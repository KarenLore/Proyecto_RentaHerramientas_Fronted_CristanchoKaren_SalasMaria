// Show notification
export const showNotification = (message, type = 'info') => {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `alert alert-${type} notification fade-in`;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.zIndex = '9999';
  notification.style.maxWidth = '300px';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '4px';
  notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  
  // Add icon based on type
  let icon = '';
  switch (type) {
    case 'success':
      icon = '<i class="bi bi-check-circle-fill"></i>';
      break;
    case 'error':
      icon = '<i class="bi bi-x-circle-fill"></i>';
      break;
    case 'warning':
      icon = '<i class="bi bi-exclamation-triangle-fill"></i>';
      break;
    default:
      icon = '<i class="bi bi-info-circle-fill"></i>';
  }
  
  notification.innerHTML = `${icon} <span>${message}</span>`;
  
  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.background = 'none';
  closeBtn.style.border = 'none';
  closeBtn.style.float = 'right';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.fontSize = '16px';
  closeBtn.style.marginLeft = '10px';
  closeBtn.style.opacity = '0.7';
  closeBtn.addEventListener('click', () => {
    removeNotification(notification);
  });
  
  notification.prepend(closeBtn);
  
  // Append to body
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    removeNotification(notification);
  }, 5000);
};

// Remove notification with animation
const removeNotification = (notification) => {
  notification.style.opacity = '0';
  notification.style.transform = 'translateX(100%)';
  notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
};

// Create and show modal
export const showModal = (title, content, actions = []) => {
  // Create modal elements
  const modalBackdrop = document.createElement('div');
  modalBackdrop.className = 'modal-backdrop';
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  // Create header
  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';
  
  const modalTitle = document.createElement('h4');
  modalTitle.className = 'modal-title';
  modalTitle.textContent = title;
  
  const closeButton = document.createElement('button');
  closeButton.className = 'modal-close';
  closeButton.innerHTML = '<i class="bi bi-x-lg"></i>';
  closeButton.setAttribute('aria-label', 'Close');
  
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);
  
  // Create body
  const modalBody = document.createElement('div');
  modalBody.className = 'modal-body';
  
  if (typeof content === 'string') {
    modalBody.innerHTML = content;
  } else {
    modalBody.appendChild(content);
  }
  
  // Create footer with actions
  const modalFooter = document.createElement('div');
  modalFooter.className = 'modal-footer';
  
  actions.forEach(action => {
    const button = document.createElement('button');
    button.className = `btn ${action.btnClass || 'btn-primary'}`;
    button.textContent = action.text;
    
    if (action.onClick) {
      button.addEventListener('click', () => {
        action.onClick(modalBackdrop);
      });
    }
    
    modalFooter.appendChild(button);
  });
  
  // Assemble modal
  modal.appendChild(modalHeader);
  modal.appendChild(modalBody);
  
  if (actions.length > 0) {
    modal.appendChild(modalFooter);
  }
  
  modalBackdrop.appendChild(modal);
  
  // Add to DOM
  document.body.appendChild(modalBackdrop);
  
  // Add active class after a small delay for animation
  setTimeout(() => {
    modalBackdrop.classList.add('active');
  }, 10);
  
  // Return the modal backdrop for potential later use
  return modalBackdrop;
};

// Format date
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Create element with attributes and children
export const createElement = (tag, attributes = {}, children = []) => {
  const element = document.createElement(tag);
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'innerHTML') {
      element.innerHTML = value;
    } else if (key === 'textContent') {
      element.textContent = value;
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.substring(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // Append children
  if (Array.isArray(children)) {
    children.forEach(child => {
      if (child instanceof Node) {
        element.appendChild(child);
      } else if (child !== null && child !== undefined) {
        element.appendChild(document.createTextNode(String(child)));
      }
    });
  } else if (children instanceof Node) {
    element.appendChild(children);
  } else if (children !== null && children !== undefined) {
    element.appendChild(document.createTextNode(String(children)));
  }
  
  return element;
};

// Validate form inputs
export const validateForm = (form) => {
  const inputs = form.querySelectorAll('input, select, textarea');
  let isValid = true;
  
  inputs.forEach(input => {
    // Skip inputs that don't need validation
    if (input.type === 'button' || input.type === 'submit' || input.type === 'reset' || input.hasAttribute('data-no-validate')) {
      return;
    }
    
    // Clear previous errors
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      const errorElement = formGroup.querySelector('.form-error');
      if (errorElement) {
        errorElement.remove();
      }
      input.classList.remove('is-invalid');
    }
    
    // Check required
    if (input.hasAttribute('required') && !input.value.trim()) {
      isValid = false;
      addInputError(input, 'This field is required');
    }
    
    // Check pattern
    if (input.hasAttribute('pattern') && input.value) {
      const pattern = new RegExp(input.getAttribute('pattern'));
      if (!pattern.test(input.value)) {
        isValid = false;
        addInputError(input, input.getAttribute('data-error-pattern') || 'Invalid format');
      }
    }
    
    // Check email
    if (input.type === 'email' && input.value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(input.value)) {
        isValid = false;
        addInputError(input, 'Please enter a valid email address');
      }
    }
    
    // Check min/max length
    if (input.hasAttribute('minlength') && input.value) {
      const minLength = parseInt(input.getAttribute('minlength'));
      if (input.value.length < minLength) {
        isValid = false;
        addInputError(input, `Minimum length is ${minLength} characters`);
      }
    }
    
    if (input.hasAttribute('maxlength') && input.value) {
      const maxLength = parseInt(input.getAttribute('maxlength'));
      if (input.value.length > maxLength) {
        isValid = false;
        addInputError(input, `Maximum length is ${maxLength} characters`);
      }
    }
    
    // Check custom validation
    if (input.hasAttribute('data-validate-fn') && input.value) {
      const fnName = input.getAttribute('data-validate-fn');
      if (window[fnName] && typeof window[fnName] === 'function') {
        const result = window[fnName](input.value);
        if (result !== true) {
          isValid = false;
          addInputError(input, result || 'Invalid value');
        }
      }
    }
  });
  
  return isValid;
};

// Add error message to form input
const addInputError = (input, message) => {
  input.classList.add('is-invalid');
  
  const formGroup = input.closest('.form-group');
  if (formGroup) {
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    formGroup.appendChild(errorElement);
  }
};

// Load image with fallback
export const loadImageWithFallback = (url, fallbackUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => resolve(url);
    
    img.onerror = () => {
      if (fallbackUrl) {
        resolve(fallbackUrl);
      } else {
        resolve('https://via.placeholder.com/300x200?text=No+Image');
      }
    };
    
    img.src = url;
  });
};