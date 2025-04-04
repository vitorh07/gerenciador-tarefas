function rCreate() {
    window.location.href = "./create.html";
}

async function loadTask() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Usuário não autenticado.");
        }

        const response = await fetch("http://localhost:8080/api/tasks/user", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao carregar as tarefas.");
        }

        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error(error.message);
        alert(error.message || "Erro ao carregar as tarefas.");
    }
}

function renderTasks(tasks) {
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
        const taskDiv = document.createElement("div");
        taskDiv.className = "task";
        taskDiv.id = task.id;

        const title = document.createElement("h2");
        title.id = "title-task";
        title.textContent = task.title;
        taskDiv.appendChild(title);

        const description = document.createElement("p");
        description.id = "description";
        description.textContent = task.description;
        taskDiv.appendChild(description);

        const finalDate = document.createElement("p");
        finalDate.id = "final-date";

        if (task.deadline) {
            const date = new Date(task.deadline);
            finalDate.textContent = `Prazo: ${date.toLocaleDateString("pt-BR")}`;
        } else {
            finalDate.textContent = "Sem prazo definido";
        }
        taskDiv.appendChild(finalDate);

        const completedCheckbox = document.createElement("input");
        completedCheckbox.type = "checkbox";
        completedCheckbox.id = "completed";
        completedCheckbox.checked = task.completed;
        completedCheckbox.addEventListener("change", () => updateTaskStatus(task.id, completedCheckbox.checked));
        taskDiv.appendChild(completedCheckbox);

        const editIcon = document.createElement("i");
        editIcon.className = "fa-solid fa-pen-to-square";
        editIcon.style.cursor = "pointer";
        editIcon.style.marginLeft = "10px";
        editIcon.addEventListener("click", () => editTask(task.id));
        taskDiv.appendChild(editIcon);

        const deleteIcon = document.createElement("i");
        deleteIcon.className = "fa-regular fa-trash-can";
        deleteIcon.style.cursor = "pointer";
        deleteIcon.style.marginLeft = "10px";
        deleteIcon.addEventListener("click", () => deleteTask(task.id));
        taskDiv.appendChild(deleteIcon);

        container.appendChild(taskDiv);
    });
}

async function updateTaskStatus(taskId, isCompleted) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Usuário não autenticado.");
        }

        const response = await fetch(`http://localhost:8080/api/tasks/${taskId}/completed`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ completed: isCompleted })
        });

        if (!response.ok) {
            throw new Error("Erro ao atualizar o status da tarefa.");
        }

        const updatedTask = await response.json();
        console.log(`Tarefa ${updatedTask.id} atualizada com sucesso!`);
    } catch (error) {
        console.error(error.message);
        alert(error.message || "Erro ao atualizar o status da tarefa.");
    }
}

async function deleteTask(taskId) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Usuário não autenticado.");
        }

        const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao excluir a tarefa.");
        }

        console.log(`Tarefa ${taskId} excluída com sucesso!`);
        loadTask();
    } catch (error) {
        console.error(error.message);
        alert(error.message || "Erro ao excluir a tarefa.");
    }
}

function editTask(taskId) {
    const taskDiv = document.getElementById(taskId);

    if (taskDiv.querySelector("input[type='text']") || taskDiv.querySelector("textarea") || taskDiv.querySelector("input[type='date']")) {
        loadTask();
        return;
    }

    const titleElement = taskDiv.querySelector("#title-task");
    const descriptionElement = taskDiv.querySelector("#description");
    const finalDateElement = taskDiv.querySelector("#final-date");

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = titleElement.textContent;
    titleInput.style.marginBottom = "10px";

    const descriptionInput = document.createElement("textarea");
    descriptionInput.value = descriptionElement.textContent;
    descriptionInput.style.marginBottom = "10px";

    const dateInput = document.createElement("input");
    dateInput.type = "date";

    const dateText = finalDateElement.textContent.split(": ")[1];
    if (dateText) {
        const parsedDate = new Date(dateText.split("/").reverse().join("-"));
        if (!isNaN(parsedDate)) {
            dateInput.value = parsedDate.toISOString().split("T")[0];
        }
    }

    taskDiv.replaceChild(titleInput, titleElement);
    taskDiv.replaceChild(descriptionInput, descriptionElement);
    taskDiv.replaceChild(dateInput, finalDateElement);

    const saveButton = document.createElement("button");
    saveButton.textContent = "Salvar";
    saveButton.style.marginTop = "10px";
    saveButton.addEventListener("click", () => saveTask(taskId, titleInput.value, descriptionInput.value, dateInput.value));

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancelar";
    cancelButton.style.marginTop = "10px";
    cancelButton.addEventListener("click", () => loadTask());

    taskDiv.appendChild(saveButton);
    taskDiv.appendChild(cancelButton);
}

async function saveTask(taskId, title, description, deadline) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Usuário não autenticado.");
        }

        const taskDTO = {
            title: title,
            description: description,
            deadline: deadline || null
        };

        const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(taskDTO)
        });

        if (!response.ok) {
            throw new Error("Erro ao salvar a tarefa.");
        }

        const updatedTask = await response.json();
        console.log(`Tarefa ${updatedTask.id} atualizada com sucesso!`);
        loadTask();
    } catch (error) {
        console.error(error.message);
        alert(error.message || "Erro ao salvar a tarefa.");
    }
}