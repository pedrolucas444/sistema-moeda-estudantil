import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Index from './pages/Index'
import { CadastroVantagemEmpresa } from './pages/CadastroVantagemEmpresa'
import { ListaVantagensAluno } from './pages/ListaVantagensAluno'
import Login from './pages/Login'
import CadastroAluno from './pages/CadastroAluno'
import CadastroEmpresa from './pages/CadastroEmpresa'
import HubAluno from './pages/HubAluno'
import HubEmpresa from './pages/HubEmpresa'
import HubProfessor from './pages/HubProfessor'
import ExtratoAluno from './pages/ExtratoAluno'
import ExtratoProfessor from './pages/ExtratoProfessor'
import EnviarMoedasProfessor from './pages/EnviarMoedasProfessor'
import VantagensResgatadas from './pages/VantagensResgatadas'

// Componente que exibe um botão de ação quando o usuário está logado.
// O botão navega para a funcionalidade apropriada conforme o `role`.
// Fixed action panel removed as requested. Hubs are used instead.

const App = () => (
  <BrowserRouter>
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Conteúdo principal (sem header) */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/empresa/vantagens" element={<CadastroVantagemEmpresa />} />
          <Route path="/empresa/hub" element={<HubEmpresa />} />
          <Route path="/professor/hub" element={<HubProfessor />} />
          <Route path="/aluno/vantagens" element={<ListaVantagensAluno />} />
          <Route path="/aluno/vantagens-resgatadas" element={<VantagensResgatadas />} />
          <Route path="/aluno/hub" element={<HubAluno />} />
          <Route path="/aluno/extrato" element={<ExtratoAluno />} />
          <Route path="/professor/extrato" element={<ExtratoProfessor />} />
          <Route path="/professor/enviar" element={<EnviarMoedasProfessor />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro/aluno" element={<CadastroAluno />} />
          <Route path="/cadastro/empresa" element={<CadastroEmpresa />} />
          {/* Rota padrão */}
          <Route path="*" element={<Index />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
)

export default App
