import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function Login() {
  const [role, setRole] = useState('aluno')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [cpf, setCpf] = useState('')
  const [rg, setRg] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = role === 'empresa' ? { role, email, senha } : { role, cpf, rg }
      const { data } = await api.post('/auth/login', payload)
      if (data?.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('role', data.role)
      }
      // Redireciona baseado no papel
      if (data.role === 'empresa') navigate('/empresa/vantagens')
      else navigate('/aluno/vantagens')
    } catch (err) {
      setError(err?.response?.data?.error || 'Falha no login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-900 shadow rounded p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded border ${role==='aluno' ? 'bg-blue-600 text-white' : ''}`}
          onClick={() => setRole('aluno')}
          type="button"
        >Aluno</button>
        <button
          className={`px-3 py-1 rounded border ${role==='empresa' ? 'bg-blue-600 text-white' : ''}`}
          onClick={() => setRole('empresa')}
          type="button"
        >Empresa</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {role === 'empresa' ? (
          <>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Senha</label>
              <input className="w-full border rounded px-3 py-2" type="password" value={senha} onChange={e=>setSenha(e.target.value)} required />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm mb-1">CPF</label>
              <input className="w-full border rounded px-3 py-2" value={cpf} onChange={e=>setCpf(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1">RG</label>
              <input className="w-full border rounded px-3 py-2" value={rg} onChange={e=>setRg(e.target.value)} required />
            </div>
          </>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button disabled={loading} className="w-full bg-blue-600 text-white rounded py-2 disabled:opacity-60">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
