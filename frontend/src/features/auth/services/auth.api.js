import { api } from '@/api/axios'

export async function loginUser(credentials) {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export async function getCurrentUser() {
  const response = await api.get('/auth/perfil')
  return response.data
}

export async function requestPasswordReset(correo) {
  const response = await api.post('/auth/forgot-password', { correo })
  return response.data
}

export async function resetPassword({ token, contrasena }) {
  const response = await api.post('/auth/reset-password', { token, contrasena })
  return response.data
}

export async function logoutUser() {
  // Simplemente limpiar el localStorage
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
