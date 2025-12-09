/**
 * Busca uma entidade e retorna erro 404 se não encontrada
 * 
 * @param {Object} db - Instância do PostgresAdapter
 * @param {string} collection - Nome da coleção
 * @param {string} id - ID da entidade
 * @param {string} entityName - Nome da entidade para mensagem de erro
 * @returns {Promise<Object>} Entidade encontrada
 * @throws {Error} Se entidade não encontrada
 */
async function findEntityOrFail(db, collection, id, entityName) {
  const entity = await db.findById(collection, id);
  
  if (!entity) {
    throw new Error(`${entityName} não encontrado(a)`);
  }
  
  return entity;
}

/**
 * Normaliza saldo para número inteiro
 * 
 * @param {any} saldo - Valor do saldo
 * @returns {number} Saldo como inteiro
 */
function normalizeSaldo(saldo) {
  return typeof saldo === 'number' 
    ? saldo 
    : parseInt(saldo || 0, 10);
}

/**
 * Valida se saldo é suficiente para uma operação
 * 
 * @param {number} saldoAtual - Saldo atual
 * @param {number} valor - Valor a ser debitado
 * @throws {Error} Se saldo insuficiente
 */
function validateSaldoSuficiente(saldoAtual, valor) {
  if (saldoAtual < valor) {
    throw new Error('Saldo insuficiente');
  }
}

module.exports = {
  findEntityOrFail,
  normalizeSaldo,
  validateSaldoSuficiente
};

