const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/categoriaController');

router.get('/', ctrl.listar);
router.post('/', ctrl.criar);
router.post('/:id/excluir', ctrl.excluir);
router.get('/botao', ctrl.listarBotao);

module.exports = router;
