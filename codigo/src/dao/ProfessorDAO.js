class ProfessorDAO {
  constructor(db) {
    this.db = db;
  }
  async create(data) {
    const { id, nome, cpf, instituicao_id, email, senha_hash } = data || {};

    if (!nome || !cpf || !instituicao_id) {
      throw new Error('Campos obrigatórios de professor ausentes');
    }

    const record = { id, nome, cpf, instituicao_id, email, senha_hash };
    return this.db.insert(this.collectionName(), record);
  }

  collectionName() {
    // Use singular table name 'professor' which matches DB schema
    return 'professor';
  }

  async findAll(filter = {}) {
    return this.db.findAll(this.collectionName(), filter);
  }

  async findById(id) {
    return this.db.findById(this.collectionName(), id);
  }

  async update(id, updates = {}) {
    const allowedFields = ['nome', 'cpf', 'instituicao_id', 'email', 'senha_hash'];
    const payload = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        payload[key] = updates[key];
      }
    }
    return this.db.update(this.collectionName(), id, payload);
  }

  async delete(id) {
    return this.db.delete(this.collectionName(), id);
  }
}

module.exports = ProfessorDAO;
