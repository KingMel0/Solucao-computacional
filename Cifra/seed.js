const bcrypt = require('bcrypt');
const db = require('./config/database');
const Usuario = require('./models/Usuario');
const Categoria = require('./models/Categoria');
const Conta = require('./models/Conta');

(async () => {
  try {
    require('./models/Transacao');
    require('./models/Meta');
    require('./models/associations');

    await db.sync({ alter: true });

    const senha = await bcrypt.hash('123456', 10);
    const u = await Usuario.create({ nome: 'Demo', email: 'demo@orcabem.com', senha });

    await Categoria.bulkCreate([
      { nome: 'Alimentação', limite: 1000, UsuarioId: u.id },
      { nome: 'Transporte', limite: 600, UsuarioId: u.id },
      { nome: 'Lazer', limite: 400, UsuarioId: u.id }
    ]);

    await Conta.create({ nome: 'Carteira', saldo: 500, UsuarioId: u.id });

    console.log('Seed concluído. Login: demo@orcabem.com / 123456');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
