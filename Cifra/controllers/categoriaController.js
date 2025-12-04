const Categoria = require('../models/Categoria');

exports.listar = async (req, res) => {
  const userId = req.session.user.id;
  const categorias = await Categoria.findAll({ where: { UsuarioId: userId }, order: [['nome','ASC']] });
  res.render('categorias', { categorias });
};

exports.listarBotao = async (req, res) => {
  const userId = req.session.user.id;
  const categorias = await Categoria.findAll({ where: { UsuarioId: userId }, order: [['nome','ASC']] });
  res.render('botaoC', { categorias });
};

/*
exports.criar = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { nome, limite } = req.body;
    if (!nome) { req.flash('error_msg', 'Informe o nome da categoria.'); return res.redirect('/categorias'); }
    await Categoria.create({ nome, limite: limite || null, UsuarioId: userId });
    req.flash('success_msg', 'Categoria criada.');
    res.redirect('/categorias');
  } catch (e) {
    console.error(e);
    req.flash('error_msg', 'Erro ao criar categoria.');
    res.redirect('/categorias');
  }
};
*/

exports.criar = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { nome, limite } = req.body;

    // Checkbox -> vem como "on" ou não vem → preciso converter pra boolean
    const fixo = req.body.fixo ? true : false;

    if (!nome) { 
      req.flash('error_msg', 'Informe o nome da categoria.'); 
      return res.redirect('/categorias'); 
    }

    await Categoria.create({ 
      nome, 
      limite: limite || null, 
      fixo,          // ← campo gravado no banco
      UsuarioId: userId 
    });

    req.flash('success_msg', 'Categoria criada.');
    res.redirect('/categorias');

  } catch (e) {
    console.error(e);
    req.flash('error_msg', 'Erro ao criar categoria.');
    res.redirect('/categorias');
  }
};

exports.excluir = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { id } = req.params;
    await Categoria.destroy({ where: { id, UsuarioId: userId } });
    req.flash('success_msg', 'Categoria removida.');
    res.redirect('/categorias');
  } catch (e) {
    console.error(e);
    req.flash('error_msg', 'Erro ao remover categoria.');
    res.redirect('/categorias');
  }
};
