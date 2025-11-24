const express = require('express');

module.exports = function makeTransacaoRouter(controller) {
  const router = express.Router();

  router.post('/enviar', controller.enviarMoedas);

  router.post('/resgatar', controller.resgatarVantagem);

  router.get('/extrato/:usuarioId', controller.extrato);

  return router;
};
