import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import PrimaryButton from './PrimaryButton'
import { decodeTokenId } from '../utils/token'

/**
 * Componente reutilizável para exibição de extrato de transações
 * 
 * @param {Object} props
 * @param {string} props.role - Role do usuário ('aluno' ou 'professor')
 * @param {string} props.backRoute - Rota para voltar (ex: '/aluno/hub')
 * @param {string} props.title - Título da página (opcional, padrão: 'Extrato')
 */
export default function Extrato({ role, backRoute, title = 'Extrato' }) {
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
        const storedRole = localStorage.getItem('role')
        
        // Validação de autenticação e role
        if (!token || storedRole !== role) {
          navigate('/login')
          return
        }

        const usuarioId = decodeTokenId(token)
        if (!usuarioId) {
          navigate('/login')
          return
        }

        // Busca extrato da API
        const { data } = await api.get(`/transacoes/extrato/${usuarioId}`)
        setUsuario(data.usuario || null)
        setTransacoes(Array.isArray(data.transacoes) ? data.transacoes : [])
      } catch (err) {
        setError(err?.response?.data?.error || 'Falha ao carregar extrato')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [navigate, role])

  function handleBack() {
    navigate(backRoute)
  }

  // Formata valor da transação para exibição
  function formatarValor(valor) {
    const numValor = Number(valor || 0)
    return {
      valor: numValor,
      tipo: numValor > 0 ? 'Recebido' : numValor < 0 ? 'Enviado' : 'Neutro',
      display: `${numValor > 0 ? '+' : ''}${numValor}`,
      cor: numValor < 0 ? 'text-red-600' : 'text-green-600'
    }
  }

  // Formata data para exibição
  function formatarData(data) {
    return data ? new Date(data).toLocaleString('pt-BR') : '-'
  }

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 shadow rounded p-6">
      <div className="mb-4">
        <PrimaryButton inline onClick={handleBack} className="text-sm">
          <span className="text-xl">←</span>
          <span>Voltar</span>
        </PrimaryButton>
      </div>

      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      {usuario && (
        <p className="mb-4 text-sm text-slate-600">
          Usuário: <strong>{usuario.nome || usuario.email || usuario.id}</strong>
          {' — '}
          Saldo: <strong>{typeof usuario.saldo !== 'undefined' ? usuario.saldo : '—'}</strong>
        </p>
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
              {transacoes.map((transacao) => {
                const valorFormatado = formatarValor(transacao.valor)
                const dataFormatada = formatarData(transacao.criada_em)
                const key = transacao.id || `${transacao.usuario_id}-${transacao.criada_em}-${Math.random()}`

                return (
                  <tr key={key} className="border-b last:border-b-0">
                    <td className="py-2 px-3 align-top text-sm">{dataFormatada}</td>
                    <td className="py-2 px-3 align-top text-sm">{valorFormatado.tipo}</td>
                    <td className={`py-2 px-3 align-top text-sm ${valorFormatado.cor}`}>
                      {valorFormatado.display}
                    </td>
                    <td className="py-2 px-3 align-top text-sm">{transacao.descricao || '-'}</td>
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

