package com.prjvitor.gerenciador_tarefas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.prjvitor.gerenciador_tarefas.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String email);
}