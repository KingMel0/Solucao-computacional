const Transacao = require('../models/Transacao');
const Categoria = require('../models/Categoria');
const Conta = require('../models/Conta');
const { Op } = require('sequelize');

function toNumberBR(v) {
  if (v === null || v === undefined) return 0;
  return Number(String(v).replace(/\./g, '').replace(',', '.'));
}
function primeiroDiaMesStr(d) { const dt = new Date(d); dt.setDate(1); return dt.toISOString().slice(0,10); }
function ultimoDiaMesStr(d) { const dt = new Date(d); dt.setMonth(dt.getMonth()+1); dt.setDate(0); return dt.toISOString().slice(0,10); }

async function checarLimiteMensalCategoria(categoriaId, dataRef, userId) {
  try {
    const cat = await Categoria.findOne({ where: { id: categoriaId, UsuarioId: userId } });
    if (!cat) return { tipo: null, msg: null };
    const limiteNum = toNumberBR(cat.limite);
    if (!isFinite(limiteNum) || limiteNum <= 0) return { tipo: null, msg: null };
    const inicio = primeiroDiaMesStr(dataRef);
    const fim = ultimoDiaMesStr(dataRef);
    const totalDespesa = await Transacao.sum('valor', {
      where: { UsuarioId: userId, tipo: 'despesa', CategoriaId: categoriaId, data: { [Op.between]: [inicio, fim] }, status: 'confirmada' }
    }) || 0;
    const ratio = totalDespesa / limiteNum;
    if (ratio >= 1) return { tipo: 'critico', msg: `Categoria "${cat.nome}" ultrapassou o limite mensal (R$ ${limiteNum.toFixed(2)}).` };
    if (ratio >= 0.9) return { tipo: 'alerta', msg: `Categoria "${cat.nome}" atingiu 90% do limite mensal.` };
    return { tipo: null, msg: null };
  } catch (err) {
    console.error('[checarLimiteMensalCategoria] erro:', err);
    return { tipo: null, msg: null };
  }
}

/*
exports.formListar = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const categorias = await Categoria.findAll({ where: { UsuarioId: userId }, order: [['nome','ASC']] });
    const contas = await Conta.findAll({ where: { UsuarioId: userId }, order: [['nome','ASC']] });
    const transacoes = await Transacao.findAll({
      where: { UsuarioId: userId },
      include: [{ model: Categoria, as: 'categoria' }, { model: Conta, as: 'conta' }],
      order: [['data','DESC'], ['id','DESC']]
    });
    res.render('transacoes', { categorias, contas, transacoes });
  } catch (err) {
    console.error('[formListar] erro:', err);
    req.flash('error_msg', 'Erro ao carregar transações.');
    res.redirect('/dashboard');
  }
};
*/

exports.formListar = async (req, res) => {
  try {
    const userId = req.session.user.id;

    // 📅 Datas do mês atual (padrão)
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().slice(0,10);
    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).toISOString().slice(0,10);

    // 🔥 Se usuário filtrou, usa o filtro — senão usa mês atual
    const inicio = req.query.inicio || primeiroDia;
    const fim = req.query.fim || ultimoDia;

    let where = {
      UsuarioId: userId,
      data: { [Op.between]: [inicio, fim] } // padrão filtrado por mês atual
    };

    const categorias = await Categoria.findAll({ where: { UsuarioId: userId }, order: [['nome','ASC']] });
    const contas = await Conta.findAll({ where: { UsuarioId: userId }, order: [['nome','ASC']] });

    const transacoes = await Transacao.findAll({
      where,
      include: [{ model: Categoria, as: 'categoria' }, { model: Conta, as: 'conta' }],
      order: [['data','DESC'], ['id','DESC']]
    });

    res.render('transacoes', { 
      categorias, 
      contas, 
      transacoes,
      inicio, // mantém para exibir no input
      fim
    });

  } catch (err) {
    console.error('[formListar] erro:', err);
    req.flash('error_msg', 'Erro ao carregar transações.');
    res.redirect('/dashboard');
  }
};

