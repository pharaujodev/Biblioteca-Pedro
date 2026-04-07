const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController');
const auth = require('../middlewares/auth');
const autorizacao = require('../middlewares/autorizacao');

router.post('/', controller.criarUsuario);
router.get('/', auth, autorizacao(['admin']), controller.listarUsuario);
router.delete('/:id', auth, autorizacao(['admin']), controller.deletarUsuario);
router.put('/:id', auth, autorizacao(['admin']), controller.atualizarUsuario);
router.get('/:id', auth, autorizacao(['admin']), controller.buscarUsuarioPorId);

module.exports = router;