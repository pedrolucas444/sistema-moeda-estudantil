const express = require('express');

module.exports = function makeAlunoRouter(alunoDao) {
  const router = express.Router();

  router.post('/', async (req, res) => {
    try {
      const aluno = await alunoDao.create(req.body);
      return res.status(201).json(aluno);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const items = await alunoDao.findAll(req.query || {});
      return res.json(items);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const item = await alunoDao.findById(req.params.id);
      if (!item) return res.status(404).json({ error: 'Aluno não encontrado' });
      return res.json(item);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const updated = await alunoDao.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Aluno não encontrado' });
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const ok = await alunoDao.delete(req.params.id);
      if (!ok) return res.status(404).json({ error: 'Aluno não encontrado' });
      return res.status(204).end();
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  return router;
};
