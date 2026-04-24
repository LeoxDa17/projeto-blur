document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    // Form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        // Validação básica
        if (!email || !password) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        // Pegar usuários cadastrados
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Procurar usuário
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Login bem sucedido
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirecionar para o index.html na raiz
            try {
                console.log('Redirecionando para a página inicial...');
                window.location.href = '../index.html'; // Volta uma pasta e vai para o index
                // Se não funcionar, tente uma destas alternativas:
                // window.location.href = '/index.html';
                // window.location.replace('../index.html');
                // window.location.assign('../index.html');
            } catch (error) {
                console.error('Erro no redirecionamento:', error);
            }
        } else {
            // Login falhou
            alert('Email ou senha incorretos!');
        }
    });
});
