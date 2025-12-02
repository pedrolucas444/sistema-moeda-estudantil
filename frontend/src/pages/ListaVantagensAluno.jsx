import { useEffect, useState } from "react";
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

export function ListaVantagensAluno() {
  const navigate = useNavigate()
  const [vantagens, setVantagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const resp = await api.get("/vantagens", {
          params: { ativa: true },
        });
        setVantagens(resp.data);
      } catch (err) {
        console.error(err);
        const msg =
          err.response?.data?.error || "Erro ao carregar vantagens.";
        setErro(msg);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  const usuarioId = decodeTokenId(localStorage.getItem('token'))

  async function handleResgatar(vantagemId) {
    setErro(null)
    if (!usuarioId) return setErro('Usuário não autenticado')

    try {
      const { data } = await api.post('/resgates', {
        aluno_id: usuarioId,
        vantagem_id: vantagemId
      })

      // remove da lista local para refletir resgate
      setVantagens((prev) => prev.filter((v) => v.id !== vantagemId))

      alert(data?.mensagem || 'Vantagem resgatada com sucesso')
    } catch (err) {
      console.error('Erro ao resgatar vantagem', err)
      setErro(err.response?.data?.error || 'Falha ao resgatar vantagem')
    }
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <p className="text-slate-200 text-lg">Carregando vantagens...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <p className="text-red-400 text-lg">{erro}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <PrimaryButton inline onClick={() => navigate('/aluno/hub')} className="text-sm" aria-label="Voltar para área do aluno">
            <span className="text-xl">←</span>
            <span>Voltar</span>
          </PrimaryButton>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-blue-400 text-center">
          Vantagens Disponíveis
        </h1>

        {vantagens.length === 0 && (
          <p className="text-center text-slate-300">
            Nenhuma vantagem disponível no momento.
          </p>
        )}

        <div className="grid gap-6 mt-6 grid-template-columns-1 sm:grid-cols-2 lg:grid-cols-3">
          {vantagens.map((v) => (
            <div
              key={v.id}
              className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden flex flex-col"
            >
              {v.foto_url && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={v.foto_url}
                    alt={v.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-4 flex flex-col gap-2 flex-1">
                <h2 className="text-xl font-semibold text-blue-300">
                  {v.titulo}
                </h2>

                <p className="text-sm text-slate-300">
                  <span className="font-semibold">Custo:</span>{" "}
                  {v.custo_moedas} moedas
                </p>

                {v.descricao && (
                  <p className="text-sm text-slate-400 mt-1">{v.descricao}</p>
                )}

                <div className="mt-4">
                  <PrimaryButton onClick={() => handleResgatar(v.id)} className="text-sm font-semibold">Trocar</PrimaryButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
