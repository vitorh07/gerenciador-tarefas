package com.prjvitor.gerenciador_tarefas.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_user;

    @Column(name = "username", unique = true)
    @Size(min = 3, max = 20, message = "Username must have between 3 and 20 characters")
    private String username;

    @Column(name = "password")
    @Size(min = 6, message = "Password must have at least 6 characters")
    private String password;

    @Column(name = "email", unique = true)
    @Email(message = "Invalid email")
    private String email;
}
