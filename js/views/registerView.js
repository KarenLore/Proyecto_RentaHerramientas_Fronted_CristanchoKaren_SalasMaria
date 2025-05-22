import { createElement } from '../utils/ui.js';
import { AuthService } from '../services/authService.js';
import { router } from '../router.js';
import { showNotification, validateForm } from '../utils/ui.js';

// Create and return the register view
export const registerView = () => {
  const container = createElement('div', { className: 'container' });
  
  // Register form card
  const registerCard = createElement('div', { 
    className: 'mx-auto max-w-lg card p-8',
    style: 'animation: slideInUp 0.5s ease-out;'
  }, [
    createElement('div', { className: 'text-center mb-8' }, [
      createElement('h1', { className: 'text-3xl font-bold' }, 'Create an Account'),
      createElement('p', { className: 'text-gray' }, 'Join our platform to rent and manage tools')
    ]),
    createElement('form', { 
      id: 'register-form',
      onSubmit: handleRegister
    }, [
      // Name input
      createElement('div', { className: 'form-group mb-4' }, [
        createElement('label', { 
          className: 'form-label', 
          for: 'name' 
        }, 'Full Name'),
        createElement('input', {
          type: 'text',
          id: 'name',
          className: 'form-control',
          placeholder: 'Enter your full name',
          required: true
        })
      ]),
      // Email input
      createElement('div', { className: 'form-group mb-4' }, [
        createElement('label', { 
          className: 'form-label', 
          for: 'email' 
        }, 'Email'),
        createElement('input', {
          type: 'email',
          id: 'email',
          className: 'form-control',
          placeholder: 'Enter your email',
          required: true
        })
      ]),
      // Password input
      createElement('div', { className: 'form-group mb-4' }, [
        createElement('label', { 
          className: 'form-label', 
          for: 'password' 
        }, 'Password'),
        createElement('input', {
          type: 'password',
          id: 'password',
          className: 'form-control',
          placeholder: 'Create a password (minimum 8 characters)',
          minLength: 8,
          required: true
        })
      ]),
      // Confirm password input
      createElement('div', { className: 'form-group mb-4' }, [
        createElement('label', { 
          className: 'form-label', 
          for: 'confirm-password' 
        }, 'Confirm Password'),
        createElement('input', {
          type: 'password',
          id: 'confirm-password',
          className: 'form-control',
          placeholder: 'Confirm your password',
          minLength: 8,
          required: true
        })
      ]),
      // Phone input
      createElement('div', { className: 'form-group mb-4' }, [
        createElement('label', { 
          className: 'form-label', 
          for: 'phone' 
        }, 'Phone Number'),
        createElement('input', {
          type: 'tel',
          id: 'phone',
          className: 'form-control',
          placeholder: 'Enter your phone number',
          required: true
        })
      ]),
      // Address input
      createElement('div', { className: 'form-group mb-4' }, [
        createElement('label', { 
          className: 'form-label', 
          for: 'address' 
        }, 'Address'),
        createElement('textarea', {
          id: 'address',
          className: 'form-control',
          placeholder: 'Enter your address',
          rows: 3,
          required: true
        })
      ]),
      // Account type
      createElement('div', { className: 'form-group mb-6' }, [
        createElement('label', { className: 'form-label' }, 'Account Type'),
        createElement('div', { className: 'flex gap-4' }, [
          createElement('label', { className: 'flex items-center' }, [
            createElement('input', {
              type: 'radio',
              name: 'account-type',
              value: 'CLIENT',
              className: 'mr-2',
              checked: true
            }),
            'Client (Rent Tools)'
          ]),
          createElement('label', { className: 'flex items-center' }, [
            createElement('input', {
              type: 'radio',
              name: 'account-type',
              value: 'SUPPLIER',
              className: 'mr-2'
            }),
            'Supplier (Provide Tools)'
          ])
        ])
      ]),
      // Terms and conditions
      createElement('div', { className: 'form-group mb-6' }, [
        createElement('label', { className: 'flex items-start' }, [
          createElement('input', {
            type: 'checkbox',
            id: 'terms',
            className: 'mr-2 mt-1',
            required: true
          }),
          createElement('span', {}, [
            'I agree to the ',
            createElement('a', { 
              href: '#',
              className: 'text-primary hover:underline'
            }, 'Terms of Service'),
            ' and ',
            createElement('a', { 
              href: '#',
              className: 'text-primary hover:underline'
            }, 'Privacy Policy')
          ])
        ])
      ]),
      // Submit button
      createElement('button', {
        type: 'submit',
        className: 'btn btn-primary btn-block'
      }, 'Create Account'),
      // Login link
      createElement('div', { className: 'text-center mt-6' }, [
        createElement('p', {}, [
          'Already have an account? ',
          createElement('a', { 
            href: '/login',
            className: 'text-primary hover:underline'
          }, 'Sign in')
        ])
      ])
    ])
  ]);
  
  container.appendChild(registerCard);
  return container;
};

// Handle register form submission
const handleRegister = async (e) => {
  e.preventDefault();
  
  // Validate form
  if (!validateForm(e.target)) {
    return;
  }
  
  // Get form values
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const accountType = document.querySelector('input[name="account-type"]:checked').value;
  
  // Validate passwords match
  if (password !== confirmPassword) {
    showNotification('Passwords do not match', 'error');
    return;
  }
  
  try {
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner spinner-sm"></span> Creating account...';
    
    // Prepare registration data
    const userData = {
      name,
      email,
      password,
      phone,
      address,
      role: accountType
    };
    
    // In a real app, this would call the API
    // For demo, we'll simulate success
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful registration
    const response = {
      token: 'sample-jwt-token',
      role: accountType
    };
    
    // Save auth data to localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('role', response.role);
    
    // Dispatch auth event
    window.dispatchEvent(new CustomEvent('auth:login'));
    
    // Show success message
    showNotification('Registration successful', 'success');
    
    // Navigate to dashboard
    router.navigate('/dashboard');
    
  } catch (error) {
    console.error('Registration error:', error);
    showNotification(error.message || 'Registration failed. Please try again.', 'error');
    
    // Reset button state
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = false;
    submitButton.textContent = 'Create Account';
  }
};