import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function CadastroAluno() {
  const [form, setForm] = useState({ nome: '', cpf: '', rg: '', endereco: '', curso: '', email: '', senha: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const navigate = useNavigate()

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setOk('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register/aluno', form)
      setOk('Aluno cadastrado e autenticado com sucesso!')
      if (data?.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('role', data.role)
      }
      navigate('/aluno/vantagens')
    } catch (err) {
      setError(err?.response?.data?.error || 'Falha ao cadastrar aluno')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-slate-900 shadow rounded p-6">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Aluno</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-sm mb-1">Nome</label>
          <input name="nome" value={form.nome} onChange={onChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={onChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Senha</label>
            <input type="password" name="senha" value={form.senha} onChange={onChange} required className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">CPF</label>
            <input name="cpf" value={form.cpf} onChange={onChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">RG</label>
            <input name="rg" value={form.rg} onChange={onChange} required className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Endereço</label>
          <input name="endereco" value={form.endereco} onChange={onChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Curso</label>
          <input name="curso" value={form.curso} onChange={onChange} required className="w-full border rounded px-3 py-2" />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {ok && <p className="text-green-600 text-sm">{ok}</p>}

        <button disabled={loading} className="w-full bg-blue-600 text-white rounded py-2 disabled:opacity-60">
          {loading ? 'Salvando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  )
}
