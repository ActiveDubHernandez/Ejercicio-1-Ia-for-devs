# Documentación de Prompts - Validación de Formulario

## Herramienta de IA Utilizada
**Gemini 3 Pro** (Perplexity AI)
**Evidencia** (https://www.perplexity.ai/search/eres-un-arquitecto-senior-de-s-NiM67A44SIeL0GF7oHcoAQ#2)
---

## Estrategia de Prompting
Se utilizó una estrategia iterativa de tres fases para asegurar calidad, robustez y corrección lógica:
1.  **Zero-Shot Role Prompting:** Para definir la arquitectura sin sesgos previos.
2.  **Chain-of-Thought (CoT):** Para generar el código paso a paso, reduciendo errores lógicos.
3.  **Persona Pattern (Consultor QA):** Para auditar el código generado y asegurar calidad "enterprise".

---

## Historial de Prompts

### 1. Fase de Planificación (Zero-Shot)
**Técnica:** Zero-Shot + Role Playing (Arquitecto de Software)
**Objetivo:** Obtener un plan de arquitectura claro y diagramas de flujo antes de escribir código.

**Prompt Enviado:**
> Eres un arquitecto senior de software web. Analiza este proyecto de validación de formulario de registro y crea un plan completo.
>
> Archivos adjuntos:
> - index.html: Contiene formulario con IDs: registrationForm, username, email, password, usernameError, emailError, passwordError, successMessage
> - script.js: Skeleton con DOMContentLoaded y form submit listener con preventDefault(). Necesita lógica de validación.
>
> Requisitos exactos:
> 1. Username: obligatorio, mínimo 5 caracteres
> 2. Email: obligatorio, formato válido (regex)
> 3. Password: obligatoria, mínimo 8 chars, al menos 1 mayúscula + 1 número
>
> Comportamiento:
> - Mostrar error rojo en divs específicos si falla validación de campo
> - Si TODOS válidos: mostrar "¡Registro exitoso!" en successMessage (verde), resetear form
> - Si hay errores: mensaje general en successMessage
> - Los mensajes de error aparecen en rojo en los divs correspondientes cuando la validación falla. 
> - El mensaje de éxito (#successMessage) se muestra y el formulario se limpia al pasar todas las validaciones.
>
> Entregables del plan (responde SOLO esto en formato markdown):
> 1. **Arquitectura**: Diagrama de flujo (texto ASCII) del proceso submit → validaciones → resultados
> 2. **Funciones requeridas**: Lista exacta con params/returns
> 3. **Estructura script.js**: Código skeleton completo con comentarios dónde insertar cada función
> 4. **Regex sugeridas**: Para email y password
> 5. **Edge cases**: Lista de 5 casos críticos a probar
> 6. **Consideraciones**: Accesibilidad, performance, browser compatibility

---

### 2. Fase de Ejecución (Chain of Thought)
**Técnica:** Chain-of-Thought (Cadena de Pensamiento)
**Objetivo:** Generar el código final forzando a la IA a razonar cada paso de validación antes de escribir la solución.

**Prompt Enviado:**
> Eres experto JavaScript vanilla. Implementa COMPLETO el código de validación siguiendo este razonamiento paso a paso:
>
> Paso 1: Analiza index.html - confirma IDs exactos de inputs y error divs
> Paso 2: Revisa script.js skeleton - dónde insertar exactamente cada función
> Paso 3: Define función validateUsername(value) → boolean + mensaje error
> Paso 4: Define validateEmail(value) → boolean + regex `/^[^@]+@[^@]+\.[^@]+$/` + mensaje
> Paso 5: Define validatePassword(value) → boolean + regex `/^(?=.*[A-Z])(?=.*\d).{8,}$/` + mensaje
> Paso 6: Crea validateForm() → llama las 3, retorna true solo si todas pasan, maneja errores visuales
> Paso 7: Integra en submit handler: validateForm() ? success + reset : error message
>
> Piensa paso a paso antes del código final.
>
> Entrega FINAL (solo esto):
> - Código COMPLETO script.js listo para copiar/reemplazar
> - Cada función con comentarios explicando lógica
> - Limpieza automática de errores previos al reintentar

---

### 3. Fase de Refinamiento (Testing & QA)
**Técnica:** Consultant/Persona Pattern (QA Senior)
**Objetivo:** Revisión crítica del código para optimización y seguridad.

**Prompt Enviado:**
> Eres consultor QA senior nivel enterprise. Has recibido este código JavaScript de validación de formulario. Actúa como peer reviewer crítico.
>
> Código a revisar:
>// Esperamos a que el DOM esté completamente cargado
>document.addEventListener('DOMContentLoaded', () => {
    
    // Paso 1: Obtener referencias a todos los elementos del DOM necesarios
    const form = document.getElementById('registrationForm');
    
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    
    const successMessage = document.getElementById('successMessage');

    // Constantes de Regex solicitadas
    const EMAIL_REGEX = /^[^@]+@[^@]+\.[^@]+$/;
    const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    // Funciones de utilidad para UI (limpieza y visualización)
    const clearUI = () => {
        // Limpiar mensajes de error específicos
        usernameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        
        // Limpiar mensaje de estado general
        successMessage.textContent = '';
        successMessage.style.color = ''; // Resetear color
    };

    const showFieldError = (element, message) => {
        element.textContent = message;
        element.style.color = 'red'; // Requisito: Mostrar error en rojo
    };

    // Paso 3: Función de validación de Username
    // Retorna objeto con estado y mensaje
    const validateUsername = (value) => {
        const trimmedValue = value.trim();
        if (!trimmedValue) {
            return { isValid: false, message: 'El nombre de usuario es obligatorio.' };
        }
        if (trimmedValue.length < 5) {
            return { isValid: false, message: 'El usuario debe tener mínimo 5 caracteres.' };
        }
        return { isValid: true, message: '' };
    };

    // Paso 4: Función de validación de Email
    const validateEmail = (value) => {
        const trimmedValue = value.trim();
        if (!trimmedValue) {
            return { isValid: false, message: 'El correo electrónico es obligatorio.' };
        }
        if (!EMAIL_REGEX.test(trimmedValue)) {
            return { isValid: false, message: 'Formato de correo inválido (ej: usuario@dominio.com).' };
        }
        return { isValid: true, message: '' };
    };

    // Paso 5: Función de validación de Password
    const validatePassword = (value) => {
        // No hacemos trim() en password porque los espacios pueden ser intencionales,
        // aunque usualmente se valida longitud bruta.
        if (!value) {
            return { isValid: false, message: 'La contraseña es obligatoria.' };
        }
        if (!PASSWORD_REGEX.test(value)) {
            return { isValid: false, message: 'Mínimo 8 caracteres, una mayúscula y un número.' };
        }
        return { isValid: true, message: '' };
    };

    // Paso 6: Función orquestadora validateForm
    // Ejecuta todas las validaciones y actualiza la UI correspondientemente
    const validateForm = () => {
        let isFormValid = true;

        // Validar Username
        const usernameResult = validateUsername(usernameInput.value);
        if (!usernameResult.isValid) {
            showFieldError(usernameError, usernameResult.message);
            isFormValid = false;
        }

        // Validar Email
        const emailResult = validateEmail(emailInput.value);
        if (!emailResult.isValid) {
            showFieldError(emailError, emailResult.message);
            isFormValid = false;
        }

        // Validar Password
        const passwordResult = validatePassword(passwordInput.value);
        if (!passwordResult.isValid) {
            showFieldError(passwordError, passwordResult.message);
            isFormValid = false;
        }

        return isFormValid;
    };

    // Paso 7: Listener del evento Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevenir envío nativo

        // Limpieza automática de errores previos al reintentar
        clearUI();

        // Ejecutar validación
        const isValid = validateForm();

        if (isValid) {
            // Éxito: Mostrar mensaje verde y resetear
            successMessage.textContent = '¡Registro exitoso!';
            successMessage.style.color = 'green';
            form.reset();
        } else {
            // Error: Mostrar mensaje general (opcional, ya que mostramos errores específicos)
            // successMessage.textContent = 'Por favor corrige los errores.';
            // successMessage.style.color = 'red';
        }
    });
>});
>
> Tu análisis debe cubrir:
>
> **TEST CASES (ejecuta mentalmente):**
> 1. Todos campos vacíos
> 2. Username <5 chars
> 3. Email inválido (sin @, dominio corto, etc.)
> 4. Password <8, sin mayúscula, sin número
> 5. Todos válidos → success + reset
> 6. Edge: espacios, caracteres especiales, copy-paste
> 7. Los mensajes de error aparecen en rojo en los divs correspondientes cuando la validación falla. 
> 8. El mensaje de éxito (#successMessage) se muestra y el formulario se limpia al pasar todas las validaciones.
>
> **CRÍTICAS CONSTRUCTIVAS:**
> - Bugs potenciales (null checks, event bubbling, etc.)
> - Mejoras UX (real-time validation?, shake animation?)
> - Performance (unnecessary DOM queries?)
> - Accessibility (ARIA labels?)
> - Cross-browser (IE11 fallbacks?)
>
> **REFACTORIZACIONES SUGERIDAS:**
> Proporciona código corregido línea por línea con explicaciones.
>
> **VEREDICTO FINAL:**
> ✅ Aprobado production / ⚠️ Needs fixes / ❌ Rechazado
>
> Responde en formato CONSULTOR: Bullet points prioritarios + código final mejorado listo para deploy.