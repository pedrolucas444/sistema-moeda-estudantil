const { randomUUID } = require('crypto');

class EmpresaDAO {
  constructor(db) {
    this.db = db;
    this.collection = 'empresas';
  }

  async create(empresa) {
    const id = empresa.id || randomUUID();
    const now = new Date().toISOString();
    const record = Object.assign({
      id,
      nome: null,
      cnpj: null,
      emailComercial: null,
      endereco: null,
      ativa: true,
      createdAt: now
    }, empresa);

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
    return this.db.update(this.collection, id, updates);
  }

  async delete(id) {
    return this.db.delete(this.collection, id);
  }
}

module.exports = EmpresaDAO;
