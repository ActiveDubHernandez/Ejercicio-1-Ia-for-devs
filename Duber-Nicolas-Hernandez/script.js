document.addEventListener('DOMContentLoaded', () => {
    // Referencias al DOM con Null Checks preventivos
    const form = document.getElementById('registrationForm');
    if (!form) return; // Evita errores si el script carga en otra página

    // Mapeo de campos para iteración más limpia y escalable
    const fields = {
        username: {
            input: document.getElementById('username'),
            error: document.getElementById('usernameError'),
            validate: (val) => {
                const trimmed = val.trim();
                if (!trimmed) return 'El nombre de usuario es obligatorio.';
                if (trimmed.length < 5) return 'El usuario debe tener mínimo 5 caracteres.';
                return null;
            }
        },
        email: {
            input: document.getElementById('email'),
            error: document.getElementById('emailError'),
            validate: (val) => {
                const trimmed = val.trim();
                // Regex robusto estándar W3C
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!trimmed) return 'El correo electrónico es obligatorio.';
                if (!emailRegex.test(trimmed)) return 'Ingresa un correo válido (ej: nombre@dominio.com).';
                return null;
            }
        },
        password: {
            input: document.getElementById('password'),
            error: document.getElementById('passwordError'),
            validate: (val) => {
                // Regex: 8 chars, 1 Mayus, 1 Num
                const passRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
                if (!val) return 'La contraseña es obligatoria.';
                if (!passRegex.test(val)) return 'Mínimo 8 caracteres, una mayúscula y un número.';
                return null;
            }
        }
    };

    const successMessage = document.getElementById('successMessage');

    // Función pura para manejar estado de error visual y ARIA
    const setFieldError = (key, message) => {
        const field = fields[key];
        if (message) {
            // Estado de Error
            field.error.textContent = message;
            field.error.style.color = 'red'; // Idealmente usar classList.add('text-danger')
            
            // A11y: Marcar input como inválido
            field.input.setAttribute('aria-invalid', 'true');
            field.input.setAttribute('aria-describedby', `${key}Error`); // Vincula input con mensaje
        } else {
            // Estado Limpio
            field.error.textContent = '';
            field.input.removeAttribute('aria-invalid');
            field.input.removeAttribute('aria-describedby');
        }
    };

    const clearGlobalMessages = () => {
        successMessage.textContent = '';
        successMessage.className = ''; // Limpiar clases previas
    };

    // Handler Principal
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearGlobalMessages();

        let isFormValid = true;
        let firstInvalidField = null;

        // Iterar sobre configuración de campos
        for (const key in fields) {
            const field = fields[key];
            const errorMessage = field.validate(field.input.value);

            if (errorMessage) {
                isFormValid = false;
                setFieldError(key, errorMessage);
                
                // Capturar el primer campo erróneo para el foco
                if (!firstInvalidField) firstInvalidField = field.input;
            } else {
                setFieldError(key, null); // Limpiar si ya es válido
            }
        }

        if (isFormValid) {
            // Éxito
            successMessage.textContent = '¡Registro exitoso!';
            successMessage.style.color = 'green';
            form.reset();
            
            // Eliminar estados de error residuales visualmente tras reset
            Object.keys(fields).forEach(key => setFieldError(key, null));
        } else {
            // UX: Mover foco al primer error
            if (firstInvalidField) firstInvalidField.focus();
        }
    });
});
