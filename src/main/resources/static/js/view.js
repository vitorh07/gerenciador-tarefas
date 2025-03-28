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
        
            // Adicionar ícone de edição
            const editIcon = document.createElement("i");
            editIcon.className = "fa-solid fa-pen-to-square";
            editIcon.style.cursor = "pointer";
            editIcon.style.marginLeft = "10px";
            editIcon.addEventListener("click", () => editTask(task.id)); // Função para editar a tarefa
            taskDiv.appendChild(editIcon);
        
            // Adicionar ícone de exclusão
            const deleteIcon = document.createElement("i");
            deleteIcon.className = "fa-regular fa-trash-can";
            deleteIcon.style.cursor = "pointer";
            deleteIcon.style.marginLeft = "10px";
            deleteIcon.addEventListener("click", () => deleteTask(task.id)); // Função para excluir a tarefa
            taskDiv.appendChild(deleteIcon);
        
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

function deleteTask(taskId) {
        fetch(`http://localhost:8080/api/tasks/${taskId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao excluir a tarefa");
            }
            console.log(`Tarefa ${taskId} excluída com sucesso!`);
            loadTask(); // Recarregar as tarefas após a exclusão
        })
        .catch(error => {
            console.error("Erro ao excluir a tarefa:", error);
            alert("Erro ao excluir a tarefa. Tente novamente mais tarde.");
        });
}


function editTask(taskId) {
    const taskDiv = document.getElementById(taskId);

    if (taskDiv.querySelector("input[type='text']") || taskDiv.querySelector("textarea") || taskDiv.querySelector("input[type='date']")) {
        loadTask(); // Recarrega as tarefas para cancelar a edição
        return;
    }
    
    // Obter os elementos existentes
    const titleElement = taskDiv.querySelector("#title-task");
    const descriptionElement = taskDiv.querySelector("#description");
    const finalDateElement = taskDiv.querySelector("#final-date");

    // Criar inputs para edição
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = titleElement.textContent;
    titleInput.style.marginBottom = "10px";

    const descriptionInput = document.createElement("textarea");
    descriptionInput.value = descriptionElement.textContent;
    descriptionInput.style.marginBottom = "10px";

    const dateInput = document.createElement("input");
    dateInput.type = "date";

    // Verificar se a data é válida
    const dateText = finalDateElement.textContent.split(": ")[1];
    if (dateText) {
        const parsedDate = new Date(dateText.split("/").reverse().join("-")); // Converter de DD/MM/YYYY para YYYY-MM-DD
        if (!isNaN(parsedDate)) {
            dateInput.value = parsedDate.toISOString().split("T")[0];
        }
    }

    // Substituir os elementos pelos inputs
    taskDiv.replaceChild(titleInput, titleElement);
    taskDiv.replaceChild(descriptionInput, descriptionElement);
    taskDiv.replaceChild(dateInput, finalDateElement);

    // Adicionar botão de salvar
    const saveButton = document.createElement("button");
    saveButton.textContent = "Salvar";
    saveButton.style.marginTop = "10px";
    saveButton.addEventListener("click", () => saveTask(taskId, titleInput.value, descriptionInput.value, dateInput.value));

    // Adicionar botão de cancelar
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancelar";
    cancelButton.style.marginTop = "10px";
    cancelButton.addEventListener("click", () => loadTask()); // Recarrega as tarefas para cancelar a edição

    // Adicionar os botões à div
    taskDiv.appendChild(saveButton);
    taskDiv.appendChild(cancelButton);
}

function saveTask(taskId, title, description, deadline) {
    const taskDTO = {
        title: title,
        description: description,
        deadline: deadline || null, // Enviar null se a data estiver vazia
    };

    fetch(`http://localhost:8080/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskDTO),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao salvar a tarefa");
        }
        return response.json();
    })
    .then(updatedTask => {
        console.log(`Tarefa ${updatedTask.id} atualizada com sucesso!`);
        loadTask(); // Recarregar as tarefas para refletir as alterações
    })
    .catch(error => {
        console.error("Erro ao salvar a tarefa:", error);
        alert("Erro ao salvar a tarefa. Tente novamente mais tarde.");
    });
}