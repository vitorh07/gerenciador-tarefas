function register() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!username || !password || !email) {
        console.error("Preencha todos os campos!");
        return;
    }

    const registerRequest = {
        username: username,
        email: email,
        password: password
    };

    fetch('api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerRequest)
    })
    .then(response => {
        if (!response.ok && response.status !== 201) { // Aceita 201 como sucesso
            return response.json().then(err => {
                throw new Error(err.message || "Erro ao registrar usuário.");
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.id) { // Verifica se o ID do usuário está presente
            localStorage.setItem('user', JSON.stringify(data));
            window.location.href = './view.html';
        }
    })
    .catch(error => {
        console.error("Erro ao realizar registro:", error.message || "Ocorreu um erro. Tente novamente mais tarde.");
    });
}