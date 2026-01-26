import { api } from '@/api/axios'

export async function loginUser(credentials) {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export async function getCurrentUser() {
  const response = await api.get('/auth/perfil')
  return response.data
}

export async function logoutUser() {
  // Simplemente limpiar el localStorage
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
