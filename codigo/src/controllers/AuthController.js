const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthController {
  constructor({ empresaDao, alunoDao, jwtSecret }) {
    this.empresaDao = empresaDao;
    this.alunoDao = alunoDao;
    this.jwtSecret = jwtSecret || 'dev-secret';

    this.login = this.login.bind(this);
    this.registerAluno = this.registerAluno.bind(this);
  }

  sign(entity, role) {
    const payload = { id: entity.id, role };
    const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '12h' });
    return token;
  }

  async login(req, res) {
    try {
      const { role } = req.body || {};

      if (role === 'empresa') {
        const { email, senha } = req.body || {};
        if (!email || !senha) {
          return res
            .status(400)
            .json({ error: 'email e senha são obrigatórios' });
        }

        const empresas = await this.empresaDao.findAll({ email });
        const empresa = empresas && empresas[0];
        if (!empresa) {
          return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const hash = empresa.senha_hash || empresa.senhaHash;
        const ok =
          hash && hash.startsWith('$2')
            ? await bcrypt.compare(senha, hash)
            : senha === hash;

        if (!ok) {
          return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = this.sign(empresa, 'empresa');
        return res.json({ token, role: 'empresa', empresa });
      }

 
      if (role === 'aluno') {
        const { email, senha, cpf, rg } = req.body || {};


        if (email && senha) {
          const db = this.empresaDao.db; 
          const usuarios = await db.findAll('usuarios', { email });
          const usuario = usuarios && usuarios[0];

          if (!usuario) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
          }

          const ok =
            usuario.senha_hash && usuario.senha_hash.startsWith('$2')
              ? await bcrypt.compare(senha, usuario.senha_hash)
              : senha === usuario.senha_hash;

          if (!ok) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
          }

  
          const aluno = await this.alunoDao.findById(usuario.id);
          if (!aluno) {
            return res
              .status(403)
              .json({ error: 'Usuário não é um aluno cadastrado' });
          }

          const token = this.sign({ id: usuario.id }, 'aluno');
          return res.json({ token, role: 'aluno', aluno });
        }


        if (cpf && rg) {
          const alunos = await this.alunoDao.findAll({ cpf, rg });
          const aluno = alunos && alunos[0];
          if (!aluno) {
            return res.status(401).json({ error: 'Aluno não encontrado' });
          }

          const token = this.sign(aluno, 'aluno');
          return res.json({ token, role: 'aluno', aluno });
        }

        return res
          .status(400)
          .json({ error: 'Informe email/senha ou cpf/rg' });
      }

      return res
        .status(400)
        .json({ error: 'role inválida. Use "aluno" ou "empresa"' });
    } catch (err) {
      console.error('Erro no login:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  async registerAluno(req, res) {
    try {
      const {
        nome,
        cpf,
        rg,
        endereco,
        curso,
        email,
        senha,
        instituicao_id
      } = req.body || {};


      if (
        !nome ||
        !cpf ||
        !rg ||
        !endereco ||
        !curso ||
        !email ||
        !senha ||
        !instituicao_id
      ) {
        return res
          .status(400)
          .json({ error: 'Campos obrigatórios ausentes' });
      }

      const db = this.empresaDao.db;


      const jaExiste = await db.findAll('usuarios', { email });
      if (jaExiste && jaExiste[0]) {
        return res.status(409).json({ error: 'Email já cadastrado' });
      }


    const instituicao = await db.findById('instituicao', instituicao_id);
    if (!instituicao) {
      return res.status(400).json({ error: 'Instituição inválida' });
    }

  


      const senha_hash = await bcrypt.hash(senha, 10);


      const usuario = await db.insert('usuarios', {
        email,
        senha_hash,
        ativo: true,
        saldo: 0
      });

      const aluno = await db.insert('alunos', {
        id: usuario.id,
        nome,
        cpf,
        rg,
        endereco,
        curso,
        email,
        senha_hash,
        instituicao_id
      });

      const token = this.sign({ id: usuario.id }, 'aluno');

      return res.status(201).json({
        token,
        role: 'aluno',
        aluno
      });
    } catch (err) {
      console.error('Erro no registerAluno:', err);
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = AuthController;
