const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'orcabem.sqlite',
  logging: false
});
module.exports = sequelize;
