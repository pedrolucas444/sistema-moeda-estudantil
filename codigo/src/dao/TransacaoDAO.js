class TransacaoDAO {
  constructor(db) {
    this.db = db;
    this.collection = 'transacoes'; 
  }


  async create(transacao) {
    const { usuario_id, valor, descricao } = transacao || {};

    if (!usuario_id) {
      throw new Error('usuario_id é obrigatório para criar uma transação');
    }

    const valorInt = parseInt(valor, 10);
    if (!Number.isInteger(valorInt) || valorInt === 0) {
      throw new Error('valor deve ser um inteiro diferente de zero');
    }

    const agora = new Date();

    const record = {
      usuario_id,
      valor: valorInt,
      descricao: descricao || null,
      criada_em: agora
    };

    const inserted = await this.db.insert(this.collection, record);
    return inserted;
  }

  async findById(id) {
    return this.db.findById(this.collection, id);
  }

  async findByUsuarioId(usuarioId) {
    return this.db.findAll(this.collection, { usuario_id: usuarioId });
  }

  async findAll(filter = {}) {
    return this.db.findAll(this.collection, filter);
  }
}

module.exports = TransacaoDAO;
