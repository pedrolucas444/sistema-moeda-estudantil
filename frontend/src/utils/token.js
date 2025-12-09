/**
 * Decodifica um token JWT e extrai o ID do usuário do payload
 * 
 * @param {string} token - Token JWT completo
 * @returns {string|null} - ID do usuário ou null se inválido
 * 
 * @example
 * const token = localStorage.getItem('token')
 * const userId = decodeTokenId(token)
 */
export function decodeTokenId(token) {
  if (!token || typeof token !== 'string') {
    return null
  }

  try {
    const parts = token.split('.')
    
    // JWT deve ter 3 partes: header.payload.signature
    if (parts.length < 2) {
      return null
    }

    // Decodifica o payload (segunda parte)
    // Substitui caracteres especiais do base64url
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    )

    return payload?.id || null
  } catch (error) {
    console.warn('Erro ao decodificar token:', error)
    return null
  }
}

/**
 * Verifica se um token JWT está expirado
 * 
 * @param {string} token - Token JWT completo
 * @returns {boolean} - true se expirado, false caso contrário
 */
export function isTokenExpired(token) {
  if (!token) return true

  try {
    const parts = token.split('.')
    if (parts.length < 2) return true

    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    )

    if (!payload.exp) return false // Sem expiração definida

    // exp está em segundos, Date.now() está em milissegundos
    return Date.now() >= payload.exp * 1000
  } catch {
    return true
  }
}

