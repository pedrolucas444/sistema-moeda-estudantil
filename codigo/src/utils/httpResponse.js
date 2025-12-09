/**
 * Retorna resposta de erro padronizada
 * 
 * @param {Object} res - Objeto response do Express
 * @param {number} statusCode - Código HTTP de status
 * @param {string} message - Mensagem de erro
 * @returns {Object} Resposta HTTP
 */
function errorResponse(res, statusCode, message) {
  return res.status(statusCode).json({ error: message });
}

/**
 * Retorna resposta de sucesso padronizada
 * 
 * @param {Object} res - Objeto response do Express
 * @param {number} statusCode - Código HTTP de status (padrão: 200)
 * @param {Object} data - Dados a serem retornados
 * @returns {Object} Resposta HTTP
 */
function successResponse(res, statusCode = 200, data = {}) {
  return res.status(statusCode).json(data);
}

/**
 * Wrapper para tratamento de erros em controllers
 * 
 * @param {Function} handler - Função assíncrona do controller
 * @returns {Function} Função wrapper com tratamento de erro
 */
function asyncHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      console.error('Erro no controller:', error);
      
      // Erro de validação do banco (ex: constraint violation)
      if (error.code === '23505') {
        return errorResponse(res, 409, 'Violação de unicidade: registro já existe');
      }
      
      // Erro de saldo insuficiente (trigger do banco)
      if (error.message && error.message.includes('Saldo insuficiente')) {
        return errorResponse(res, 400, error.message);
      }

      // Erro genérico
      return errorResponse(res, 500, 'Erro interno do servidor');
    }
  };
}

module.exports = {
  errorResponse,
  successResponse,
  asyncHandler
};

