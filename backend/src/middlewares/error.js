/**
 * Centralização de erros da aplicação
 * Utiliza Factory Method (ApiResponse) para padronizar respostas de erro.
 */

const ApiResponse = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const status = err.status || 500;
    const message = err.message || 'Erro interno do servidor';

    return res.status(status).json(
        ApiResponse.error(message)
    );
};

module.exports = errorHandler;