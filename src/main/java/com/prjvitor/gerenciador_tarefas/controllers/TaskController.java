package com.prjvitor.gerenciador_tarefas.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prjvitor.gerenciador_tarefas.model.Task;
import com.prjvitor.gerenciador_tarefas.model.User;
import com.prjvitor.gerenciador_tarefas.DTO.TaskDTO;
import com.prjvitor.gerenciador_tarefas.services.TaskService;

@RestController
@RequestMapping("/api")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // Métodos

    @GetMapping("/tasks")
    public List<Task> listTasks() {
        return taskService.listTasks();
    }

    @GetMapping("/tasks/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    @PostMapping("/tasks")
    public Task saveTask(@RequestBody TaskDTO taskDTO) {
        return taskService.saveTask(taskDTO);
    }

    @DeleteMapping("/tasks/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    @PutMapping("/tasks/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody TaskDTO taskDTO) {
        Task updatedTask = taskService.updateTask(id, taskDTO);
        if (updatedTask == null) {
            throw new RuntimeException("Task not found for this id :: " + id);
        }
        return updatedTask;
    }

    @GetMapping("/tasks/user/{user}")
    public ResponseEntity<List<Task>> getTaskByUser(@PathVariable("user") User user) {
        List<Task> task = taskService.getTaskByUser(user); // Ajuste o método no serviço
        if (task != null) {
            return ResponseEntity.ok(task);
        } else {
            return ResponseEntity.notFound().build(); // Retorna 404 se não encontrar
        }
    }

    @PatchMapping("/tasks/{id}/completed")
    public ResponseEntity<Task> updateTaskCompleted(@PathVariable Long id, @RequestBody Map<String, Boolean> updates) {
        if (!updates.containsKey("completed")) {
            return ResponseEntity.badRequest().build();
        }

        boolean completed = updates.get("completed");
        Task task = taskService.updateTaskCompleted(id, completed);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(task);
    }
}