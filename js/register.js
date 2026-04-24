// register.js
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const termsCheckbox = document.getElementById('terms');

    // Toggle password visibility
    [togglePassword, toggleConfirmPassword].forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const input = e.target.closest('.input-group').querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            e.target.classList.toggle('fa-eye');
            e.target.classList.toggle('fa-eye-slash');
        });
    });

    // Verificar força da senha
    passwordInput.addEventListener('input', checkPasswordStrength);

    function checkPasswordStrength() {
        const password = passwordInput.value;
        let strength = 0;
        
        // Remover indicador anterior
        const existingIndicator = document.querySelector('.password-strength');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;

        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength';

        let strengthText = '';
        let strengthClass = '';

        switch (strength) {
            case 0:
            case 1:
                strengthText = 'Fraca';
                strengthClass = 'strength-weak';
                break;
            case 2:
            case 3:
                strengthText = 'Média';
                strengthClass = 'strength-medium';
                break;
            case 4:
                strengthText = 'Forte';
                strengthClass = 'strength-strong';
                break;
        }

        strengthIndicator.innerHTML = `<span class="${strengthClass}">Força da senha: ${strengthText}</span>`;
        passwordInput.parentElement.appendChild(strengthIndicator);
    }

    // Form submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validações
        if (!validateName(nameInput.value)) {
            showError(nameInput, 'Nome deve ter pelo menos 3 caracteres');
            return;
        }

        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Email inválido');
            return;
        }

        if (!validatePassword(passwordInput.value)) {
            showError(passwordInput, 'Senha deve ter pelo menos 8 caracteres');
            return;
        }

        if (passwordInput.value !== confirmPasswordInput.value) {
            showError(confirmPasswordInput, 'As senhas não coincidem');
            return;
        }

        if (!termsCheckbox.checked) {
            showError(termsCheckbox, 'Você deve aceitar os termos');
            return;
        }

        // Processar registro
        handleRegister({
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value
        });
    });

    function validateName(name) {
        return name.length >= 3;
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        return password.length >= 8;
    }

    function showError(input, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#ff4d4d';
        errorDiv.style.fontSize = '0.8em';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        
        const parent = input.closest('.input-group') || input.parentElement;
        const existing = parent.querySelector('.error-message');
        if (existing) {
            parent.removeChild(existing);
        }
        parent.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    function handleRegister(userData) {
        const registerBtn = document.querySelector('.register-btn');
        const originalContent = registerBtn.innerHTML;
        
        // Mostrar loading
        registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        registerBtn.disabled = true;

        // Simular registro
        setTimeout(() => {
            // Aqui você normalmente faria uma chamada para seu backend
            // Por enquanto, vamos apenas simular um registro bem-sucedido
            
            // Salvar dados do usuário (em produção, isso seria feito no backend)
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            users.push({
                name: userData.name,
                email: userData.email,
                password: userData.password // Em produção, NUNCA armazene senhas em texto plano
            });
            localStorage.setItem('users', JSON.stringify(users));
            
            // Redirecionar para login
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'login.html';
        }, 1500);
    }
});
