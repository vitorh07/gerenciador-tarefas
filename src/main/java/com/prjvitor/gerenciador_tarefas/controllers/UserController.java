package com.prjvitor.gerenciador_tarefas.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prjvitor.gerenciador_tarefas.DTO.LoginRequest;
import com.prjvitor.gerenciador_tarefas.model.User;
import com.prjvitor.gerenciador_tarefas.services.UserService;
import com.prjvitor.security.JwtUtil;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    // Criar
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        User user = new User();
        user.setUsername(request.get("username"));
        user.setPassword(passwordEncoder.encode(request.get("password")));
        user.setEmail(request.get("email"));
        User savedUser = userService.saveUser(user);
        return ResponseEntity.ok(savedUser);
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
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest loginRequest) {
        // Buscar o usuário pelo identifier (username ou email)
        User user = userService.login(loginRequest.getIdentifier(), loginRequest.getPassword());

        if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            // Gerar o token JWT
            String token = JwtUtil.generateToken(user.getUsername());
            Map<String, String> response = new HashMap<>();
            response.put("token", token); // Retornar o token
            return ResponseEntity.ok(response);
        }

        // Retornar 401 se as credenciais forem inválidas
        return ResponseEntity.status(401).body(null);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUserDetails(@RequestHeader("Authorization") String authorizationHeader) {
        // Verificar se o cabeçalho Authorization está presente
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(400).body("Token JWT não fornecido ou inválido.");
        }

        // Extrair o token do cabeçalho
        String token = authorizationHeader.substring(7); // Remove "Bearer "

        // Validar o token
        if (!JwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body("Token inválido ou expirado.");
        }

        // Extrair o username do token
        String username = JwtUtil.extractUsername(token);

        // Buscar o usuário no banco de dados
        User user = userService.getUserByUsername(username);
        if (user == null) {
            return ResponseEntity.status(404).body("Usuário não encontrado.");
        }

        // Retornar as informações do usuário
        return ResponseEntity.ok(user);
    }
}
