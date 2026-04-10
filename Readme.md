## Biblioteca 

![Node.js](https://img.shields.io/badge/Node.js-18-green)
![Express](https://img.shields.io/badge/Express.js-backend-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-database-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![Docker](https://img.shields.io/badge/Docker-container-blue)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![API](https://img.shields.io/badge/API-REST-blue)

Sistema de gerenciamento de biblioteca desenvolvido com Node.js, Express e Prisma, seguindo arquitetura em camadas e boas práticas de engenharia de software.

API RESTful completa para gerenciamento de biblioteca com autenticação, controle de usuários e gerenciamento de empréstimos.

## Como executar

1. Clone o repositório

```bash
git clone https://github.com/pharaujodev/Biblioteca-Pedro.git
cd biblioteca
```

2. Configure as variáveis de ambiente
Copie o arquivo de exemplo e edite as credenciais conforme necessário:

```bash
cp .env.example .env
```
3. Suba a aplicação com Docker

```bash
docker-compose up --build
```

## Acesso à aplicação

Após iniciar os containers:

- Front-end: http://localhost:3000
- API: http://localhost:3000/api

## Execução do front-end

O front-end está localizado na pasta `frontend/` e é servido estaticamente pelo backend através do Express.

### Telas disponíveis

- Login: http://localhost:3000/index.html
- Cadastro: http://localhost:3000/cadastro.html
- Área do administrador: http://localhost:3000/admin.html
- Área do cliente: http://localhost:3000/usuario.html

### Acesso Padrão

Para facilitar os testes, o sistema possui um usuário administrador padrão:

- Email: admin@email.com
- Senha: admin123

## Tecnologias utilizadas

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- Docker e Docker Compose
- JWT
- bcrypt

## Arquitetura

O sistema segue uma arquitetura em camadas para facilitar a manutenção e escalabilidade:

- Routes: Definição dos endpoints.
- Controllers: Recebem requisições HTTP e validam entradas.
- Services: Concentram a lógica de negócio.
- Models: Gerenciam o acesso ao banco de dados via Prisma.
- Middlewares: Processam autenticação, autorização e tratamento de erros.

## Design Patterns e Princípios

- Singleton: Instância única do Prisma Client.
- Factory Method: Padronização de respostas com a classe ApiResponse.
- SOLID: Aplicação de SRP (Single Responsibility Principle) e OCP (Open/Closed Principle).

## Modelo de Dados

Entidades principais

- Usuários
- Livros
- Empréstimos
- Solicitações de Empréstimo

Relacionamentos

- Usuário -> Empréstimos (1:N)
- Livro -> Empréstimos (1:N)
- Usuário -> Solicitações (1:N)
- Livro -> Solicitações (1:N)

## Autenticação e Autorização

O controle de acesso é realizado via tokens JWT. O sistema utiliza dois níveis de permissão (Roles):

- admin: Acesso total ao sistema.
- cliente: Acesso restrito às suas próprias informações e consultas.

## Endpoints principais

Auth
- POST /api/auth/login

Usuários
- GET /api/usuarios
- POST /api/usuarios

Livros
- GET /api/livros
- POST /api/livros

Empréstimos
- GET /api/emprestimos
- GET /api/emprestimos/cliente
- POST /api/emprestimos

Solicitações
- POST /api/solicitacoes
- GET /api/solicitacoes

## Tratamento de erros

O sistema utiliza a classe AppError para representar erros de negócio. Os services lançam esses erros, que são capturados e processados por um middleware global de tratamento de exceções, retornando respostas padronizadas.

## Autor

Pedro Henrique de Araujo Pereira

