class TransacaoController {
  constructor({ transacaoDao, db }) {
    this.transacaoDao = transacaoDao;
    this.db = db;

    this.enviarMoedas = this.enviarMoedas.bind(this);
    this.extrato = this.extrato.bind(this);
    this.resgatarVantagem = this.resgatarVantagem.bind(this);
  }

  async enviarMoedas(req, res) {
    try {
      const { remetente_id, destinatario_id, valor, descricao } =
        req.body || {};

      if (!remetente_id || !destinatario_id || valor == null) {
        return res.status(400).json({
          error: 'remetente_id, destinatario_id e valor são obrigatórios'
        });
      }

      const valorInt = parseInt(valor, 10);
      if (!Number.isInteger(valorInt) || valorInt <= 0) {
        return res
          .status(400)
          .json({ error: 'valor deve ser um inteiro positivo' });
      }

      const remetente = await this.db.findById('usuarios', remetente_id);
      if (!remetente) {
        return res.status(404).json({ error: 'Remetente não encontrado' });
      }

      const destinatario = await this.db.findById(
        'usuarios',
        destinatario_id
      );
      if (!destinatario) {
        return res
          .status(404)
          .json({ error: 'Destinatário não encontrado' });
      }

      const saldoRemetente =
        typeof remetente.saldo === 'number'
          ? remetente.saldo
          : parseInt(remetente.saldo || 0, 10);

      const saldoDestinatario =
        typeof destinatario.saldo === 'number'
          ? destinatario.saldo
          : parseInt(destinatario.saldo || 0, 10);

      if (saldoRemetente < valorInt) {
        return res.status(400).json({ error: 'Saldo insuficiente' });
      }

      // Há triggers no banco que atualizam o saldo quando uma
      // transação é inserida (ver `tg_transacao_ins` em
      // codigo/db/functions_triggers.sql). Para evitar a
      // aplicação dupla da dedução/crédito (atualização manual
      // + trigger), não atualizamos o saldo aqui.

      // Insere as transações (débito do remetente e crédito do
      // destinatário). O trigger atualizará os saldos.
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

      // Busca os saldos atualizados após a inserção das transações
      const remetenteAtualizado = await this.db.findById('usuarios', remetente.id);
      const destinatarioAtualizado = await this.db.findById('usuarios', destinatario.id);

      return res.status(201).json({
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
    } catch (err) {
      console.error('Erro ao enviar moedas:', err);
      return res
        .status(500)
        .json({ error: 'Erro interno ao enviar moedas' });
    }
  }

  async extrato(req, res) {
    try {
      const { usuarioId } = req.params;

      const usuario = await this.db.findById('usuarios', usuarioId);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const transacoes = await this.transacaoDao.findByUsuarioId(usuarioId);

      return res.json({
        usuario,
        transacoes
      });
    } catch (err) {
      console.error('Erro ao buscar extrato:', err);
      return res
        .status(500)
        .json({ error: 'Erro interno ao consultar extrato' });
    }
  }

  async resgatarVantagem(req, res) {
    try {
      const { aluno_id, vantagem_id } = req.body || {};

      if (!aluno_id || !vantagem_id) {
        return res
          .status(400)
          .json({ error: 'aluno_id e vantagem_id são obrigatórios' });
      }

      const aluno = await this.db.findById('alunos', aluno_id);
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      const vantagem = await this.db.findById('vantagens', vantagem_id);
      if (!vantagem) {
        return res.status(404).json({ error: 'Vantagem não encontrada' });
      }
      if (vantagem.ativa === false) {
        return res
          .status(400)
          .json({ error: 'Vantagem inativa, não pode ser resgatada' });
      }

      
      const usuarioAluno = await this.db.findById('usuarios', aluno_id);
      if (!usuarioAluno) {
        return res
          .status(404)
          .json({ error: 'Usuário do aluno não encontrado' });
      }

      const saldoAtual =
        typeof usuarioAluno.saldo === 'number'
          ? usuarioAluno.saldo
          : parseInt(usuarioAluno.saldo || 0, 10);

      const custo = parseInt(vantagem.custo_moedas, 10);

      if (!Number.isInteger(custo) || custo <= 0) {
        return res
          .status(400)
          .json({ error: 'Custo da vantagem inválido no cadastro' });
      }

      if (saldoAtual < custo) {
        return res
          .status(400)
          .json({ error: 'Saldo insuficiente para resgatar a vantagem' });
      }

      const resgate = await this.db.insert('resgates', {
        aluno_id,
        vantagem_id
      });

      const usuarioAtualizado = await this.db.findById('usuarios', aluno_id);

      return res.status(201).json({
        mensagem: 'Vantagem resgatada com sucesso',
        aluno: {
          id: aluno_id,
          saldo: usuarioAtualizado
            ? usuarioAtualizado.saldo
            : saldoAtual - custo
        },
        vantagem: {
          id: vantagem.id,
          titulo: vantagem.titulo,
          custo_moedas: custo
        },
        resgate
      });
    } catch (err) {
      console.error('Erro ao resgatar vantagem:', err);

      if (
        err.message &&
        err.message.includes('Saldo insuficiente para efetuar a operação')
      ) {
        return res
          .status(400)
          .json({ error: 'Saldo insuficiente para resgatar a vantagem' });
      }

      return res
        .status(500)
        .json({ error: 'Erro interno ao resgatar vantagem' });
    }
  }
}

module.exports = TransacaoController;
