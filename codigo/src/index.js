const express = require("express");
const bodyParser = require("express").json;
const cors = require("cors");
const PostgresAdapter = require("./db/PostgresAdapter");
const AlunoDAO = require("./dao/AlunoDAO");
const EmpresaDAO = require("./dao/EmpresaDAO");
const AlunoController = require("./controllers/AlunoController");
const EmpresaController = require("./controllers/EmpresaController");
const makeAlunoRouter = require("./routes/alunos");
const makeEmpresaRouter = require("./routes/empresas");
const VantagemDAO = require("./dao/VantagemDAO");
const VantagemController = require("./controllers/VantagemController");
const makeVantagemRouter = require("./routes/vantagens");
const AuthController = require("./controllers/AuthController");
const makeAuthRouter = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser());

async function start() {
  const connectionString =
    process.env.DATABASE_URL ||
    "postgres://postgres:root@localhost:5432/meritcoins";
  const db = new PostgresAdapter({ connectionString });

  const alunoDao = new AlunoDAO(db);
  const empresaDao = new EmpresaDAO(db);
  const vantagemDao = new VantagemDAO(db);

  const alunoController = new AlunoController(alunoDao);
  const empresaController = new EmpresaController(empresaDao);
  const vantagemController = new VantagemController(vantagemDao);
  const authController = new AuthController({ empresaDao, alunoDao, jwtSecret: process.env.JWT_SECRET });

  app.use("/alunos", makeAlunoRouter(alunoController));
  app.use("/empresas", makeEmpresaRouter(empresaController));
  app.use("/vantagens", makeVantagemRouter(vantagemController));
  app.use("/auth", makeAuthRouter(authController));

  app.get("/", (req, res) =>
    res.json({ ok: true, now: new Date().toISOString() })
  );

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Falha ao iniciar o servidor:", err.message);
  process.exit(1);
});
