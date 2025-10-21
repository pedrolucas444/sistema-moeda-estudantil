class EmpresaDAO {
  constructor(db) {
    this.db = db;
  }

  async create(empresa) {
    throw new Error('EmpresaDAO.create não implementado');
  }

  async findById(id) {
    throw new Error('EmpresaDAO.findById não implementado');
  }

  async findAll(filter) {
    throw new Error('EmpresaDAO.findAll não implementado');
  }

  async update(id, updates) {
    throw new Error('EmpresaDAO.update não implementado');
  }

  async delete(id) {
    throw new Error('EmpresaDAO.delete não implementado');
  }
}

module.exports = EmpresaDAO;
