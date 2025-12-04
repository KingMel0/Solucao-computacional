const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/transacaoController');

router.get('/', ctrl.formListar);
router.get('/nova', ctrl.formListar);
router.post('/', ctrl.criar);
router.post('/:id/excluir', ctrl.excluir);
router.get('/botao', ctrl.formListarBotao)

module.exports = router;
