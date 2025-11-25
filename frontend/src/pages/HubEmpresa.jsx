import React from 'react'
import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../components/PrimaryButton'

export default function HubEmpresa() {
  const navigate = useNavigate()

  function goToCadastroVantagem() {
    navigate('/empresa/vantagens')
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login')
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-900 shadow rounded p-6 text-center">
      <h1 className="text-2xl font-bold mb-6">Área da Empresa</h1>
      <div className="flex flex-col gap-3">
        <PrimaryButton onClick={goToCadastroVantagem} className="py-3">Ir para Cadastro de Vantagem</PrimaryButton>
        <PrimaryButton onClick={handleLogout}>Sair</PrimaryButton>
      </div>
    </div>
  )
}
