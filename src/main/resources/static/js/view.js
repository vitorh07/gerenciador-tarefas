function rCreate() {
    window.location.href = "./create.html";
}

function loadTask() {
    const userId = JSON.parse(localStorage.getItem("user")).id;

    fetch(`http://localhost:8080/api/tasks/user/${userId}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao carregar as tarefas");
        }
        return response.json();
    })
    .then(tasks => {
        const container = document.getElementById("container");

        // Remove elementos antigos (se houver)
        const oldTasks = document.querySelectorAll(".task");
        oldTasks.forEach(task => task.remove());

        if (tasks.length === 0) {
            const noTaskMessage = document.createElement("p");
            noTaskMessage.textContent = "Nenhuma tarefa encontrada.";
            container.appendChild(noTaskMessage);
            return;
        }

        tasks.forEach(task => {
            // Criar a div para a tarefa
            const taskDiv = document.createElement("div");
            taskDiv.className = "task";
            taskDiv.id = task.id;
        
            // Adicionar título
            const title = document.createElement("h2");
            title.id = "title-task";
            title.textContent = task.title;
            taskDiv.appendChild(title);
        
            // Adicionar descrição
            const description = document.createElement("p");
            description.id = "description";
            description.textContent = task.description;
            taskDiv.appendChild(description);
        
            // Adicionar data final
            const finalDate = document.createElement("p");
            finalDate.id = "final-date";
        
            // Formatar a data no formato DD/MM/YYYY
            if (task.deadline) {
                const date = new Date(task.deadline);
                finalDate.textContent = `Prazo: ${date.toLocaleDateString('pt-BR')}`;
            } else {
                finalDate.textContent = "Sem prazo definido";
            }
            taskDiv.appendChild(finalDate);
        
            // Adicionar checkbox de conclusão
            const completedCheckbox = document.createElement("input");
            completedCheckbox.type = "checkbox";
            completedCheckbox.id = "completed";
            completedCheckbox.checked = task.completed;
            completedCheckbox.addEventListener("change", () => updateTaskStatus(task.id, completedCheckbox.checked));
            taskDiv.appendChild(completedCheckbox);
        
            // Adicionar a div ao container
            container.appendChild(taskDiv);
        });
    })
    .catch(error => {
        console.error("Erro ao carregar as tarefas:", error);
        alert("Erro ao carregar as tarefas. Tente novamente mais tarde.");
    });
}

function updateTaskStatus(taskId, isCompleted) {
    fetch(`http://localhost:8080/api/tasks/${taskId}/completed`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: isCompleted }), // Envia um objeto JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao atualizar o status da tarefa");
        }
        return response.json();
    })
    .then(updatedTask => {
        console.log(`Tarefa ${updatedTask.id} atualizada com sucesso!`);
    })
    .catch(error => {
        console.error("Erro ao atualizar o status da tarefa:", error);
        alert("Erro ao atualizar o status da tarefa. Tente novamente mais tarde.");
    });
}