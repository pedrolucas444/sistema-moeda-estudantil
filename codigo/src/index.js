// codigo/src/index.js
const express = require('express');
const cors = require('cors');

const PostgresAdapter = require('./db/PostgresAdapter');

// DAOs
const AlunoDAO = require('./dao/AlunoDAO');
const EmpresaDAO = require('./dao/EmpresaDAO');
const VantagemDAO = require('./dao/VantagemDAO');
const TransacaoDAO = require('./dao/TransacaoDAO');

// Controllers
const AlunoController = require('./controllers/AlunoController');
const EmpresaController = require('./controllers/EmpresaController');
const VantagemController = require('./controllers/VantagemController');
const AuthController = require('./controllers/AuthController');
const TransacaoController = require('./controllers/TransacaoController');

// Rotas
const makeAlunoRouter = require('./routes/alunos');
const makeEmpresaRouter = require('./routes/empresas');
const makeVantagemRouter = require('./routes/vantagens');
const makeAuthRouter = require('./routes/auth');
const makeTransacaoRouter = require('./routes/transacoes');

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
  const transacaoController = new TransacaoController({ transacaoDao, db });

  // 🔹 Registra Rotas
  app.use('/alunos', makeAlunoRouter(alunoController));
  app.use('/empresas', makeEmpresaRouter(empresaController));
  app.use('/vantagens', makeVantagemRouter(vantagemController));
  app.use('/auth', makeAuthRouter(authController));
  app.use('/transacoes', makeTransacaoRouter(transacaoController));

  // Lista de instituições (para popular selects no frontend)
  app.get('/instituicoes', async (req, res) => {
    try {
      const list = await db.findAll('instituicoes')
      res.json(list)
    } catch (err) {
      console.error('Erro ao buscar instituicoes:', err)
      res.status(500).json({ error: 'Erro ao buscar instituições' })
    }
  })

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
