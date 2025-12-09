const { validateRequiredFields, validatePositiveInteger } = require('../utils/validators');
const { errorResponse, successResponse, asyncHandler } = require('../utils/httpResponse');
const { findEntityOrFail, normalizeSaldo, validateSaldoSuficiente } = require('../utils/entityHelpers');

class TransacaoController {
  constructor({ transacaoDao, db, emailService }) {
    this.transacaoDao = transacaoDao;
    this.db = db;
    this.emailService = emailService;

    // Aplicar asyncHandler em todos os métodos
    this.enviarMoedas = asyncHandler(this.enviarMoedas.bind(this));
    this.extrato = asyncHandler(this.extrato.bind(this));
    this.resgatarVantagem = asyncHandler(this.resgatarVantagem.bind(this));
  }

  async enviarMoedas(req, res) {
    const { remetente_id, destinatario_id, valor, descricao } = req.body || {};

    // Validação centralizada
    const requiredValidation = validateRequiredFields(
      req.body,
      ['remetente_id', 'destinatario_id', 'valor']
    );
    if (!requiredValidation.valid) {
      return errorResponse(res, 400, requiredValidation.error);
    }

    const valorValidation = validatePositiveInteger(valor, 'valor');
    if (!valorValidation.valid) {
      return errorResponse(res, 400, valorValidation.error);
    }
    const valorInt = valorValidation.value;

    // Busca de entidades com helper
    const remetente = await findEntityOrFail(
      this.db, 'usuarios', remetente_id, 'Remetente'
    );
    const destinatario = await findEntityOrFail(
      this.db, 'usuarios', destinatario_id, 'Destinatário'
    );

    // Validação de saldo com helper
    const saldoRemetente = normalizeSaldo(remetente.saldo);
    validateSaldoSuficiente(saldoRemetente, valorInt);

    // Lógica de negócio (sem validações)
    const debitoProf = await this.transacaoDao.create({
      usuario_id: remetente.id,
      valor: -valorInt,
      descricao: descricao || 'Envio de moedas'
    });

    const creditoAluno = await this.transacaoDao.create({
      usuario_id: destinatario.id,
      valor: valorInt,
      descricao: descricao || 'Recebimento de moedas'
    });

    // Busca saldos atualizados
    const remetenteAtualizado = await this.db.findById('usuarios', remetente.id);
    const destinatarioAtualizado = await this.db.findById('usuarios', destinatario.id);

    // Envio de emails (não bloqueia)
    this._enviarEmailsNotificacao(remetente, destinatario, remetenteAtualizado, destinatarioAtualizado, valorInt);

    // Resposta padronizada
    return successResponse(res, 201, {
      mensagem: 'Moedas enviadas com sucesso',
      remetente: {
        id: remetenteAtualizado.id,
        saldo: remetenteAtualizado.saldo
      },
      destinatario: {
        id: destinatarioAtualizado.id,
        saldo: destinatarioAtualizado.saldo
      },
      transacoes: {
        debitoProf,
        creditoAluno
      }
    });
  }

  async extrato(req, res) {
    const { usuarioId } = req.params;

    // Busca com helper (já lança erro se não encontrado)
    const usuario = await findEntityOrFail(
      this.db, 'usuarios', usuarioId, 'Usuário'
    );

    const transacoes = await this.transacaoDao.findByUsuarioId(usuarioId);

    return successResponse(res, 200, {
      usuario,
      transacoes
    });
  }

  async resgatarVantagem(req, res) {
    const { aluno_id, vantagem_id } = req.body || {};

    // Validação centralizada
    const requiredValidation = validateRequiredFields(
      req.body,
      ['aluno_id', 'vantagem_id']
    );
    if (!requiredValidation.valid) {
      return errorResponse(res, 400, requiredValidation.error);
    }

    // Busca de entidades com helper
    const aluno = await findEntityOrFail(
      this.db, 'alunos', aluno_id, 'Aluno'
    );
    const vantagem = await findEntityOrFail(
      this.db, 'vantagens', vantagem_id, 'Vantagem'
    );

    if (vantagem.ativa === false) {
      return errorResponse(res, 400, 'Vantagem inativa, não pode ser resgatada');
    }

    const usuarioAluno = await findEntityOrFail(
      this.db, 'usuarios', aluno_id, 'Usuário do aluno'
    );

    // Validação de saldo com helper
    const saldoAtual = normalizeSaldo(usuarioAluno.saldo);
    const custoValidation = validatePositiveInteger(vantagem.custo_moedas, 'Custo da vantagem');
    if (!custoValidation.valid) {
      return errorResponse(res, 400, 'Custo da vantagem inválido no cadastro');
    }
    const custo = custoValidation.value;

    validateSaldoSuficiente(saldoAtual, custo);

    // Lógica de negócio
    const resgate = await this.db.insert('resgates', {
      aluno_id,
      vantagem_id
    });

    const usuarioAtualizado = await this.db.findById('usuarios', aluno_id);

    return successResponse(res, 201, {
      mensagem: 'Vantagem resgatada com sucesso',
      aluno: {
        id: aluno_id,
        saldo: usuarioAtualizado ? usuarioAtualizado.saldo : saldoAtual - custo
      },
      vantagem: {
        id: vantagem.id,
        titulo: vantagem.titulo,
        custo_moedas: custo
      },
      resgate
    });
  }

  // Método privado para envio de emails
  _enviarEmailsNotificacao(remetente, destinatario, remetenteAtualizado, destinatarioAtualizado, valorInt) {
    try {
      const valorStr = `${valorInt}`;

      if (remetente.email) {
        this.emailService && this.emailService.sendMail({
          to: remetente.email,
          subject: `Você enviou ${valorStr} moedas`,
          text: `Você enviou ${valorStr} moedas para ${destinatario.nome || destinatario.email}.\nSeu novo saldo: ${remetenteAtualizado.saldo}`
        }).catch(e => console.error('Erro ao enviar email para remetente:', e));
      }

      if (destinatario.email) {
        this.emailService && this.emailService.sendMail({
          to: destinatario.email,
          subject: `Você recebeu ${valorStr} moedas`,
          text: `Você recebeu ${valorStr} moedas de ${remetente.nome || remetente.email}.\nSeu novo saldo: ${destinatarioAtualizado.saldo}`
        }).catch(e => console.error('Erro ao enviar email para destinatário:', e));
      }
    } catch (err) {
      console.error('Erro ao tentar notificar por email sobre a transacao:', err);
    }
  }
}

module.exports = TransacaoController;

