const Receita = require('../models/Receita');

exports.criarReceita = async (req, res) => {
  try {
    const id_usuario = req.userId || req.body.id_usuario;
    const { id_categoria_receita, valor, data_receita } = req.body;
    if (!id_usuario || !id_categoria_receita || !valor || !data_receita) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }
    const id = await Receita.criar(id_usuario, id_categoria_receita, valor, data_receita);
    res.status(201).json({ message: 'Receita cadastrada', id_receita: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar receita' });
  }
};

exports.listarReceitasPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const receitas = await Receita.listarPorUsuario(id_usuario);
    res.json(receitas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar receitas' });
  }
};