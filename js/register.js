const API_URL = 'http://localhost:8081/auth/register';

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;

    // Validar que las contraseñas coincidan
    if (form.password.value !== form.confirmPassword.value) {
        alert('Las contraseñas no coinciden');
        return;
    }

    // Validar términos y condiciones
    if (!form.terms.checked) {
        alert('Debes aceptar los términos y condiciones');
        return;
    }

    // Preparar datos para el backend
    const userData = {
        name: form.name.value,
        email: form.email.value,
        password: form.password.value,
        address: form.address.value,
        phone: form.phone.value,
        role: document.querySelector('.role-option.selected')?.dataset.role || "CLIENT" // Valor por defecto
    };

    console.log('Datos a enviar:', userData);
    
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const responseData = await res.json();
        
        if (!res.ok) {
            console.error('Error del backend:', responseData);
            let errorMessage = 'Error en el registro';
            
            if (responseData.errors) {
                // Manejar errores de validación
                errorMessage = Object.values(responseData.errors).join(', ');
            } else if (responseData.message) {
                errorMessage = responseData.message;
            }
            
            throw new Error(errorMessage);
        }

        console.log('Registro exitoso:', responseData);
        alert('¡Registro exitoso! Serás redirigido al login.');
        window.location.href = 'login.html';
    } catch (err) {
        console.error('Error completo:', err);
        alert('Error en el registro: ' + err.message);
    }
});

// Selector de roles
document.querySelectorAll('.role-option').forEach(opt => {
    opt.addEventListener('click', () => {
        document.querySelectorAll('.role-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
    });
});

// Toggle para mostrar/ocultar contraseña
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
        const input = button.parentElement.querySelector('input');
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});