const express = require('express');
const router = express.Router();
const controller = require('../controllers/livroController');
const auth = require('../middlewares/auth');
const autorizacao = require('../middlewares/autorizacao');

router.post('/', auth, autorizacao(['admin']), controller.criarLivro);
router.get('/', controller.listarLivro);
router.delete('/:id', auth, autorizacao(['admin']), controller.deletarLivro);
router.put('/:id', auth, autorizacao(['admin']), controller.atualizarLivro);
router.get('/:id', controller.buscarLivroPorId);
router.patch('/:id', auth, controller.atualizarLivroQuantidade);

module.exports = router;