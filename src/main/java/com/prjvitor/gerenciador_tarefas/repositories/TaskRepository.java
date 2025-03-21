package com.prjvitor.gerenciador_tarefas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.prjvitor.gerenciador_tarefas.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
    
}
