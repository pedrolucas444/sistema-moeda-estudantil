import React from 'react'
import { Link } from 'react-router-dom'

const Index = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 shadow rounded p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Bem-vindo</h1>

        <div className="flex flex-col gap-3">
          <Link to="/login" className="block w-full bg-blue-600 text-white py-2 rounded">Login</Link>
          <Link to="/cadastro/aluno" className="block w-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-2 rounded">Cadastrar Aluno</Link>
        </div>
      </div>
    </main>
  )
}

export default Index