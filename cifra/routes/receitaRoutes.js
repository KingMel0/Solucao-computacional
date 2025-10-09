const express = require('express');
const router = express.Router();
const receitaController = require('../controllers/receitaController');
const auth = require('../middleware/auth');

router.post('/', auth, receitaController.criarReceita);

router.get('/me', auth, async (req, res) => {
  req.params.id_usuario = req.userId;
  return receitaController.listarReceitasPorUsuario(req, res);
});

router.get('/:id_usuario', auth, receitaController.listarReceitasPorUsuario);

module.exports = router;