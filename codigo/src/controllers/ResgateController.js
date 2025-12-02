// codigo/src/controllers/ResgateController.js
const { randomUUID } = require('crypto');

class ResgateController {
  constructor({
    db,
    resgateDao,
    transacaoDao,
    alunoDao,
    vantagemDao,
    empresaDao,
    emailService
  }) {
    this.db = db;
    this.resgateDao = resgateDao;
    this.transacaoDao = transacaoDao;
    this.alunoDao = alunoDao;
    this.vantagemDao = vantagemDao;
    this.empresaDao = empresaDao;
    this.emailService = emailService;

    this.resgatar = this.resgatar.bind(this);
    this.listarPorAluno = this.listarPorAluno.bind(this);
  }

  gerarCodigoCupom() {
    return 'CUPOM-' + randomUUID().split('-')[0].toUpperCase();
  }

  async resgatar(req, res) {
    try {
      const { aluno_id, vantagem_id } = req.body || {};

      if (!aluno_id || !vantagem_id) {
        return res
          .status(400)
          .json({ error: 'aluno_id e vantagem_id são obrigatórios' });
      }

      const aluno = await this.alunoDao.findById(aluno_id);
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      const usuarioAluno = await this.db.findById('usuarios', aluno_id);
      if (!usuarioAluno) {
        return res
          .status(404)
          .json({ error: 'Usuário do aluno não encontrado' });
      }

      const vantagem = await this.vantagemDao.findById(vantagem_id);
      if (!vantagem) {
        return res.status(404).json({ error: 'Vantagem não encontrada' });
      }

      const custo = vantagem.custo || vantagem.custo_moedas;
      if (!custo || custo <= 0) {
        return res
          .status(400)
          .json({ error: 'Vantagem com custo inválido' });
      }

      const empresaId = vantagem.empresa_id || vantagem.empresaId;
      const empresa = empresaId
        ? await this.empresaDao.findById(empresaId)
        : null;

      if (!empresa) {
        return res
          .status(404)
          .json({ error: 'Empresa parceira da vantagem não encontrada' });
      }

      const saldoAluno =
        typeof usuarioAluno.saldo === 'number'
          ? usuarioAluno.saldo
          : parseInt(usuarioAluno.saldo || 0, 10);

      if (saldoAluno < custo) {
        return res.status(400).json({ error: 'Saldo insuficiente' });
      }

      const novoSaldoAluno = saldoAluno - custo;

      const usuarioAtualizado = await this.db.update('usuarios', aluno_id, {
        saldo: novoSaldoAluno
      });

      const transacaoDebito = await this.transacaoDao.create({
        usuario_id: aluno_id,
        valor: -custo,
        descricao: `Resgate de vantagem: ${vantagem.nome || vantagem.titulo}`
      });

      const codigoCupom = this.gerarCodigoCupom();


      const resgate = await this.resgateDao.create({
        aluno_id,
        vantagem_id,
        codigo: codigoCupom,
        status: 'SOLICITADO',
        solicitado_em: new Date()
    
      });


      const nomeVantagem = vantagem.nome || vantagem.titulo || 'Vantagem';

      const textoAluno = `
        Olá, ${aluno.nome}!

        Você resgatou a vantagem: ${nomeVantagem}.
        Código do seu cupom: ${codigoCupom}

        Apresente esse código na empresa parceira: ${empresa.nome}.
        Valor em moedas utilizado: ${custo}.

        Obrigado por usar o sistema de mérito estudantil!
            `.trim();

            const textoEmpresa = `
        Olá, ${empresa.nome}!

        O aluno ${aluno.nome} resgatou a vantagem: ${nomeVantagem}.
        Código do cupom: ${codigoCupom}

        Por favor, valide esse código no momento da troca presencial.
      `.trim();

      // envia email para o aluno (email está no registro `usuarios`)
      const alunoEmail = (usuarioAluno && usuarioAluno.email) || (aluno && aluno.email) || null;
      console.log('Resgate: enviando email para aluno:', alunoEmail);
      await this.emailService.sendMail({
        to: alunoEmail,
        subject: `Seu cupom de ${nomeVantagem}`,
        text: textoAluno
      });

      if (empresa.email) {
        await this.emailService.sendMail({
          to: empresa.email,
          subject: `Cupom resgatado - ${nomeVantagem}`,
          text: textoEmpresa
        });
      }

      
      return res.status(201).json({
        mensagem: 'Vantagem resgatada e cupons enviados por email',
        saldo_atual: usuarioAtualizado.saldo,
        resgate,
        transacaoDebito
      });
    } catch (err) {
      console.error('Erro ao resgatar vantagem:', err);
      return res
        .status(500)
        .json({ error: 'Erro interno ao resgatar vantagem' });
    }
  }

  async listarPorAluno(req, res) {
    try {
      const { alunoId } = req.params;
      const resgates = await this.resgateDao.findByAluno(alunoId);
      return res.json(resgates);
    } catch (err) {
      console.error('Erro ao listar resgates:', err);
      return res
        .status(500)
        .json({ error: 'Erro interno ao listar resgates' });
    }
  }
}

module.exports = ResgateController;
