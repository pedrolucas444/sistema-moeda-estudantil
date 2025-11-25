import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import PrimaryButton from '../components/PrimaryButton'

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

export default function VantagensResgatadas() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [resgates, setResgates] = useState([])

  useEffect(() => {
    async function load() {
      setErro(null)
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const usuarioId = decodeTokenId(token)
        if (!usuarioId) {
          setErro('Usuário não autenticado')
          return
        }

        // Puxa o extrato e filtra transações que correspondem a resgates
        const { data } = await api.get(`/transacoes/extrato/${usuarioId}`)
        const transacoes = data?.transacoes || []

        const resgateTrans = transacoes.filter((t) =>
          typeof t.descricao === 'string' && t.descricao.startsWith('Resgate de vantagem')
        )

        // Extrai os ids de vantagem e busca detalhes
        const ids = resgateTrans.map((t) => {
          const m = t.descricao.match(/Resgate de vantagem\s+(.+)$/)
          return m ? m[1] : null
        }).filter(Boolean)

        const detalhes = await Promise.all(ids.map(async (id) => {
          try {
            const r = await api.get(`/vantagens/${id}`)
            return r.data
          } catch (err) {
            return { id, titulo: 'Vantagem removida', custo_moedas: null }
          }
        }))

        setResgates(detalhes)
      } catch (err) {
        console.error(err)
        setErro(err.response?.data?.error || 'Erro ao carregar vantagens resgatadas')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <div className="p-6">Carregando...</div>
  if (erro) return <div className="p-6 text-red-600">{erro}</div>

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <PrimaryButton inline onClick={() => navigate('/aluno/hub')} className="text-sm">
            <span className="text-xl">←</span>
            <span>Voltar</span>
          </PrimaryButton>
        </div>
        <h1 className="text-2xl font-bold mb-4">Vantagens Resgatadas</h1>

        {resgates.length === 0 ? (
          <p className="text-slate-300">Você ainda não resgatou nenhuma vantagem.</p>
        ) : (
          <div className="grid gap-4">
            {resgates.map((v) => (
              <div key={v.id} className="bg-slate-900 p-4 rounded shadow">
                <h2 className="text-lg font-semibold text-blue-300">{v.titulo || 'Sem título'}</h2>
                <p className="text-sm text-slate-300">Custo: {v.custo_moedas ?? '—' } moedas</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
