const { randomUUID } = require('crypto');

class VantagemDAO {
  constructor(db) {
    this.db = db;
    this.collection = 'vantagens';
  }

  async create(vantagem) {
    if (!vantagem.empresa_id) {
      throw new Error('empresa_id é obrigatório para cadastrar uma vantagem');
    }
    if (!vantagem.titulo) {
      throw new Error('titulo é obrigatório para cadastrar uma vantagem');
    }
    if (!vantagem.custo_moedas) {
      throw new Error('custo_moedas é obrigatório para cadastrar uma vantagem');
    }

    const id = vantagem.id || randomUUID();
    const now = new Date().toISOString();

    const record = {
      id,
      empresa_id: vantagem.empresa_id,
      titulo: vantagem.titulo,
      descricao: vantagem.descricao || null,
      custo_moedas: parseInt(vantagem.custo_moedas, 10),
      foto_url: vantagem.foto_url || null,
      ativa: vantagem.ativa !== undefined ? vantagem.ativa : true,
      criado_em: vantagem.criado_em || now
    };

    const inserted = await this.db.insert(this.collection, record);
    return inserted;
  }

  async findById(id) {
    return this.db.findById(this.collection, id);
  }

  async findAll(filter = {}) {
    const mappedFilter = {};

    if (filter.empresa_id) {
      mappedFilter.empresa_id = filter.empresa_id;
    }

    if (filter.ativa !== undefined) {
      if (typeof filter.ativa === 'string') {
        mappedFilter.ativa = filter.ativa === 'true';
      } else {
        mappedFilter.ativa = !!filter.ativa;
      }
    }

    return this.db.findAll(this.collection, mappedFilter);
  }

  async update(id, updates) {
    const mapped = {};

    if (updates.titulo !== undefined) mapped.titulo = updates.titulo;
    if (updates.descricao !== undefined) mapped.descricao = updates.descricao;
    if (updates.custo_moedas !== undefined) {
      mapped.custo_moedas = parseInt(updates.custo_moedas, 10);
    }
    if (updates.foto_url !== undefined) mapped.foto_url = updates.foto_url;
    if (updates.ativa !== undefined) mapped.ativa = updates.ativa;
    if (updates.empresa_id !== undefined) mapped.empresa_id = updates.empresa_id;

    return this.db.update(this.collection, id, mapped);
  }

  async delete(id) {
    return this.db.delete(this.collection, id);
  }
}

module.exports = VantagemDAO;
