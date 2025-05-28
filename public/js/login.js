document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            showError('Por favor, preencha todos os campos');
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha: password })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login realizado com sucesso:', data);
                alert('Login OK!');
                // Exemplo: redirecionar depois do login
                // window.location.href = '/dashboard.html';
            } else {
                showError(data.erro || 'Erro ao fazer login');
            }
        } catch (error) {
            showError('Erro ao processar a requisição');
            console.error('Erro:', error);
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
});
