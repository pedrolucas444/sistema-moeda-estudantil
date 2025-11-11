const express = require('express');

module.exports = function makeAuthRouter(controller) {
  const router = express.Router();

  router.post('/login', controller.login);
  router.post('/register/aluno', controller.registerAluno);

  return router;
};
