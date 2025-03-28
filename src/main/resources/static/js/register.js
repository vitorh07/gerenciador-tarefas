async function register() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');

    // Função para exibir mensagens
    function showMessage(message, color) {
        messageElement.textContent = message;
        messageElement.style.color = color;
    }

    if (!username || !password || !email) {
        showMessage("Preencha todos os campos!", "red");
        return;
    }

    const registerRequest = {
        username: username,
        email: email,
        password: password
    };

    try {
        const response = await fetch('api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerRequest)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao registrar usuário.");
        }

        const data = await response.json();

        // Exibe mensagem de sucesso
        showMessage("Usuário, endereço e telefone cadastrados com sucesso!", "green");

        // Limpa os campos do formulário
        document.querySelectorAll('input').forEach(input => input.value = '');

        // Redireciona após 2 segundos
        setTimeout(() => {
            window.location.href = './view.html';
        }, 2000);
    } catch (error) {
        // Exibe mensagem de erro
        showMessage(`Erro: ${error.message}`, "red");
    }
}