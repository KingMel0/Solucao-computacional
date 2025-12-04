const Conta = require('../models/Conta');

function toNumberBR(v) {
  if (v === null || v === undefined) return 0;
    return Number(String(v).replace(/\./g, '').replace(',', '.'));
}

exports.listar = async (req, res) => {
  const userId = req.session.user.id;
  const contas = await Conta.findAll({ where: { UsuarioId: userId }, order: [['nome','ASC']] });
  res.render('contas', { contas });
};

exports.listarBotao = async (req, res) => {
  const userId = req.session.user.id;
  const contas = await Conta.findAll({ where: { UsuarioId: userId }, order: [['nome','ASC']] });
  res.render('botaoCn.ejs', { contas });
};

exports.criar = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { nome, saldo, bloquearDevedor } = req.body;
    if (!nome) { req.flash('error_msg', 'Informe o nome da conta.'); return res.redirect('/contas'); }
    const saldoNum = toNumberBR(saldo);
    await Conta.create({
      nome,
      saldo: isFinite(saldoNum) ? saldoNum : 0,
      bloquearDevedor: !!bloquearDevedor,
      UsuarioId: userId
    });
    req.flash('success_msg', 'Conta criada.');
    res.redirect('/contas');
  } catch (e) {
    console.error(e);
    req.flash('error_msg', 'Erro ao criar conta.');
    res.redirect('/contas');
  }
};

exports.excluir = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { id } = req.params;
    await Conta.destroy({ where: { id, UsuarioId: userId } });
    req.flash('success_msg', 'Conta removida.');
    res.redirect('/contas');
  } catch (e) {
    console.error(e);
    req.flash('error_msg', 'Erro ao remover conta.');
    res.redirect('/contas');
  }
};

exports.alternarBloqueio = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { id } = req.params;
    const conta = await Conta.findOne({ where: { id, UsuarioId: userId } });
    if (!conta) { req.flash('error_msg','Conta não encontrada.'); return res.redirect('/contas'); }
    conta.bloquearDevedor = !conta.bloquearDevedor;
    await conta.save();
    req.flash('success_msg', `Bloqueio de saldo negativo: ${conta.bloquearDevedor ? 'ativado' : 'desativado'}.`);
    res.redirect('/contas');
  } catch (e) {
    console.error(e);
    req.flash('error_msg', 'Erro ao atualizar conta.');
    res.redirect('/contas');
  }
};
