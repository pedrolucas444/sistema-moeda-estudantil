import React from 'react'
import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../components/PrimaryButton'

export default function HubAluno() {
  const navigate = useNavigate()

  function goToVantagens() {
    navigate('/aluno/vantagens')
  }

  function goToExtrato() {
    navigate('/aluno/extrato')
  }

  function goToVantagensResgatadas() {
    navigate('/aluno/vantagens-resgatadas')
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
        <PrimaryButton onClick={goToVantagens} className="py-3">Ir para Vantagens</PrimaryButton>
        <PrimaryButton onClick={goToExtrato}>Ver Extrato</PrimaryButton>
        <PrimaryButton onClick={goToVantagensResgatadas}>Vantagens Resgatadas</PrimaryButton>
        <PrimaryButton onClick={handleLogout}>Sair</PrimaryButton>
      </div>
    </div>
  )
}
