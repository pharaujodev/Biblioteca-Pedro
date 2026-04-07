const authService = require('../services/authService');

exports.login = async (req, res, next) => {
    try {
        const { email, senha } = req.body;
        const result = await authService.login(email, senha);
        res.status(200).json(result);   
    } catch (error) {
        next(error);
    }
}