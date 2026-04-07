require('dotenv').config();
const express = require('express');
const cors = require('cors');

const usuarioRoutes = require('./src/routes/usuarioRoutes');
const livroRoutes = require('./src/routes/livroRoutes');
const emprestimoRoutes = require('./src/routes/emprestimosRoutes');
const authRoutes = require('./src/routes/authRoutes');
const solicitacaoEmprestimosRoutes = require('./src/routes/solicitacaoEmprestimosRoutes');
const errorHandler = require('./src/middlewares/error');

const app = express();

app.use(express.static('/frontend'));
app.use(express.json());
app.use(cors());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/livros', livroRoutes);
app.use('/api/emprestimos', emprestimoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/solicitacao-emprestimos', solicitacaoEmprestimosRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use((req, res) => {
    res.status(404).json({ error: `Rota ${req.method} ${req.path} não encontrada` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});