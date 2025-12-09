/**
 * Valida se um valor é um inteiro positivo
 * 
 * @param {any} value - Valor a ser validado
 * @param {string} fieldName - Nome do campo para mensagem de erro
 * @returns {{ valid: boolean, value?: number, error?: string }}
 */
function validatePositiveInteger(value, fieldName = 'valor') {
  if (value == null || value === '') {
    return { valid: false, error: `${fieldName} é obrigatório` };
  }

  const intValue = parseInt(value, 10);
  
  if (!Number.isInteger(intValue)) {
    return { valid: false, error: `${fieldName} deve ser um número inteiro` };
  }

  if (intValue <= 0) {
    return { valid: false, error: `${fieldName} deve ser um inteiro positivo` };
  }

  return { valid: true, value: intValue };
}

/**
 * Valida campos obrigatórios
 * 
 * @param {Object} data - Objeto com os dados
 * @param {string[]} requiredFields - Array com nomes dos campos obrigatórios
 * @returns {{ valid: boolean, error?: string }}
 */
function validateRequiredFields(data, requiredFields) {
  const missing = requiredFields.filter(field => 
    data[field] == null || data[field] === ''
  );

  if (missing.length > 0) {
    return {
      valid: false,
      error: `Campos obrigatórios ausentes: ${missing.join(', ')}`
    };
  }

  return { valid: true };
}

/**
 * Valida se um UUID é válido
 * 
 * @param {string} uuid - UUID a ser validado
 * @returns {boolean}
 */
function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

module.exports = {
  validatePositiveInteger,
  validateRequiredFields,
  isValidUUID
};

