/**
 * Classe de erro da aplicação.
 * Centraliza erros de regra de negócio com mensagem e código HTTP,
 * evitando criar objetos de erro diferentes em vários services.
 *
 * Relação com SOLID:
 * - SRP: responsável apenas por representar erros da aplicação.
 */

class AppError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
}

module.exports = AppError;