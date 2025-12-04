const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Usuario = require('./Usuario');

const Meta = db.define('Meta', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  descricao: { type: DataTypes.STRING, allowNull: false },
  valor: { type: DataTypes.FLOAT, allowNull: false },
  prazo: { type: DataTypes.DATEONLY, allowNull: false },
  UsuarioId: { type: DataTypes.INTEGER, allowNull: false }
});

Meta.belongsTo(Usuario, { foreignKey: 'UsuarioId', onDelete: 'CASCADE' });
module.exports = Meta;
