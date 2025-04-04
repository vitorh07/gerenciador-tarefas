function login() {
    const identifier = document.getElementById('identifier').value;
    const password = document.getElementById('password').value;

    if (!identifier || !password) {
        alert("Preencha todos os campos!");
        return;
    }

    const loginRequest = {
        identifier: identifier,
        password: password
    };

    fetch('api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginRequest)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Credenciais inválidas");
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            window.location.href = './view.html';
        })
        .catch(error => {
            console.error("Erro ao realizar login:", error);
            alert(error.message || "Ocorreu um erro. Tente novamente mais tarde.");
        });
}