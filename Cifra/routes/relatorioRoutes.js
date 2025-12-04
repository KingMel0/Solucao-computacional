const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/relatorioController');

router.get('/', ctrl.form);
router.post('/exportar', ctrl.exportar);

module.exports = router;
