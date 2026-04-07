/**
 * Decorator Pattern (Middleware)
 * Responsável por verificar permissões do usuário
 * com base em roles.
 */
const autorizacao = (roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Acesso negado' });
    }

    return next();
};

module.exports = autorizacao;