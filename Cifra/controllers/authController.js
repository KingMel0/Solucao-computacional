const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

exports.getLogin = (req, res) => res.render('login');
exports.getCadastro = (req, res) => res.render('cadastro');

exports.postCadastro = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      req.flash('error_msg', 'Preencha todos os campos.');
      return res.redirect('/cadastro');
    }
    const exists = await Usuario.findOne({ where: { email } });
    if (exists) {
      req.flash('error_msg', 'E-mail já cadastrado.');
      return res.redirect('/cadastro');
    }
    const hash = await bcrypt.hash(senha, 10);
    await Usuario.create({ nome, email, senha: hash });
    req.flash('success_msg', 'Conta criada! Faça login.');
    res.redirect('/login');
  } catch (e) {
    console.error(e);
    req.flash('error_msg', 'Erro ao cadastrar.');
    res.redirect('/cadastro');
  }
};

exports.postLogin = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await Usuario.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      req.flash('error_msg', 'Credenciais inválidas');
      return res.redirect('/login');
    }
    req.session.user = { id: user.id, nome: user.nome, email: user.email };
    res.redirect('/dashboard');
  } catch (e) {
    console.error(e);
    req.flash('error_msg', 'Erro ao autenticar.');
    res.redirect('/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};
