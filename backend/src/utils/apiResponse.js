/**
 * Factory Method Pattern
 * Responsável por criar respostas padronizadas da API.
 * Centraliza a estrutura de erros, evitando duplicação.
 */

/**
 * Relação com OCP (Open/Closed Principle):
 * Esta classe está aberta para extensão, pois novos formatos de resposta
 * podem ser adicionados com novos métodos estáticos, sem modificar os
 * controllers já existentes.
 *
 * Exemplo de extensão futura:
 * - validationError()
 * - notFound()
 * - unauthorized()
 */

class ApiResponse {
    static success(data) {
        return data;
    }

    static error(message, details = null) {
        return {
            success: false,
            message,
            details
        };
    }
}

module.exports = ApiResponse;