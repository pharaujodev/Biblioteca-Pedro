const express = require('express');
const router = express.Router();
const controller = require('../controllers/emprestimoController.js');
const auth = require('../middlewares/auth');
const autorizacao = require('../middlewares/autorizacao');

router.post('/', auth, autorizacao(['admin']), controller.criarEmprestimo);
router.get('/', auth, autorizacao(['admin']), controller.listarEmprestimo);
router.get('/cliente', auth, controller.listarEmprestimoCliente);
router.delete('/:id', auth, autorizacao(['admin']), controller.deletarEmprestimo);
router.put('/:id', auth, autorizacao(['admin']), controller.atualizarEmprestimo);
router.get('/:id', auth, autorizacao(['admin']), controller.buscarEmprestimoPorId);
router.put('/:id/devolver', auth, autorizacao(['admin']), controller.devolverEmprestimo);
router.patch('/:id', auth, autorizacao(['admin']), controller.atualizarStatusEmprestimo);



module.exports = router;