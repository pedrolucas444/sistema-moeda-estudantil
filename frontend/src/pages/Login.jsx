import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import PrimaryButton from '../components/PrimaryButton'

export default function Login() {
  const [role, setRole] = useState('aluno')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload =
        role === 'empresa'
          ? { role, email, senha }
          : role === 'professor'
          ? { role, email, senha }
            : { role, email, senha }

      const { data } = await api.post('/auth/login', payload)
      if (data?.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('role', data.role)
      }
      // Redireciona para o hub do respectivo papel (hub mostra botão da funcionalidade + logout)
      if (data.role === 'empresa') navigate('/empresa/hub')
      else if (data.role === 'professor') navigate('/professor/hub')
      else navigate('/aluno/hub')
    } catch (err) {
      setError(err?.response?.data?.error || 'Falha no login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-900 shadow rounded p-6">
      <div className="mb-3">
        <PrimaryButton inline onClick={() => navigate('/')} className="text-sm" aria-label="Voltar para início">
          <span className="text-xl">←</span>
          <span>Voltar</span>
        </PrimaryButton>
      </div>
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <div className="flex gap-2 mb-4">
        <PrimaryButton inline onClick={() => setRole('aluno')} className={`${role==='aluno' ? 'bg-linear-to-r from-blue-800 to-blue-900' : 'bg-transparent text-slate-700 border'}`}>Aluno</PrimaryButton>
        <PrimaryButton inline onClick={() => setRole('empresa')} className={`${role==='empresa' ? 'bg-linear-to-r from-blue-800 to-blue-900' : 'bg-transparent text-slate-700 border'}`}>Empresa</PrimaryButton>
        <PrimaryButton inline onClick={() => setRole('professor')} className={`${role==='professor' ? 'bg-linear-to-r from-blue-800 to-blue-900' : 'bg-transparent text-slate-700 border'}`}>Professor</PrimaryButton>
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
        ) : role === 'professor' ? (
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
                <label className="block text-sm mb-1">Email</label>
                <input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm mb-1">Senha</label>
                <input className="w-full border rounded px-3 py-2" type="password" value={senha} onChange={e=>setSenha(e.target.value)} required />
              </div>
            </>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <PrimaryButton type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</PrimaryButton>
      </form>
    </div>
  )
}
