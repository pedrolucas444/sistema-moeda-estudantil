
class TransacaoController {
    constructor({ transacaoDao, db }) {
      this.transacaoDao = transacaoDao;
      this.db = db;
  
      this.enviarMoedas = this.enviarMoedas.bind(this);
      this.extrato = this.extrato.bind(this);
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
  
        const novoSaldoRemetente = saldoRemetente - valorInt;
        const novoSaldoDestinatario = saldoDestinatario + valorInt;
  
        const remetenteAtualizado = await this.db.update('usuarios', remetente.id, {
          saldo: novoSaldoRemetente
        });
  
        const destinatarioAtualizado = await this.db.update(
          'usuarios',
          destinatario.id,
          { saldo: novoSaldoDestinatario }
        );
  
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
  }
  
  module.exports = TransacaoController;
  