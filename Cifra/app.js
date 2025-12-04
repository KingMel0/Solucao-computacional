const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const db = require('./config/database');
const { autenticar } = require('./middlewares/auth');
const cron = require('node-cron');
const fse = require('fs-extra');

require('./models/Usuario');
require('./models/Categoria');
require('./models/Conta');
require('./models/Transacao');
require('./models/Meta');
require('./models/associations');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'orcabem_secret', resave: false, saveUninitialized: true }));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.session.user || null;
  next();
});

app.use('/', require('./routes/authRoutes'));
app.use('/dashboard', autenticar, require('./routes/dashboardRoutes'));
app.use('/transacoes', autenticar, require('./routes/transacaoRoutes'));
app.use('/categorias', autenticar, require('./routes/categoriaRoutes'));
app.use('/metas', autenticar, require('./routes/metaRoutes'));
app.use('/contas', autenticar, require('./routes/contaRoutes'));
app.use('/relatorios', autenticar, require('./routes/relatorioRoutes'));
app.use('/backup', autenticar, require('./routes/backupRoutes'));

app.get('/', (req, res) => res.redirect('/login'));

fse.ensureDirSync(path.join(__dirname, 'backups'));

cron.schedule('0 2 * * *', async () => {
  try {
    const src = path.join(__dirname, 'orcabem.sqlite');
    const dst = path.join(__dirname, 'backups', `orcabem-${new Date().toISOString().slice(0,10)}.sqlite`);
    if (await fse.pathExists(src)) await fse.copy(src, dst);
    console.log('[backup] Gerado:', dst);
  } catch (e) { console.error('[backup] Erro:', e); }
});

db.sync({ alter: true }).then(() => console.log('Banco conectado!'));
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}/login`));
