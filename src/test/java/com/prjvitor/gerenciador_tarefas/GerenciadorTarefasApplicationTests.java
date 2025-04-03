package com.prjvitor.gerenciador_tarefas;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import com.prjvitor.security.SecurityConfig;

@SpringBootTest
@Import(SecurityConfig.class) // Importa a configuração de segurança, se necessário
class GerenciadorTarefasApplicationTests {

    @Test
    void contextLoads() {
    }
}
