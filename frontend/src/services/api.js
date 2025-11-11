import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3000'
})

// Adiciona token se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function loginEmpresa(email, senha) {
  return api.post('/auth/login', { role: 'empresa', email, senha })
}

export async function loginAluno(cpf, rg) {
  return api.post('/auth/login', { role: 'aluno', cpf, rg })
}

export async function cadastrarAluno(payload) {
  return api.post('/alunos', payload)
}

