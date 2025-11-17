class AlunoDAO {
  constructor(db) {
    this.db = db;
    this.collection = 'alunos';
  }

 
  async create(data) {
    const {
      id,
      nome,
      cpf,
      rg,
      endereco,
      curso,
      email,
      senha_hash
    } = data || {};

    if (!nome || !cpf || !rg || !endereco || !curso) {
      throw new Error('Campos obrigatórios de aluno ausentes');
    }

    
    const record = {
      id,
      nome,
      cpf,
      rg,
      endereco,
      curso,
      email,
      senha_hash
    };

    return this.db.insert(this.collection, record);
  }

  async findAll(filter = {}) {
    return this.db.findAll(this.collection, filter);
  }

  async findById(id) {
    return this.db.findById(this.collection, id);
  }

  async update(id, updates = {}) {
    
    const allowedFields = [
      'nome',
      'cpf',
      'rg',
      'endereco',
      'curso',
      'email',
      'senha_hash'
    ];

    const payload = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        payload[key] = updates[key];
      }
    }

    return this.db.update(this.collection, id, payload);
  }

  async delete(id) {
    return this.db.delete(this.collection, id);
  }
}

module.exports = AlunoDAO;
