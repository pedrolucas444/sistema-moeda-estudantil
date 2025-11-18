import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function HubProfessor() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login')
  }

  function goToExtrato() {
    navigate('/professor/extrato')
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-900 shadow rounded p-6 text-center">
      <h1 className="text-2xl font-bold mb-6">Área do Professor</h1>
      <p className="text-sm text-slate-500 mb-4">Painel simples — adicione funcionalidades do professor aqui.</p>
      <div className="flex flex-col gap-3">
        <button onClick={() => navigate('/')} className="w-full bg-blue-600 text-white rounded py-3">Ir para Início</button>
  <button onClick={goToExtrato} className="w-full bg-gray-100 text-gray-800 rounded py-2 border">Ver Extrato</button>
  <button onClick={() => navigate('/professor/enviar')} className="w-full bg-green-600 text-white rounded py-2">Enviar Moedas</button>
        <button onClick={handleLogout} className="w-full bg-white text-gray-800 rounded py-2 border">Sair</button>
      </div>
    </div>
  )
}
