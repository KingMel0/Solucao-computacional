const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contaController');

router.get('/', ctrl.listar);
router.get('/botao', ctrl.listarBotao);
router.post('/', ctrl.criar);
router.post('/:id/excluir', ctrl.excluir);
router.post('/:id/bloqueio', ctrl.alternarBloqueio);

module.exports = router;
