const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Categoria = require('./Categoria');
const Conta = require('./Conta');
const Usuario = require('./Usuario');

const Transacao = db.define('Transacao', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tipo: { type: DataTypes.STRING, allowNull: false },
  valor: { type: DataTypes.FLOAT, allowNull: false },
  data: { type: DataTypes.DATEONLY, allowNull: false },
  descricao: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'confirmada' },
  CategoriaId: { type: DataTypes.INTEGER, allowNull: true },
  ContaId: { type: DataTypes.INTEGER, allowNull: true },
  UsuarioId: { type: DataTypes.INTEGER, allowNull: false }
});

Transacao.belongsTo(Categoria, { foreignKey: 'CategoriaId', as: 'categoria', onDelete: 'SET NULL' });
Transacao.belongsTo(Conta,     { foreignKey: 'ContaId',     as: 'conta',     onDelete: 'SET NULL' });
Transacao.belongsTo(Usuario,   { foreignKey: 'UsuarioId',   as: 'usuario',   onDelete: 'CASCADE' });

module.exports = Transacao;
