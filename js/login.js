document.addEventListener('DOMContentLoaded', function() {
    initPasswordToggle();
    initLoginForm();
});

// Función para el toggle de contraseña
function initPasswordToggle() {
    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.getElementById('togglePassword');
    
    if (!passwordInput || !togglePasswordButton) {
        console.error('Elementos para toggle de contraseña no encontrados');
        return;
    }

    togglePasswordButton.addEventListener('click', function() {
        // Cambiar tipo de input
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        // Cambiar icono
        const icon = this.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        }
    });
}

// Inicializar el formulario de login
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Manejo del login
async function handleLogin(event) {
    event.preventDefault();
    clearErrors();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!validateInputs(email, password)) {
        return;
    }

    try {
        const submitBtn = event.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando...';

        const response = await fetch('http://localhost:8081/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
                // Se eliminó el campo role
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al iniciar sesión');
        }

        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        
        // Redirigir al dashboard directamente
        window.location.href = '../Pages/client/dashboard.html';

    } catch (error) {
        console.error('Login error:', error);
        showError(error.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
    } finally {
        const submitBtn = event.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
        }
    }
}

// Validación de inputs (sin validación de rol)
function validateInputs(email, password) {
    let isValid = true;

    // Validación de email
    const emailError = document.getElementById('emailError');
    if (emailError) {
        if (!email) {
            emailError.textContent = 'El correo electrónico es requerido';
            emailError.style.display = 'block';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            emailError.textContent = 'Por favor ingresa un correo electrónico válido';
            emailError.style.display = 'block';
            isValid = false;
        }
    }

    // Validación de contraseña
    const passwordError = document.getElementById('passwordError');
    if (passwordError) {
        if (!password) {
            passwordError.textContent = 'La contraseña es requerida';
            passwordError.style.display = 'block';
            isValid = false;
        } else if (password.length < 6) {
            passwordError.textContent = 'La contraseña debe tener al menos 6 caracteres';
            passwordError.style.display = 'block';
            isValid = false;
        }
    }

    return isValid;
}

// Limpiar errores
function clearErrors() {
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    
    if (emailError) emailError.style.display = 'none';
    if (passwordError) passwordError.style.display = 'none';
}

// Mostrar errores
function showError(message) {
    const passwordError = document.getElementById('passwordError');
    if (passwordError) {
        passwordError.textContent = message || "Contraseña o email incorrectos";
        passwordError.style.display = 'block';
        
        passwordError.classList.add('shake');
        setTimeout(() => {
            passwordError.classList.remove('shake');
        }, 500);
    } else {
        alert(message);
    }
}