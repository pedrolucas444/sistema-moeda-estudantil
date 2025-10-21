class TransacaoDAO {
  constructor(db) {
    this.db = db;
  }

  async create(transacao) {
    throw new Error('TransacaoDAO.create não implementado');
  }

  async findById(id) {
    throw new Error('TransacaoDAO.findById não implementado');
  }

  async findByUsuarioId(usuarioId) {
    throw new Error('TransacaoDAO.findByUsuarioId não implementado');
  }

  async findAll(filter) {
    throw new Error('TransacaoDAO.findAll não implementado');
  }
}

module.exports = TransacaoDAO;
