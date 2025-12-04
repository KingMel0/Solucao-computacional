const Transacao = require('../models/Transacao');
const Categoria = require('../models/Categoria');
const Conta = require('../models/Conta');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const { Op } = require('sequelize');

// Carrega a página de relatórios
exports.form = (req, res) => res.render('relatorios');

exports.exportar = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { inicio, fim, formato } = req.body;

        const hoje = new Date();
        const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const ultimoDia   = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

        const where = { UsuarioId: userId };

        if (inicio && fim) where.data = { [Op.between]: [inicio, fim] };
        else where.data = { [Op.between]: [primeiroDia, ultimoDia] };

        const transacoes = await Transacao.findAll({
            where,
            include: [
                { model: Categoria, as: 'categoria' },
                { model: Conta, as: 'conta' }
            ],
            order: [['data', 'ASC']]
        });

        let totalEntradas = 0, totalSaidas = 0;

        const somaCategorias = {};
        const somaContas = {};

        transacoes.forEach(t => {
            const valor = Number(t.valor);
            const cat = t.categoria ? t.categoria.nome : "Sem Categoria";
            const conta = t.conta ? t.conta.nome : "Sem Conta";

            if (t.tipo.toUpperCase() != "RECEITA") totalSaidas += valor;
            else totalEntradas += valor;

            somaCategorias[cat]  = (somaCategorias[cat]  || 0) + valor;
            somaContas[conta]    = (somaContas[conta]    || 0) + valor;
        });

        const saldoFinal = totalEntradas - totalSaidas;

        if (formato === "pdf") {
            const doc = new PDFDocument({ size: "A4", margin: 40 });

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", 'attachment; filename="relatorio_financeiro.pdf"');
            doc.pipe(res);

            doc.fontSize(18).text("Relatório Financeiro - OrçaBem", { align: "center" }).moveDown(1);

            // Resumo Geral
            doc.fontSize(13).text("RESUMO FINANCEIRO DO PERÍODO", { underline: true }).moveDown(0.5);
            doc.fontSize(11).text(`Total Entradas:  R$ ${totalEntradas.toFixed(2)}`);
            doc.text(`Total Saídas:   R$ ${totalSaidas.toFixed(2)}`);
            doc.text(`Saldo Final:    R$ ${saldoFinal.toFixed(2)}`).moveDown(1);

            // Totais por Categoria
            doc.fontSize(13).text("Soma por Categoria", { underline: true }).moveDown(0.5);
            for (let c in somaCategorias) doc.fontSize(11).text(`${c}: R$ ${somaCategorias[c].toFixed(2)}`);
            doc.moveDown(1);

            // Totais por Conta
            doc.fontSize(13).text("Soma por Conta", { underline: true }).moveDown(0.5);
            for (let c in somaContas) doc.fontSize(11).text(`${c}: R$ ${somaContas[c].toFixed(2)}`);
            doc.moveDown(1.5);

            // Listagem detalhada
            doc.fontSize(14).text("Transações Detalhadas", { underline: true }).moveDown(0.8);

            transacoes.forEach(t => {
                doc.fontSize(10).text(
                    `${t.data} | ${t.tipo.toUpperCase()} | ${t.categoria ? t.categoria.nome : "-"} | `+
                    `${t.conta ? t.conta.nome : "-"} | R$ ${Number(t.valor).toFixed(2)} | ${t.descricao || ''}`
                );
            });

            doc.end();
            return;
        }

        req.flash("error_msg", "Formato inválido.");
        res.redirect("/relatorios");

    } catch (e) {
        console.error(e);
        req.flash("error_msg", "Erro ao gerar relatório.");
        res.redirect("/relatorios");
    }
};
