import React from 'react'
import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../components/PrimaryButton'

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
      <div className="flex flex-col gap-3">
        <PrimaryButton onClick={goToExtrato}>Ver Extrato</PrimaryButton>
        <PrimaryButton onClick={() => navigate('/professor/enviar')}>Enviar Moedas</PrimaryButton>
        <PrimaryButton onClick={handleLogout}>Sair</PrimaryButton>
      </div>
    </div>
  )
}
