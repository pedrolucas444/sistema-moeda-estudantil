const express = require('express');

module.exports = function makeResgateRouter(controller) {
  const router = express.Router();
  router.post('/', controller.resgatar);
  router.get('/aluno/:alunoId', controller.listarPorAluno);

  return router;
};
