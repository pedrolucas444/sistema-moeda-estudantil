class VantagemDAO {
  constructor(db) {
    this.db = db;
  }

  async create(vantagem) {
    throw new Error('VantagemDAO.create não implementado');
  }

  async findById(id) {
    throw new Error('VantagemDAO.findById não implementado');
  }

  async findAll(filter) {
    throw new Error('VantagemDAO.findAll não implementado');
  }

  async update(id, updates) {
    throw new Error('VantagemDAO.update não implementado');
  }

  async delete(id) {
    throw new Error('VantagemDAO.delete não implementado');
  }
}

module.exports = VantagemDAO;
