const { randomUUID } = require('crypto');

class EmpresaDAO {
  constructor(db) {
    this.db = db;
    this.collection = 'empresas';
  }

  async create(empresa) {
    const id = empresa.id || randomUUID();
    const now = new Date().toISOString();

    // Map incoming DTO keys to DB column names used in schema.sql
    const record = {
      id,
      nome: empresa.nome || null,
      cnpj: empresa.cnpj || null,
      ativa: empresa.ativa !== undefined ? empresa.ativa : true,
      // schema uses `email`, not `emailComercial`
      email: empresa.emailComercial || empresa.email || null,
      // schema uses `senha_hash`
      senha_hash: empresa.senha_hash || empresa.senhaHash || null,
      criado_em: empresa.criado_em || now
    };

    // Only include columns that the table actually has (PostgresAdapter will fail otherwise)
    await this.db.insert(this.collection, record);
    return record;
  }

  async findById(id) {
    return this.db.findById(this.collection, id);
  }

  async findAll(filter = {}) {
    return this.db.findAll(this.collection, filter);
  }

  async update(id, updates) {
    // Map update keys from DTO -> DB column names
    const mapped = {};
    if (updates.nome !== undefined) mapped.nome = updates.nome;
    if (updates.cnpj !== undefined) mapped.cnpj = updates.cnpj;
    if (updates.ativa !== undefined) mapped.ativa = updates.ativa;
    if (updates.emailComercial !== undefined) mapped.email = updates.emailComercial;
    if (updates.email !== undefined) mapped.email = updates.email;
    if (updates.senha_hash !== undefined) mapped.senha_hash = updates.senha_hash;
    if (updates.senhaHash !== undefined) mapped.senha_hash = updates.senhaHash;

    return this.db.update(this.collection, id, mapped);
  }

  async delete(id) {
    return this.db.delete(this.collection, id);
  }
}

module.exports = EmpresaDAO;
