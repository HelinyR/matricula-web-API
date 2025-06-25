document.addEventListener('DOMContentLoaded', () => {
    const emailForm = document.getElementById('emailForm');
    const resetForm = document.getElementById('resetForm');
    const messageEl = document.getElementById('message');

    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();

        if (!email) {
            showMessage('Por favor, insira um e-mail válido');
            return;
        }

        // Simulando envio do link
        showMessage('Link para redefinir a senha enviado para o seu e-mail.', true);

        // Esconde o formulário de e-mail e mostra o de reset
        emailForm.style.display = 'none';
        resetForm.style.display = 'block';
    });

    resetForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword.length < 6) {
            showMessage('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage('As senhas não coincidem');
            return;
        }

        // Aqui você chamaria sua API para atualizar a senha
        showMessage('Senha redefinida com sucesso!', true);

        // Opcional: desabilitar inputs e botão
        resetForm.querySelectorAll('input, button').forEach(el => el.disabled = true);
    });

    function showMessage(msg, success = false) {
        messageEl.textContent = msg;
        messageEl.className = 'message' + (success ? ' success' : '');
    }
});
