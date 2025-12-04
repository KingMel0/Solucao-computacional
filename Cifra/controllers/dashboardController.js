/*
const Transacao = require('../models/Transacao');
const Categoria = require('../models/Categoria');
const Conta = require('../models/Conta');
const Usuario = require('../models/Usuario');

exports.view = async (req, res) => {
  const userId = req.session.user.id;

  const receitas = await Transacao.sum('valor', { where: { UsuarioId: userId, tipo: 'receita', status: 'confirmada' } }) || 0;
  const despesas = await Transacao.sum('valor', { where: { UsuarioId: userId, tipo: 'despesa', status: 'confirmada' } }) || 0;
  const saldoContas = await Conta.sum('saldo', { where: { UsuarioId: userId } }) || 0;
  const user = await Usuario.findByPk(userId, { attributes: ['nome'], raw: true });

  const transacoes = await Transacao.findAll({
    where: { UsuarioId: userId },
    include: [{ model: Categoria, as: 'categoria' }],
    order: [['data','DESC'], ['id','DESC']],
    limit: 10
  });

  const pendentes = await Transacao.count({ where: { UsuarioId: userId, status: 'pendente' } });

  res.render('dashboard', {
    saldoTotal: (saldoContas).toFixed(2),
    totalReceitas: (receitas).toFixed(2),
    totalDespesas: (despesas).toFixed(2),
    transacoes,
    pendentes,
    user
  });
};
*/

const Transacao = require('../models/Transacao');
const Categoria = require('../models/Categoria');
const Conta = require('../models/Conta');
const Usuario = require('../models/Usuario');
const Meta = require('../models/Meta');
const { Op } = require('sequelize');

exports.view = async (req, res) => {
  const userId = req.session.user.id;

  const receitas = await Transacao.sum('valor', { 
    where: { UsuarioId: userId, tipo: 'receita', status: 'confirmada' } 
  }) || 0;

  const despesas = await Transacao.sum('valor', { 
    where: { UsuarioId: userId, tipo: 'despesa', status: 'confirmada' } 
  }) || 0;

  const metas = await Meta.findAll({
  where: { UsuarioId: userId },
  order: [['prazo', 'ASC']]
  });

  const saldoContas = await Conta.sum('saldo', { where: { UsuarioId: userId } }) || 0;

  const user = await Usuario.findByPk(userId, { attributes: ['nome'], raw: true });

  const transacoes = await Transacao.findAll({
    where: { UsuarioId: userId },
    include: [{ model: Categoria, as: 'categoria' }],
    order: [['data','DESC'], ['id','DESC']],
    limit: 10
  });

  const pendentes = await Transacao.count({ where: { UsuarioId: userId, status: 'pendente' } });

  // =================== FIXOS ======================= //
  const transacoesFixas = await Transacao.findAll({
    where: { UsuarioId: userId, status: 'confirmada' },
    include: [{ 
      model: Categoria, 
      as: 'categoria',
      where: { fixo: true }   // <== aqui a chave!
    }]
  });

  let ganhosFixos = 0;
  let custosFixos = 0;
  let categoriasAgrupadas = {};

  // Agrupando transações por categoria fixa
  transacoesFixas.forEach(t => {
    if (!categoriasAgrupadas[t.CategoriaId]) {
      categoriasAgrupadas[t.CategoriaId] = { soma: 0, qtd: 0, tipo: t.tipo };
    }
    categoriasAgrupadas[t.CategoriaId].soma += t.valor;
    categoriasAgrupadas[t.CategoriaId].qtd++;
  });

  // Média por categoria fixa
  Object.values(categoriasAgrupadas).forEach(c => {
    const media = c.soma / c.qtd;
    if (c.tipo === 'receita') ganhosFixos += media;
    if (c.tipo === 'despesa') custosFixos += media;
  });

  // ================================================ //

  // ================== FILTRO DO MÊS ATUAL ================== //
const hoje = new Date();
const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().slice(0,10);
const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).toISOString().slice(0,10);

// Receita do mês
const receitasMes = await Transacao.sum('valor', { 
  where: {
    UsuarioId: userId,
    tipo: 'receita',
    status: 'confirmada',
    data: { [Op.between]: [primeiroDiaMes, ultimoDiaMes] }
  }
}) || 0;

// Despesa do mês
const despesasMes = await Transacao.sum('valor', { 
  where: {
    UsuarioId: userId,
    tipo: 'despesa',
    status: 'confirmada',
    data: { [Op.between]: [primeiroDiaMes, ultimoDiaMes] }
  }
}) || 0;

  res.render('dashboard', {
    saldoTotal: saldoContas.toFixed(2),
    totalReceitas: receitas.toFixed(2),
    totalDespesas: despesas.toFixed(2),
    ganhosFixos: ganhosFixos.toFixed(2),
    custosFixos: custosFixos.toFixed(2),
    despesasMes: despesasMes.toFixed(2),
    receitasMes: receitasMes.toFixed(2),
    transacoes,
    pendentes,
    metas,
    user
  });
};