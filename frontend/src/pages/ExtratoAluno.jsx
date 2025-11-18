import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

function decodeTokenId(token) {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload && payload.id
  } catch {
    return null
  }
}

export default function ExtratoAluno() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [transacoes, setTransacoes] = useState([])
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    async function load() {
      setError('')
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('role')
        if (!token || role !== 'aluno') {
          navigate('/login')
          return
        }

        const usuarioId = decodeTokenId(token)
        if (!usuarioId) {
          navigate('/login')
          return
        }

        const { data } = await api.get(`/transacoes/extrato/${usuarioId}`)
        // Expecting { usuario, transacoes }
        setUsuario(data.usuario || null)
        setTransacoes(Array.isArray(data.transacoes) ? data.transacoes : [])
      } catch (err) {
        setError(err?.response?.data?.error || 'Falha ao carregar extrato')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [navigate])

  function handleBack() {
    navigate('/aluno/hub')
  }

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 shadow rounded p-6">
      <div className="mb-4">
        <button onClick={handleBack} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
          <span className="text-xl">←</span>
          <span>Voltar</span>
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Extrato</h1>

      {usuario && (
        <p className="mb-4 text-sm text-slate-600">Usuário: <strong>{usuario.nome || usuario.email || usuario.id}</strong> — Saldo: <strong>{typeof usuario.saldo !== 'undefined' ? usuario.saldo : '—'}</strong></p>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : transacoes.length === 0 ? (
        <p>Nenhuma transação encontrada.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 px-3">Data</th>
                <th className="py-2 px-3">Tipo</th>
                <th className="py-2 px-3">Valor</th>
                <th className="py-2 px-3">Descrição</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((t) => {
                const valor = Number(t.valor || 0)
                const tipo = valor > 0 ? 'Recebido' : valor < 0 ? 'Enviado' : 'Neutro'
                const displayValor = `${valor > 0 ? '+' : ''}${valor}`
                const dataStr = t.criada_em ? new Date(t.criada_em).toLocaleString() : '-'
                return (
                  <tr key={t.id || `${t.usuario_id}-${t.criada_em}-${Math.random()}`} className="border-b last:border-b-0">
                    <td className="py-2 px-3 align-top text-sm">{dataStr}</td>
                    <td className="py-2 px-3 align-top text-sm">{tipo}</td>
                    <td className={`py-2 px-3 align-top text-sm ${valor < 0 ? 'text-red-600' : 'text-green-600'}`}>{displayValor}</td>
                    <td className="py-2 px-3 align-top text-sm">{t.descricao || '-'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
