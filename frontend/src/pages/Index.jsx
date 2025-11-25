import React from 'react'
import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../components/PrimaryButton'

const Index = () => {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 shadow rounded p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Bem-vindo</h1>

        <div className="flex flex-col gap-3">
          <PrimaryButton onClick={() => navigate('/login')} className="py-2">Login</PrimaryButton>
          <PrimaryButton onClick={() => navigate('/cadastro/aluno')} className="py-2 bg-white text-blue-600 border dark:bg-transparent dark:text-slate-200">Cadastrar Aluno</PrimaryButton>
          <PrimaryButton onClick={() => navigate('/cadastro/empresa')} className="py-2 bg-white text-blue-600 border dark:bg-transparent dark:text-slate-200">Cadastrar Empresa</PrimaryButton>
        </div>
      </div>
    </main>
  )
}

export default Index