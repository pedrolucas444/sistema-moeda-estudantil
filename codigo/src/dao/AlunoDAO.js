const { randomUUID } = require('crypto');

class AlunoDAO {
  constructor(db) {
    this.db = db; // espera um objeto com métodos: insert, findById, findAll, update, delete
    this.collection = 'alunos';
  }

  async create(aluno) {
    const id = aluno.id || randomUUID();
    const now = new Date().toISOString();
    const record = Object.assign({
      id,
      nome: null,
      cpf: null,
      rg: null,
      endereco: null,
      curso: null,
      createdAt: now
    }, aluno);

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
    const updated = await this.db.update(this.collection, id, updates);
    return updated;
  }

  async delete(id) {
    return this.db.delete(this.collection, id);
  }
}

module.exports = AlunoDAO;
