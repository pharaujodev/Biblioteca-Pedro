/**
 * Decorator Pattern (Middleware)
 * Adiciona comportamento de autenticação às rotas
 * sem modificar os controllers.
 */

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Token de autenticação inválido ou expirado' });
    }
};

module.exports = authMiddleware;