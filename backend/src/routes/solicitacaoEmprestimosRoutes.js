const express = require('express');
const router = express.Router();
const controller = require('../controllers/solicitacaoEmprestimoController');
const auth = require('../middlewares/auth');
const autorizacao = require('../middlewares/autorizacao');

router.post('/', auth, controller.criarSolicitacaoEmprestimo);
router.get('/cliente', auth, controller.listarSolicitacaoEmprestimoCliente);
router.get('/', auth, autorizacao(['admin']), controller.listarSolicitacaoEmprestimo);
router.delete('/:id', auth, autorizacao(['admin']), controller.deletarSolicitacaoEmprestimo);
router.patch('/:id', auth, autorizacao(['admin']), controller.atualizarSolicitacaoEmprestimo);

module.exports = router;