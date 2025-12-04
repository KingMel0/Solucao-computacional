const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Usuario = require('./Usuario');

const Categoria = db.define('Categoria', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  limite: { type: DataTypes.FLOAT, allowNull: true },
  fixo: { 
    type: DataTypes.BOOLEAN, 
    allowNull: false, 
    defaultValue: false 
  },
  UsuarioId: { type: DataTypes.INTEGER, allowNull: false }
});

Categoria.belongsTo(Usuario, { foreignKey: 'UsuarioId', onDelete: 'CASCADE' });
module.exports = Categoria;
