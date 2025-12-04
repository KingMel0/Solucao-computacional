const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Usuario = require('./Usuario');

const Conta = db.define('Conta', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  saldo: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  bloquearDevedor: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  UsuarioId: { type: DataTypes.INTEGER, allowNull: false }
});

Conta.belongsTo(Usuario, { foreignKey: 'UsuarioId', onDelete: 'CASCADE' });
module.exports = Conta;
