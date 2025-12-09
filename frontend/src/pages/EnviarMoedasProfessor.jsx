import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import PrimaryButton from '../components/PrimaryButton'
import { decodeTokenId } from '../utils/token' // ✅ Importação centralizada

export default function EnviarMoedasProfessor() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [alunos, setAlunos] = useState([])
  const [selected, setSelected] = useState(null)
  const [valor, setValor] = useState('')
  const [descricao, setDescricao] = useState('')
  const [sending, setSending] = useState(false)
  const [devEmails, setDevEmails] = useState([])

  useEffect(() => {
    async function load() {
      setError('')
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('role')
        if (!token || role !== 'professor') {
          navigate('/login')
          return
        }

        // fetch all alunos (small app assumed). Optionally could be filtered by instituicao.
        const { data } = await api.get('/alunos')
        setAlunos(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err?.response?.data?.error || 'Falha ao carregar alunos')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [navigate])

  const usuarioId = decodeTokenId(localStorage.getItem('token')) // ✅ Uso da função importada

  async function handleSend(e) {
    e.preventDefault()
    if (!selected) return setError('Selecione um aluno')
    const valorInt = parseInt(valor, 10)
    if (!Number.isInteger(valorInt) || valorInt <= 0) return setError('Valor deve ser inteiro positivo')

    setSending(true)
    setError('')
    try {
      const payload = {
        remetente_id: usuarioId,
        destinatario_id: selected.id,
        valor: valorInt,
        descricao: descricao || 'Transferência'
      }

      const res = await api.post('/transacoes/enviar', payload)
      // show success and reset form
      alert(res?.data?.mensagem || 'Moedas enviadas com sucesso')
      setValor('')
      setDescricao('')
      setSelected(null)

      // Em modo de desenvolvimento o backend armazena emails mock em /dev/emails
      // Tentamos buscar e mostrar rapidamente para debugging (não existe em produção)
      try {
        const { data: emails } = await api.get('/dev/emails')
        if (Array.isArray(emails) && emails.length) {
          // mostra os últimos 2 e‑mails gerados
          setDevEmails(emails.slice(-2).reverse())
        }
      } catch (e) {
        // ignora — rota não existe em produção ou problema de CORS
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Falha ao enviar moedas')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 shadow rounded p-6">
      <div className="mb-4">
        <PrimaryButton inline onClick={() => navigate('/professor/hub')} className="text-sm">
          <span className="text-xl">←</span>
          <span>Voltar</span>
        </PrimaryButton>
      </div>

      <h1 className="text-2xl font-bold mb-4">Enviar Moedas — Professor</h1>

      {loading ? (
        <p>Carregando alunos...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div>
          <p className="mb-3 text-sm text-slate-600">Selecione um aluno e informe o valor a enviar.</p>
          <div className="grid grid-cols-1 gap-2">
            {alunos.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelected(a)}
                className={`text-left p-3 rounded border ${selected && selected.id === a.id ? 'border-blue-600 bg-blue-50' : 'bg-white'}`}>
                <div className="font-medium">{a.nome || a.email || a.id}</div>
                <div className="text-sm text-slate-500">{a.email || ''}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="mt-4 space-y-3">
            <div>
              <label className="block text-sm mb-1">Valor (inteiro)</label>
              <input className="w-40 border rounded px-3 py-2" value={valor} onChange={(e) => setValor(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Descrição (opcional)</label>
              <input className="w-full border rounded px-3 py-2" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <div className="flex gap-2">
              <PrimaryButton type="submit" disabled={sending} className="px-4">{sending ? 'Enviando...' : 'Enviar'}</PrimaryButton>
              <PrimaryButton type="button" onClick={() => { setSelected(null); setValor(''); setDescricao(''); }} className="bg-white text-blue-600 border px-4">Limpar</PrimaryButton>
            </div>
          </form>
          {devEmails.length > 0 && (
            <div className="mt-4 p-3 border rounded bg-gray-50 text-sm">
              <div className="font-medium mb-2">E‑mails de debug (modo dev)</div>
              {devEmails.map((m, idx) => (
                <div key={idx} className="mb-2">
                  <div><strong>Para:</strong> {m.to}</div>
                  <div><strong>Assunto:</strong> {m.subject}</div>
                  <div className="text-slate-600">{m.text?.slice(0, 200)}</div>
                </div>
              ))}
              <div className="text-xs text-slate-500">Somente visível em ambiente de desenvolvimento.</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

