package com.prjvitor.gerenciador_tarefas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class GerenciadorTarefasApplication {

	public static void main(String[] args) {
		SpringApplication.run(GerenciadorTarefasApplication.class, args);
	}

}
