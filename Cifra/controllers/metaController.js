const Meta = require('../models/Meta');

exports.listar = async (req, res) => {
  const userId = req.session.user.id;
  const metas = await Meta.findAll({ where: { UsuarioId: userId }, order: [['prazo','ASC']] });
  res.render('metas', { metas });
};


exports.listarBotao = async (req, res) => {
  const userId = req.session.user.id;
  const metas = await Meta.findAll({ where: { UsuarioId: userId }, order: [['prazo','ASC']] });
  res.render('botaoM', { metas });
};

exports.criar = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { descricao, valor, prazo } = req.body;
    if (!descricao || !valor || !prazo) { req.flash('error_msg', 'Preencha todos os campos.'); return res.redirect('/metas'); }
    await Meta.create({ descricao, valor, prazo, UsuarioId: userId });
    req.flash('success_msg', 'Meta criada.');
    res.redirect('/metas');
  } catch (e) {
    console.error(e);
    req.flash('error_msg', 'Erro ao criar meta.');
    res.redirect('/metas');
  }
};

exports.excluir = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { id } = req.params;
    await Meta.destroy({ where: { id, UsuarioId: userId } });
    req.flash('success_msg', 'Meta removida.');
    res.redirect('/metas');
  } catch (e) {
    console.error(e);
    req.flash('error_msg', 'Erro ao remover meta.');
    res.redirect('/metas');
  }
};
