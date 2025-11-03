class EmpresaController {
  constructor(empresaDao) {
    this.empresaDao = empresaDao;
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(req, res) {
    try {
      const empresa = await this.empresaDao.create(req.body);
      return res.status(201).json(empresa);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async findAll(req, res) {
    try {
      const items = await this.empresaDao.findAll(req.query || {});
      return res.json(items);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async findById(req, res) {
    try {
      const item = await this.empresaDao.findById(req.params.id);
      if (!item) return res.status(404).json({ error: 'Empresa não encontrada' });
      return res.json(item);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await this.empresaDao.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Empresa não encontrada' });
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const ok = await this.empresaDao.delete(req.params.id);
      if (!ok) return res.status(404).json({ error: 'Empresa não encontrada' });
      return res.status(204).end();
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = EmpresaController;
