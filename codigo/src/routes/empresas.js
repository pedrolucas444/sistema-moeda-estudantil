const express = require('express');

module.exports = function makeEmpresaRouter(empresaDao) {
  const router = express.Router();

  router.post('/', async (req, res) => {
    try {
      const empresa = await empresaDao.create(req.body);
      return res.status(201).json(empresa);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const items = await empresaDao.findAll(req.query || {});
      return res.json(items);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const item = await empresaDao.findById(req.params.id);
      if (!item) return res.status(404).json({ error: 'Empresa não encontrada' });
      return res.json(item);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const updated = await empresaDao.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Empresa não encontrada' });
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const ok = await empresaDao.delete(req.params.id);
      if (!ok) return res.status(404).json({ error: 'Empresa não encontrada' });
      return res.status(204).end();
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  return router;
};
