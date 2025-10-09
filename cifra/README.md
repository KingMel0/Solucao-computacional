# Controle Financeiro - API (MVC) com JWT

Estrutura básica do projeto MVC em Node.js, MySQL e autenticação JWT.

## Como usar
1. Copie `.env.example` para `.env` e ajuste as variáveis.
2. Instale dependências: `npm install`
3. Crie o banco de dados (use o script SQL fornecido anteriormente).
4. Inicie: `npm start`

Rotas principais:
- POST /usuarios         -> cadastrar usuário
- POST /usuarios/login   -> login (retorna token)
- GET  /usuarios         -> listar usuários
- POST /receitas         -> criar receita (Bearer token)
- GET  /receitas/me      -> listar minhas receitas (Bearer token)
- POST /despesas         -> criar despesa (Bearer token)
- GET  /despesas/me      -> listar minhas despesas (Bearer token)