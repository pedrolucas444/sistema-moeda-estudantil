import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import Index from './pages/Index'
import { CadastroVantagemEmpresa } from './pages/CadastroVantagemEmpresa'
import { ListaVantagensAluno } from './pages/ListaVantagensAluno'

const App = () => (
  <BrowserRouter>
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Navbar simples */}
      <header className="bg-white dark:bg-slate-900 shadow-md p-4 flex justify-center gap-6">
        <Link
          to="/"
          className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          Início
        </Link>
        <Link
          to="/empresa/vantagens"
          className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          Cadastrar Vantagem
        </Link>
        <Link
          to="/aluno/vantagens"
          className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          Listar Vantagens
        </Link>
      </header>

      {/* Conteúdo principal */}
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/empresa/vantagens" element={<CadastroVantagemEmpresa />} />
          <Route path="/aluno/vantagens" element={<ListaVantagensAluno />} />
          {/* Rota padrão */}
          <Route path="*" element={<Index />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
)

export default App
