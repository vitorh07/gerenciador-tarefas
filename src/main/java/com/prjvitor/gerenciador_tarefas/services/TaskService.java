package com.prjvitor.gerenciador_tarefas.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.prjvitor.gerenciador_tarefas.model.Task;
import com.prjvitor.gerenciador_tarefas.repositories.TaskRepository;

@Service
public class TaskService {
    
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // Criar métodos para salvar, atualizar, deletar e listar tarefas

    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    public Task updateTask(Task task) {
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public List<Task> listTasks() {
        return taskRepository.findAll();
    }
}
