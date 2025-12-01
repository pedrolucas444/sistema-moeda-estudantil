// codigo/src/dao/ResgateDAO.js
class ResgateDAO {
    constructor(db) {
      this.db = db;
      this.collection = 'resgates'; // mapeado para tabela 'resgate' no PostgresAdapter
    }
  
    async create(data) {
      const {
        id,
        aluno_id,
        vantagem_id,
        codigo,
        status,
        solicitado_em,
        consumido_em
      } = data || {};
  
      const record = {
        id,
        aluno_id,
        vantagem_id,
        codigo,
        status,
        solicitado_em: solicitado_em || new Date(),
        consumido_em: consumido_em || null
      };
  
      return this.db.insert(this.collection, record);
    }
  
    async findByAluno(alunoId) {
      return this.db.findAll(this.collection, { aluno_id: alunoId });
    }
  }
  
  module.exports = ResgateDAO;
  