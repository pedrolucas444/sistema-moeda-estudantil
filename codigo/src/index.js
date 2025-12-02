// codigo/src/index.js
// carrega variáveis de ambiente do arquivo .env (se existir)
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const PostgresAdapter = require('./db/PostgresAdapter');

// Services
const EmailService = require('./services/EmailService');

// DAOs
const AlunoDAO = require('./dao/AlunoDAO');
const EmpresaDAO = require('./dao/EmpresaDAO');
const VantagemDAO = require('./dao/VantagemDAO');
const TransacaoDAO = require('./dao/TransacaoDAO');
const ResgateDAO = require('./dao/ResgateDAO');

// Controllers
const AlunoController = require('./controllers/AlunoController');
const EmpresaController = require('./controllers/EmpresaController');
const VantagemController = require('./controllers/VantagemController');
const AuthController = require('./controllers/AuthController');
const TransacaoController = require('./controllers/TransacaoController');
const ResgateController = require('./controllers/ResgateController');

// Rotas
const makeAlunoRouter = require('./routes/alunos');
const makeEmpresaRouter = require('./routes/empresas');
const makeVantagemRouter = require('./routes/vantagens');
const makeAuthRouter = require('./routes/auth');
const makeTransacaoRouter = require('./routes/transacoes');
const makeResgateRouter = require('./routes/resgates');

async function start() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  // 🔹 Conexão com o banco
  const db = new PostgresAdapter({
    connectionString:
      process.env.DATABASE_URL ||
      'postgres://postgres:root@localhost:5432/meritcoins'
  });

  // 🔹 Instancia DAOs
  const alunoDao = new AlunoDAO(db);
  const empresaDao = new EmpresaDAO(db);
  const professorDao = new (require('./dao/ProfessorDAO'))(db);
  const vantagemDao = new VantagemDAO(db);
  const transacaoDao = new TransacaoDAO(db);
  const resgateDao = new ResgateDAO(db);

  // 🔹 Serviço de e-mail (usado no envio de cupons)
  const emailService = new EmailService();
  console.log(`EmailService mock mode: ${emailService.mock}`);

  // 🔹 Instancia Controllers
  const alunoController = new AlunoController(alunoDao);
  const empresaController = new EmpresaController(empresaDao);
  const vantagemController = new VantagemController(vantagemDao);
  const authController = new AuthController({
    empresaDao,
    alunoDao,
    professorDao,
    jwtSecret: process.env.JWT_SECRET || 'dev-secret'
  });
  const transacaoController = new TransacaoController({ transacaoDao, db, emailService });
  const resgateController = new ResgateController({
    db,
    resgateDao,
    transacaoDao,
    alunoDao,
    vantagemDao,
    empresaDao,
    emailService
  });

  // 🔹 Registra Rotas
  app.use('/alunos', makeAlunoRouter(alunoController));
  app.use('/empresas', makeEmpresaRouter(empresaController));
  app.use('/vantagens', makeVantagemRouter(vantagemController));
  app.use('/auth', makeAuthRouter(authController));
  app.use('/transacoes', makeTransacaoRouter(transacaoController));
  app.use('/resgates', makeResgateRouter(resgateController));

  // Endpoint de desenvolvimento para inspecionar emails mock
  if (process.env.NODE_ENV !== 'production') {
    app.get('/dev/emails', (req, res) => {
      try {
        return res.json(emailService._mockedEmails || []);
      } catch (err) {
        console.error('Erro ao acessar emails mock:', err);
        return res.status(500).json({ error: 'Erro ao acessar emails mock' });
      }
    });

    app.delete('/dev/emails', (req, res) => {
      try {
        emailService._mockedEmails = [];
        return res.json({ ok: true });
      } catch (err) {
        console.error('Erro ao limpar emails mock:', err);
        return res.status(500).json({ error: 'Erro ao limpar emails mock' });
      }
    });
  }

  // Lista de instituições (para popular selects no frontend)
  app.get('/instituicoes', async (req, res) => {
    try {
      const list = await db.findAll('instituicoes');
      res.json(list);
    } catch (err) {
      console.error('Erro ao buscar instituicoes:', err);
      res.status(500).json({ error: 'Erro ao buscar instituições' });
    }
  });

  // Rota básica pra testar se o servidor subiu
  app.get('/', (req, res) => {
    res.json({ ok: true, now: new Date().toISOString() });
  });

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Erro ao iniciar o servidor:', err);
  process.exit(1);
});
