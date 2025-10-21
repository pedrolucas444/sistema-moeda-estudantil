class ProfessorDAO {
  constructor(db) {
    this.db = db;
  }

  async create(professor) {
    throw new Error('ProfessorDAO.create não implementado');
  }

  async findById(id) {
    throw new Error('ProfessorDAO.findById não implementado');
  }

  async findAll(filter) {
    throw new Error('ProfessorDAO.findAll não implementado');
  }

  async update(id, updates) {
    throw new Error('ProfessorDAO.update não implementado');
  }

  async delete(id) {
    throw new Error('ProfessorDAO.delete não implementado');
  }
}

module.exports = ProfessorDAO;
