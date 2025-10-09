const db = require('../db');

class Despesa {
  static async criar(id_usuario, id_categoria_despesa, valor, data_despesa) {
    const [result] = await db.execute(
      `INSERT INTO despesas (id_usuario, id_categoria_despesa, valor, data_despesa)
       VALUES (?, ?, ?, ?)`,
      [id_usuario, id_categoria_despesa, valor, data_despesa]
    );
    return result.insertId;
  }

  static async listarPorUsuario(id_usuario) {
    const [rows] = await db.execute(
      `SELECT d.id_despesa, d.valor, d.data_despesa, c.nome_categoria
       FROM despesas d
       JOIN categorias_despesa c ON d.id_categoria_despesa = c.id_categoria_despesa
       WHERE d.id_usuario = ?
       ORDER BY d.data_despesa DESC`,
      [id_usuario]
    );
    return rows;
  }
}

module.exports = Despesa;