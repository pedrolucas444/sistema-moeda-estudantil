class AlunoDAO {
  constructor(db) {
    this.db = db; 
  }

  async create(aluno) {
    throw new Error('AlunoDAO.create não implementado');
  }

  async findById(id) {
    throw new Error('AlunoDAO.findById não implementado');
  }

  async findAll(filter) {
    throw new Error('AlunoDAO.findAll não implementado');
  }

  async update(id, updates) {
    throw new Error('AlunoDAO.update não implementado');
  }

  async delete(id) {
    throw new Error('AlunoDAO.delete não implementado');
  }
}

module.exports = AlunoDAO;
