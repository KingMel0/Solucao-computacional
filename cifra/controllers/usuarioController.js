require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

exports.criarUsuario = async (req, res) => {
  try {
    const { nome, cpf, email, senha } = req.body;
    if (!nome || !cpf || !email || !senha) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }

    const existing = await Usuario.findByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email já cadastrado' });

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const id_usuario = await Usuario.criar({ nome, cpf, email, senhaHash });
    res.status(201).json({ message: 'Usuário cadastrado', id_usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
};

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.listar();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

    const user = await Usuario.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ id_usuario: user.id_usuario }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({ token, expiresIn: JWT_EXPIRES_IN });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
};