const Despesa = require('../models/Despesa');

exports.criarDespesa = async (req, res) => {
  try {
    const id_usuario = req.userId || req.body.id_usuario;
    const { id_categoria_despesa, valor, data_despesa } = req.body;
    if (!id_usuario || !id_categoria_despesa || !valor || !data_despesa) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }
    const id = await Despesa.criar(id_usuario, id_categoria_despesa, valor, data_despesa);
    res.status(201).json({ message: 'Despesa cadastrada', id_despesa: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar despesa' });
  }
};

exports.listarDespesasPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const despesas = await Despesa.listarPorUsuario(id_usuario);
    res.json(despesas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar despesas' });
  }
};