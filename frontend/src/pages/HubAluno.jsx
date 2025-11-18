import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function HubAluno() {
  const navigate = useNavigate()

  function goToVantagens() {
    navigate('/aluno/vantagens')
  }

  function goToExtrato() {
    navigate('/aluno/extrato')
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login')
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-900 shadow rounded p-6 text-center">
      <h1 className="text-2xl font-bold mb-6">Área do Aluno</h1>
      <div className="flex flex-col gap-3">
        <button onClick={goToVantagens} className="w-full bg-blue-600 text-white rounded py-3">Ir para Vantagens</button>
        <button onClick={goToExtrato} className="w-full bg-gray-100 text-gray-800 rounded py-2 border">Ver Extrato</button>
        <button onClick={handleLogout} className="w-full bg-white text-gray-800 rounded py-2 border">Sair</button>
      </div>
    </div>
  )
}
