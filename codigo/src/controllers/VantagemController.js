class VantagemController {
    constructor(vantagemDao) {
      this.vantagemDao = vantagemDao;
  
      this.create = this.create.bind(this);
      this.findAll = this.findAll.bind(this);
      this.findById = this.findById.bind(this);
      this.update = this.update.bind(this);
      this.delete = this.delete.bind(this);
    }
  
    async create(req, res) {
      try {
        const { empresa_id, titulo, descricao, custo_moedas, foto_url, ativa } = req.body;
  
        if (!empresa_id || !titulo || !custo_moedas) {
          return res.status(400).json({
            error: 'empresa_id, titulo e custo_moedas são obrigatórios'
          });
        }
  
        const vantagem = await this.vantagemDao.create({
          empresa_id,
          titulo,
          descricao,
          custo_moedas,
          foto_url,
          ativa
        });
  
        return res.status(201).json(vantagem);
      } catch (err) {
        console.error('Erro ao criar vantagem:', err);
        return res.status(500).json({ error: err.message });
      }
    }
  
    async findAll(req, res) {
      try {
        const filter = req.query || {};
        const vantagens = await this.vantagemDao.findAll(filter);
        return res.json(vantagens);
      } catch (err) {
        console.error('Erro ao listar vantagens:', err);
        return res.status(500).json({ error: err.message });
      }
    }
  
    async findById(req, res) {
      try {
        const vantagem = await this.vantagemDao.findById(req.params.id);
        if (!vantagem) {
          return res.status(404).json({ error: 'Vantagem não encontrada' });
        }
        return res.json(vantagem);
      } catch (err) {
        console.error('Erro ao buscar vantagem por id:', err);
        return res.status(500).json({ error: err.message });
      }
    }
  
    async update(req, res) {
      try {
        const updated = await this.vantagemDao.update(req.params.id, req.body);
        return res.json(updated);
      } catch (err) {
        console.error('Erro ao atualizar vantagem:', err);
        return res.status(500).json({ error: err.message });
      }
    }
  
    async delete(req, res) {
      try {
        await this.vantagemDao.delete(req.params.id);
        return res.status(204).send();
      } catch (err) {
        console.error('Erro ao deletar vantagem:', err);
        return res.status(500).json({ error: err.message });
      }
    }
  }
  
  module.exports = VantagemController;
  