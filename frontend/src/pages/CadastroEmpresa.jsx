import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import PrimaryButton from '../components/PrimaryButton'

export default function CadastroEmpresa() {
  const [form, setForm] = useState({ nome: '', cnpj: '', email: '', senha: '' })
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
      // Envia para o endpoint de empresas. O backend espera campos como
      // nome, cnpj, email e senha_hash (EmpresaDAO aceita `senhaHash`)
      const payload = {
        nome: form.nome,
        cnpj: form.cnpj,
        email: form.email,
        // usamos `senhaHash` apenas como campo já mapeado pelo DAO;
        // o backend atual não faz hashing automaticamente.
        senhaHash: form.senha
      }

      const { data } = await api.post('/empresas', payload)
      setOk('Empresa cadastrada com sucesso!')

      // Redireciona para o hub da empresa (não faz login automaticamente)
      navigate('/empresa/hub')
    } catch (err) {
      console.error('Erro ao cadastrar empresa', err)
      setError(err?.response?.data?.error || 'Falha ao cadastrar empresa')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-slate-900 shadow rounded p-6">
      <div className="mb-3">
        <PrimaryButton inline onClick={() => navigate('/empresa/hub')} className="text-sm" aria-label="Voltar para área da empresa">
          <span className="text-xl">←</span>
          <span>Voltar</span>
        </PrimaryButton>
      </div>
      <h1 className="text-2xl font-bold mb-4">Cadastro de Empresa</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-sm mb-1">Nome</label>
          <input name="nome" value={form.nome} onChange={onChange} required className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm mb-1">CNPJ</label>
          <input name="cnpj" value={form.cnpj} onChange={onChange} required className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input type="email" name="email" value={form.email} onChange={onChange} required className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm mb-1">Senha</label>
          <input type="password" name="senha" value={form.senha} onChange={onChange} required className="w-full border rounded px-3 py-2" />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {ok && <p className="text-green-600 text-sm">{ok}</p>}

        <PrimaryButton type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Cadastrar'}</PrimaryButton>
      </form>
    </div>
  )
}
