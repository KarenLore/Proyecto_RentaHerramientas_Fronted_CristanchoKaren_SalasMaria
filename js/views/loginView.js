import { createElement } from '../utils/ui.js';
import { AuthService } from '../services/authService.js';
import { router } from '../router.js';
import { showNotification } from '../utils/ui.js';
import { USER_ROLES } from '../config.js';

export const loginView = () => {
  const container = createElement('div', { className: 'container' });
  
  const loginCard = createElement('div', { 
    className: 'mx-auto max-w-md card p-8',
    style: 'animation: slideInUp 0.5s ease-out;'
  }, [
    createElement('div', { className: 'text-center mb-8' }, [
      createElement('h1', { className: 'text-3xl font-bold' }, 'Bienvenido de Nuevo'),
      createElement('p', { className: 'text-gray' }, 'Inicia sesión en tu cuenta')
    ]),
    createElement('form', { 
      id: 'login-form',
      onSubmit: handleLogin
    }, [
      createElement('div', { className: 'form-group mb-4' }, [
        createElement('label', { 
          className: 'form-label', 
          for: 'email' 
        }, 'Correo Electrónico'),
        createElement('input', {
          type: 'email',
          id: 'email',
          className: 'form-control',
          placeholder: 'Ingresa tu correo electrónico',
          required: true
        })
      ]),
      createElement('div', { className: 'form-group mb-4' }, [
        createElement('label', { 
          className: 'form-label', 
          for: 'password' 
        }, 'Contraseña'),
        createElement('input', {
          type: 'password',
          id: 'password',
          className: 'form-control',
          placeholder: 'Ingresa tu contraseña',
          required: true
        })
      ]),
      createElement('div', { className: 'form-group mb-6' }, [
        createElement('label', { className: 'form-label' }, 'Tipo de Usuario'),
        createElement('select', {
          id: 'user-role',
          className: 'form-control',
          required: true
        }, [
          createElement('option', { value: '' }, 'Selecciona tu rol'),
          createElement('option', { value: USER_ROLES.CLIENT }, 'Cliente'),
          createElement('option', { value: USER_ROLES.SUPPLIER }, 'Proveedor'),
          createElement('option', { value: USER_ROLES.ADMIN }, 'Administrador')
        ])
      ]),
      createElement('div', { className: 'flex justify-between items-center mb-6' }, [
        createElement('div', { className: 'flex items-center' }, [
          createElement('input', {
            type: 'checkbox',
            id: 'remember',
            className: 'mr-2'
          }),
          createElement('label', { for: 'remember' }, 'Recordarme')
        ]),
        createElement('a', { 
          href: '#',
          className: 'text-primary hover:underline'
        }, '¿Olvidaste tu contraseña?')
      ]),
      createElement('button', {
        type: 'submit',
        className: 'btn btn-primary btn-block'
      }, 'Iniciar Sesión'),
      createElement('div', { 
        className: 'flex items-center my-6',
        style: 'height: 1px; background-color: var(--color-gray-200); position: relative;'
      }, [
        createElement('span', { 
          style: 'position: absolute; left: 50%; transform: translateX(-50%); background-color: white; padding: 0 10px;',
          className: 'text-gray'
        }, 'O')
      ]),
      createElement('div', { className: 'text-center' }, [
        createElement('p', { className: 'mb-4' }, [
          '¿No tienes una cuenta? ',
          createElement('a', { 
            href: '/register',
            className: 'text-primary hover:underline'
          }, 'Regístrate ahora')
        ])
      ])
    ])
  ]);
  
  container.appendChild(loginCard);
  return container;
};

const handleLogin = async (e) => {
  e.preventDefault();
  
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const roleSelect = document.getElementById('user-role');
  
  if (!emailInput || !passwordInput || !roleSelect) return;
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const role = roleSelect.value;
  
  if (!email || !password || !role) {
    showNotification('Por favor completa todos los campos', 'error');
    return;
  }
  
  try {
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner spinner-sm"></span> Iniciando sesión...';
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = {
      token: 'sample-jwt-token',
      role: role
    };
    
    localStorage.setItem('token', response.token);
    localStorage.setItem('role', response.role);
    
    window.dispatchEvent(new CustomEvent('auth:login'));
    
    showNotification('Inicio de sesión exitoso', 'success');
    
    router.navigate('/dashboard');
    
  } catch (error) {
    console.error('Error de inicio de sesión:', error);
    showNotification(error.message || 'Error al iniciar sesión. Por favor intenta de nuevo.', 'error');
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = false;
    submitButton.textContent = 'Iniciar Sesión';
  }
};