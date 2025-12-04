const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const ctrl = require('../controllers/backupController');

router.get('/baixar', ctrl.download);
router.post('/restaurar', upload.single('arquivo'), ctrl.restaurar);

module.exports = router;
