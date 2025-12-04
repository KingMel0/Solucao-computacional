# OrçaBem v3 (Node + Express + Sequelize + EJS + SQLite)

## Rodar
```bash
npm install
npm start
# http://localhost:3000/login
```

> Se já tinha um `orcabem.sqlite` antigo, apague antes para criar o schema certo.

## Scripts úteis
```bash
node seed.js   # cria usuário demo, categorias, conta
```

## Estrutura
- app.js
- config/database.js
- middlewares/auth.js
- models/ (Usuario, Categoria, Conta, Transacao, Meta, associations.js)
- controllers/ (auth, dashboard, transacao, categoria, conta, meta, relatorio, backup)
- routes/ (auth, dashboard, transacao, categoria, conta, meta, relatorio, backup)
- views/ (login.ejs, cadastro.ejs, dashboard.ejs, transacoes.ejs, categorias.ejs, contas.ejs, metas.ejs, relatorios.ejs, partials/flash.ejs, partials/nav.ejs)
- public/css/style.css
- public/js/main.js
