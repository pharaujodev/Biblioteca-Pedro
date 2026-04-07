const jwt = require('jsonwebtoken');

const autorizacao = (roles) => (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token não enviado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        if (!req.user) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acesso negado' });
        }

        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
};

module.exports = autorizacao;
