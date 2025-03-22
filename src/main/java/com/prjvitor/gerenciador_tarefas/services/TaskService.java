package com.prjvitor.gerenciador_tarefas.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.prjvitor.gerenciador_tarefas.model.Task;
import com.prjvitor.gerenciador_tarefas.DTO.TaskDTO;
import com.prjvitor.gerenciador_tarefas.model.User;
import com.prjvitor.gerenciador_tarefas.repositories.TaskRepository;
import com.prjvitor.gerenciador_tarefas.repositories.UserRepository;

@Service
public class TaskService {

    private final EmailService emailService;
    
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository, EmailService emailService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    // Criar métodos para salvar, atualizar, deletar e listar tarefas

    public Task saveTask(TaskDTO taskDTO) {
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setCompleted(taskDTO.isCompleted());
        task.setDeadline(taskDTO.getDeadline());

        if (taskDTO.getId_user() != null) {
            User user = userRepository.findById(taskDTO.getId_user()).orElse(null);
            task.setUser(user);
        }
        Task savedTask = taskRepository.save(task);

        // Enviar e-mail ao criar a tarefa
        if (task.getUser() != null && task.getUser().getEmail() != null) {
            String to = task.getUser().getEmail();
            String subject = "Nova Tarefa Criada: " + task.getTitle();
            String text = "Uma nova tarefa foi criada:\n\n" +
                          "Título: " + task.getTitle() + "\n" +
                          "Descrição: " + task.getDescription() + "\n" +
                          "Prazo: " + task.getDeadline() + "\n";
            emailService.sendEmail(to, subject, text);
        }

        return savedTask;
    }

    public Task updateTask(Long id, TaskDTO taskDTO) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task == null) {
            return null; // Ou você pode lançar uma exceção genérica, se preferir
        }
        
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setCompleted(taskDTO.isCompleted());
        task.setDeadline(taskDTO.getDeadline());
        
        if (taskDTO.getId_user() != null) {
            User user = userRepository.findById(taskDTO.getId_user()).orElse(null);
            task.setUser(user);
        }
        
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public List<Task> listTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Long id){
        return taskRepository.findById(id).orElse(null);
    }

    public Task getUserById(Long id){
        return taskRepository.findById(id).orElse(null);
    }

    public List<Task> getTaskByUser(User user){
        return taskRepository.findByUser(user);
    }
}