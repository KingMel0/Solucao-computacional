const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Conta = require('./Conta');
const Transacao = require('./Transacao');
const Meta = require('./Meta');

Usuario.hasMany(Categoria, { foreignKey: 'UsuarioId' });
Usuario.hasMany(Conta,     { foreignKey: 'UsuarioId' });
Usuario.hasMany(Transacao, { foreignKey: 'UsuarioId' });
Usuario.hasMany(Meta,      { foreignKey: 'UsuarioId' });
