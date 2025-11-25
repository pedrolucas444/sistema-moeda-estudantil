import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import PrimaryButton from '../components/PrimaryButton'

export default function CadastroAluno() {
  const [form, setForm] = useState({ nome: '', cpf: '', rg: '', endereco: '', curso: '', email: '', senha: '', instituicao_id: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [instituicoes, setInstituicoes] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    async function loadInstituicoes() {
      try {
        const res = await api.get('/instituicoes')
        if (mounted) setInstituicoes(res.data || [])
      } catch (err) {
        // não bloqueante: mantemos o campo como está se falhar
        console.error('Erro ao carregar instituições', err?.response?.data || err.message)
      }
    }
    loadInstituicoes()
    return () => { mounted = false }
  }, [])

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
      // Após cadastro, enviar para o hub do aluno
      navigate('/aluno/hub')
    } catch (err) {
      setError(err?.response?.data?.error || 'Falha ao cadastrar aluno')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-slate-900 shadow rounded p-6">
      <div className="mb-3">
        <PrimaryButton inline onClick={() => navigate('/')} className="text-sm" aria-label="Voltar para início">
          <span className="text-xl">←</span>
          <span>Voltar</span>
        </PrimaryButton>
      </div>
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
        <div>
          <label className="block text-sm mb-1">Instituição</label>
          <select
            name="instituicao_id"
            value={form.instituicao_id}
            onChange={onChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Selecione a instituição</option>
            {instituicoes.length === 0 ? (
              <option value="" disabled>Não há instituições disponíveis</option>
            ) : (
              instituicoes.map((inst) => (
                <option key={inst.id} value={inst.id}>{inst.nome}</option>
              ))
            )}
          </select>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {ok && <p className="text-green-600 text-sm">{ok}</p>}

        <PrimaryButton type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Cadastrar'}</PrimaryButton>
      </form>
    </div>
  )
}
