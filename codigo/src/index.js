const express = require('express');
const bodyParser = require('express').json;
const PostgresAdapter = require('./db/PostgresAdapter');
const AlunoDAO = require('./dao/AlunoDAO');
const EmpresaDAO = require('./dao/EmpresaDAO');
const AlunoController = require('./controllers/AlunoController');
const EmpresaController = require('./controllers/EmpresaController');
const makeAlunoRouter = require('./routes/alunos');
const makeEmpresaRouter = require('./routes/empresas');
const VantagemDAO = require('./dao/VantagemDAO');
const VantagemController = require('./controllers/VantagemController');
const makeVantagemRouter = require('./routes/vantagens');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser());

async function start() {
	// configure connection via env or default
	const connectionString = process.env.DATABASE_URL || 'postgres://postgres:root@localhost:5432/meritcoins';
	const db = new PostgresAdapter({ connectionString });

	// DAOs
	const alunoDao = new AlunoDAO(db);
	const empresaDao = new EmpresaDAO(db);
	const vantagemDao = new VantagemDAO(db);
	
	
	// Controllers
	const alunoController = new AlunoController(alunoDao);
	const empresaController = new EmpresaController(empresaDao);
	const vantagemController = new VantagemController(vantagemDao);

	// Routes (controllers injected) - MVC
	app.use('/alunos', makeAlunoRouter(alunoController));
	app.use('/empresas', makeEmpresaRouter(empresaController));
	app.use('/vantagens', makeVantagemRouter(vantagemController));

	app.get('/', (req, res) => res.json({ ok: true, now: new Date().toISOString() }));

	app.listen(PORT, () => {
		console.log(`Servidor rodando em http://localhost:${PORT}`);
	});
}

start().catch(err => {
	console.error('Falha ao iniciar o servidor:', err.message);
	process.exit(1);
});
