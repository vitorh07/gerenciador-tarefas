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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prjvitor.gerenciador_tarefas.model.Task;
import com.prjvitor.gerenciador_tarefas.model.User;
import com.prjvitor.gerenciador_tarefas.DTO.TaskDTO;
import com.prjvitor.gerenciador_tarefas.services.TaskService;
import com.prjvitor.gerenciador_tarefas.services.UserService;
import com.prjvitor.security.JwtUtil;

@RestController
@RequestMapping("/api")
public class TaskController {
    private final TaskService taskService;
    private final UserService userService;

    public TaskController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    // Listar todas as tarefas (apenas para fins administrativos)
    @GetMapping("/tasks")
    public List<Task> listTasks() {
        return taskService.listTasks();
    }

    // Obter uma tarefa pelo ID
    @GetMapping("/tasks/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    // Criar uma nova tarefa
    @PostMapping("/tasks")
    public ResponseEntity<Task> saveTask(@RequestBody TaskDTO taskDTO,
            @RequestHeader("Authorization") String authorizationHeader) {
        User authenticatedUser = getAuthenticatedUser(authorizationHeader);
        if (authenticatedUser == null) {
            return ResponseEntity.status(401).build();
        }
        taskDTO.setId_user(authenticatedUser.getId_user());
        Task savedTask = taskService.saveTask(taskDTO);
        return ResponseEntity.ok(savedTask);
    }

    // Deletar uma tarefa
    @DeleteMapping("/tasks/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    // Atualizar uma tarefa
    @PutMapping("/tasks/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody TaskDTO taskDTO) {
        Task updatedTask = taskService.updateTask(id, taskDTO);
        if (updatedTask == null) {
            throw new RuntimeException("Task not found for this id :: " + id);
        }
        return updatedTask;
    }

    // Obter tarefas do usuário autenticado
    @GetMapping("/tasks/user")
    public ResponseEntity<List<Task>> getTaskByUser(@RequestHeader("Authorization") String authorizationHeader) {
        User authenticatedUser = getAuthenticatedUser(authorizationHeader);
        if (authenticatedUser == null) {
            return ResponseEntity.status(401).build(); // Retorna 401 se o usuário não estiver autenticado
        }
        List<Task> tasks = taskService.getTaskByUser(authenticatedUser);
        return ResponseEntity.ok(tasks);
    }

    // Atualizar o status de conclusão de uma tarefa
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

    private User getAuthenticatedUser(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return null;
        }

        String token = authorizationHeader.substring(7); 
        if (!JwtUtil.validateToken(token)) {
            return null; 
        }

        String username = JwtUtil.extractUsername(token); 
        return userService.getUserByUsername(username);
    }
}