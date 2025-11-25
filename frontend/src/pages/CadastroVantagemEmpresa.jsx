import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { api } from "../services/api";
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

export function CadastroVantagemEmpresa() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    empresa_id: "",
    titulo: "",
    descricao: "",
    custo_moedas: "",
    foto_url: "",
  });

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'empresa') {
      navigate('/login')
      return
    }

    const id = decodeTokenId(token)
    if (id) setForm((prev) => ({ ...prev, empresa_id: id }))
  }, [navigate])

  const [mensagem, setMensagem] = useState(null);
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem(null);
    setCarregando(true);

    try {
      const payload = {
        empresa_id: form.empresa_id,
        titulo: form.titulo,
        descricao: form.descricao || undefined,
        custo_moedas: Number(form.custo_moedas),
        foto_url: form.foto_url || undefined,
      };

      const resp = await api.post("/vantagens", payload);
      setMensagem(`Vantagem cadastrada com sucesso! ID: ${resp.data.id}`);

      setForm((prev) => ({
        ...prev,
        titulo: "",
        descricao: "",
        custo_moedas: "",
        foto_url: "",
      }));
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || "Erro ao cadastrar vantagem.";
      setMensagem(msg);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-slate-950 text-white">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="mb-4">
          <PrimaryButton inline onClick={() => navigate('/empresa/hub')} className="text-sm" aria-label="Voltar para área da empresa">
            <span className="text-xl">←</span>
            <span>Voltar</span>
          </PrimaryButton>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
          Cadastro de Vantagem (Empresa)
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Empresa ID é preenchido automaticamente a partir do token da sessão */}

          <div>
            <label className="block mb-1 font-medium text-sm text-slate-300">
              Título
            </label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Desconto na Cantina"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm text-slate-300">
              Descrição
            </label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva o benefício"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm text-slate-300">
              Custo em moedas
            </label>
            <input
              type="number"
              name="custo_moedas"
              value={form.custo_moedas}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 200"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm text-slate-300">
              URL da foto
            </label>
            <input
              name="foto_url"
              value={form.foto_url}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://exemplo.com/imagem.png"
            />
          </div>

          <PrimaryButton type="submit" disabled={carregando} className="mt-4 font-semibold">{carregando ? 'Salvando...' : 'Cadastrar vantagem'}</PrimaryButton>
        </form>

        {mensagem && (
          <p className="mt-4 text-center text-sm text-slate-300">{mensagem}</p>
        )}
      </div>
    </div>
  );
}
