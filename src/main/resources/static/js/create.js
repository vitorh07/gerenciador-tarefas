async function createTask() {
    const token = localStorage.getItem("token");
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const deadline = document.getElementById("deadline").value;
    const messageElement = document.getElementById("message");

    // Função para exibir mensagens
    function showMessage(message, color) {
        messageElement.textContent = message;
        messageElement.style.color = color;
    }

    if (!title || !description || !deadline) {
        showMessage("Preencha todos os campos!", "red");
        return;
    }

    const taskRequest = {
        "title": title,
        "description": description,
        "completed": false,
        "deadline": deadline
    };

    try {
        const response = await fetch(`/api/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
            },
            body: JSON.stringify(taskRequest)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao criar a tarefa.");
        }

        const data = await response.json();

        // Exibe mensagem de sucesso
        showMessage("Tarefa criada com sucesso!", "green");

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