const express = require('express');
const router = express.Router();
const despesaController = require('../controllers/despesaController');
const auth = require('../middleware/auth');

router.post('/', auth, despesaController.criarDespesa);

router.get('/me', auth, async (req, res) => {
  req.params.id_usuario = req.userId;
  return despesaController.listarDespesasPorUsuario(req, res);
});

router.get('/:id_usuario', auth, despesaController.listarDespesasPorUsuario);

module.exports = router;