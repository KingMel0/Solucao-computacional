const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/metaController');

router.get('/', ctrl.listar);
router.get('/botao', ctrl.listarBotao);
router.post('/', ctrl.criar);
router.post('/:id/excluir', ctrl.excluir);

module.exports = router;
