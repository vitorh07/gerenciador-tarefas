# 📌 Gerenciador de Tarefas  

## 📖 Descrição  
O **Gerenciador de Tarefas** é uma aplicação web que permite aos usuários criar, editar, excluir e gerenciar tarefas. O sistema também suporta a definição de prazos e a marcação de tarefas como concluídas.

## 🛠 Tecnologias Utilizadas  
- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Java (Spring Boot)  
- **Banco de Dados**: H2 (em memória)  
- **Bibliotecas e Frameworks**:  
  - Font Awesome (ícones)  
  - Fetch API (requisições HTTP)  
- **Outras Ferramentas**:  
  - Maven (gerenciamento de dependências)  
  - Postman (testes de API)  

## ✅ Requisitos para Rodar  
- **Java**: Versão 17 ou superior  
- **Maven**: Versão 3.6 ou superior  
- **Navegador Web**: Qualquer navegador moderno (Google Chrome, Firefox, etc.)  
- **Senha de App do Email**: Necessária para envio de notificações por email.  

---

## 🚀 Como Configurar o Projeto  

### 1️⃣ Clone o repositório  
```bash
git clone https://github.com/seu-usuario/gerenciador-tarefas.git
cd gerenciador-tarefas
```

### 2️⃣ Configure o envio de emails  
No arquivo `application.properties`, configure as credenciais do email que será usado para envio de notificações.  
Utilize uma senha de app gerada pelo provedor de email (ex.: Gmail).  

#### Exemplo:  
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=seu_email@gmail.com
spring.mail.password=sua_senha_de_app
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```
> **Nota:** A senha de app é uma senha gerada especificamente para aplicativos que acessam sua conta de email. No Gmail, você pode gerar essa senha em "Gerenciar sua Conta do Google > Segurança > Senhas de app".


### 3️⃣ Instale as dependências
```bash
mvn install
```

### 4️⃣ Inicie o servidor
```bash
mvn spring-boot:run
```

### 5️⃣ Acesse a aplicação
#### Abra o navegador e acesse:
```bash
http://localhost:8080
```

## 🌐 Endpoints da API  

### 🔹 Tarefas  
- **GET** `/api/tasks/user/{userId}` → Retorna todas as tarefas de um usuário.  
- **POST** `/api/tasks` → Cria uma nova tarefa.  
- **PUT** `/api/tasks/{taskId}` → Atualiza uma tarefa existente.  
- **PATCH** `/api/tasks/{taskId}/completed` → Atualiza o status de conclusão de uma tarefa.  
- **DELETE** `/api/tasks/{taskId}` → Exclui uma tarefa.  

### 🔹 Usuários  
- **POST** `/api/users` → Cria um novo usuário.  
- **GET** `/api/users/{userId}` → Retorna os detalhes de um usuário.  

## 📂 Estrutura do Projeto  

### `src/main/java/com/prjvitor/gerenciador_tarefas`
- **`GerenciadorTarefasApplication.java`**: Classe principal para inicializar a aplicação.
- **`controllers`**: Contém os controladores responsáveis por gerenciar as requisições HTTP.
  - `TaskController.java`: Controlador para gerenciar tarefas.
  - `UserController.java`: Controlador para gerenciar usuários.
- **`DTO`**: Contém as classes de transferência de dados (Data Transfer Objects).
  - `LoginRequest.java`: DTO para requisições de login.
  - `LoginResponse.java`: DTO para respostas de login.
  - `TaskDTO.java`: DTO para manipulação de tarefas.
- **`model`**: Contém as entidades do banco de dados.
  - `Task.java`: Entidade que representa uma tarefa.
  - `User.java`: Entidade que representa um usuário.
- **`repositories`**: Contém as interfaces de repositórios para acesso ao banco de dados.
  - `TaskRepository.java`: Repositório para tarefas.
  - `UserRepository.java`: Repositório para usuários.
- **`services`**: Contém as classes de serviço que implementam a lógica de negócios.
  - `TaskService.java`: Serviço para gerenciar tarefas.
  - `UserService.java`: Serviço para gerenciar usuários.
  - `EmailService.java`: Serviço para envio de emails.

### `src/main/resources`
- **`application.properties`**: Arquivo de configuração da aplicação.
- **`static`**: Contém os arquivos estáticos (HTML, CSS, JS).
  - **HTML**:
    - `index.html`: Página de login.
    - `register.html`: Página de registro.
    - `view.html`: Página para visualizar tarefas.
    - `create.html`: Página para criar tarefas.
  - **CSS**:
    - `style.css`: Estilos da aplicação.
  - **JS**:
    - `login.js`: Lógica para login.
    - `register.js`: Lógica para registro.
    - `view.js`: Lógica para exibir e gerenciar tarefas.
    - `create.js`: Lógica para criar tarefas.

### `src/test/java/com/prjvitor/gerenciador_tarefas`
- **`GerenciadorTarefasApplicationTests.java`**: Classe de testes para verificar o contexto da aplicação.

### Arquivos adicionais
- **`pom.xml`**: Arquivo de configuração do Maven.
- **`README.md`**: Documentação do projeto.

## 🤝 Contribuição  
Contribuições são bem-vindas! Sinta-se à vontade para abrir **issues** ou enviar **pull requests**.  

## 📜 Licença  
Este projeto está licenciado sob a **MIT License**.  
