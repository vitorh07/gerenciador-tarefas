package com.prjvitor.gerenciador_tarefas.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.prjvitor.gerenciador_tarefas.model.Task;
import com.prjvitor.gerenciador_tarefas.model.User;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);  
}