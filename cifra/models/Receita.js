const db = require('../db');

class Receita {
  static async criar(id_usuario, id_categoria_receita, valor, data_receita) {
    const [result] = await db.execute(
      `INSERT INTO receitas (id_usuario, id_categoria_receita, valor, data_receita)
       VALUES (?, ?, ?, ?)`,
      [id_usuario, id_categoria_receita, valor, data_receita]
    );
    return result.insertId;
  }

  static async listarPorUsuario(id_usuario) {
    const [rows] = await db.execute(
      `SELECT r.id_receita, r.valor, r.data_receita, c.nome_categoria
       FROM receitas r
       JOIN categorias_receita c ON r.id_categoria_receita = c.id_categoria_receita
       WHERE r.id_usuario = ?
       ORDER BY r.data_receita DESC`,
      [id_usuario]
    );
    return rows;
  }
}

module.exports = Receita;