exports.formListarBotao = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const categorias = await Categoria.findAll({ where: { UsuarioId: userId }, order: [['nome','ASC']] });
    const contas = await Conta.findAll({ where: { UsuarioId: userId }, order: [['nome','ASC']] });
    const transacoes = await Transacao.findAll({
      where: { UsuarioId: userId },
      include: [{ model: Categoria, as: 'categoria' }, { model: Conta, as: 'conta' }],
      order: [['data','DESC'], ['id','DESC']]
    });
    res.render('botaoT', { categorias, contas, transacoes });
  } catch (err) {
    console.error('[formListar] erro:', err);
    req.flash('error_msg', 'Erro ao carregar transações.');
    res.redirect('/transacoes');
  }
};

exports.criar = async (req, res) => {
  const userId = req.session.user.id;
  try {
    let { tipo, CategoriaId, ContaId, valor, data, descricao, status } = req.body;
    tipo = (tipo || '').toLowerCase();
    CategoriaId = parseInt(CategoriaId, 10);
    ContaId = parseInt(ContaId, 10);
    const valorNum = toNumberBR(valor);

    if (!['receita','despesa'].includes(tipo) || !isFinite(CategoriaId) || !isFinite(ContaId) || !isFinite(valorNum) || !data) {
      req.flash('error_msg', 'Preencha corretamente os campos obrigatórios.');
      return res.redirect('/transacoes');
    }

    const conta = await Conta.findOne({ where: { id: ContaId, UsuarioId: userId } });
    if (!conta) { req.flash('error_msg', 'Conta inválida.'); return res.redirect('/transacoes'); }
    const categoria = await Categoria.findOne({ where: { id: CategoriaId, UsuarioId: userId } });
    if (!categoria) { req.flash('error_msg','Categoria inválida.'); return res.redirect('/transacoes'); }

    // 🔒 Regra RN-009: bloquear saldo negativo
    if (tipo === 'despesa' && conta.bloquearDevedor) {
      const saldoAtual = toNumberBR(conta.saldo);
      if (!isFinite(saldoAtual)) {
        req.flash('error_msg', 'Saldo da conta inválido.');
        return res.redirect('/transacoes');
      }
      if ((saldoAtual - valorNum) < 0) {
        req.flash('error_msg', 'Operação bloqueada: saldo negativo não permitido nesta conta.');
        return res.redirect('/transacoes');
      }
    }

    const t = await Transacao.create({
      tipo, CategoriaId, ContaId, valor: valorNum, data,
      descricao: descricao || null, status: status || 'confirmada', UsuarioId: userId
    });

    // Atualiza saldo só se confirmada
    if (t.status === 'confirmada') {
      const saldoAtual = toNumberBR(conta.saldo);
      conta.saldo = tipo === 'receita' ? (saldoAtual + valorNum) : (saldoAtual - valorNum);
      await conta.save();
    }

    const lim = await checarLimiteMensalCategoria(CategoriaId, data, userId);
    if (lim.tipo === 'critico') req.flash('error_msg', lim.msg);
    else if (lim.tipo === 'alerta') req.flash('success_msg', lim.msg);

    if (t.status === 'pendente') req.flash('success_msg', 'Transação pendente registrada.');
    else if (!lim.tipo) req.flash('success_msg', 'Transação registrada.');

    return res.redirect('/transacoes');
  } catch (err) {
    console.error('[criar] erro:', err);
    req.flash('error_msg', 'Erro ao salvar transação.');
    return res.redirect('/transacoes');
  }
};

exports.excluir = async (req, res) => {
  const userId = req.session.user.id;
  try {
    const { id } = req.params;
    const t = await Transacao.findOne({ where: { id, UsuarioId: userId } });
    if (!t) { req.flash('error_msg','Transação não encontrada.'); return res.redirect('/transacoes'); }

    if (t.status === 'confirmada' && t.ContaId) {
      const conta = await Conta.findOne({ where: { id: t.ContaId, UsuarioId: userId } });
      if (conta) {
        const saldoAtual = toNumberBR(conta.saldo);
        conta.saldo = t.tipo === 'receita' ? (saldoAtual - toNumberBR(t.valor)) : (saldoAtual + toNumberBR(t.valor));
        await conta.save();
      }
    }
    await t.destroy();
    req.flash('success_msg', 'Transação removida.');
    res.redirect('/transacoes');
  } catch (e) {
    console.error('[excluir] erro:', e);
    req.flash('error_msg', 'Erro ao remover transação.');
    res.redirect('/transacoes');
  }
};
