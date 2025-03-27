package com.prjvitor.gerenciador_tarefas.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prjvitor.gerenciador_tarefas.DTO.LoginRequest;
import com.prjvitor.gerenciador_tarefas.DTO.LoginResponse;
import com.prjvitor.gerenciador_tarefas.model.User;
import com.prjvitor.gerenciador_tarefas.services.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Criar
    @PostMapping("/register")
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    // Deletar
    @DeleteMapping("/id/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    // Buscar por ID
    @GetMapping("/id/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }

    // Buscar por Username
    @GetMapping("/username/{username}")
    public User getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username);
    }

    // Buscar por Email
    @GetMapping("/email/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    // Buscar todos
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User loggedUser = userService.login(request.getIdentifier(), request.getPassword());

        if (loggedUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
        }

        // Usando a classe LoginResponse para retornar o ID e a mensagem
        LoginResponse response = new LoginResponse(loggedUser.getId_user(), "Login realizado com sucesso");
        return ResponseEntity.ok(response);
    }
}
