const db = require('../db');

class Usuario {
  static async criar({ nome, cpf, email, senhaHash }) {
    const [result] = await db.execute(
      'INSERT INTO usuarios (nome, cpf, email, senha) VALUES (?, ?, ?, ?)',
      [nome, cpf, email, senhaHash]
    );
    return result.insertId;
  }

  static async listar() {
    const [rows] = await db.execute(
      'SELECT id_usuario, nome, cpf, email, criado_em FROM usuarios'
    );
    return rows;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT id_usuario, nome, cpf, email, senha FROM usuarios WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id_usuario) {
    const [rows] = await db.execute(
      'SELECT id_usuario, nome, cpf, email, criado_em FROM usuarios WHERE id_usuario = ?',
      [id_usuario]
    );
    return rows[0];
  }
}

module.exports = Usuario;