import api from '@/api/axios'

export const getClients = async (params) => {
  const response = await api.get('/auth/usuarios', { params })
  return response.data
}

export const createClient = async (data) => {
  const response = await api.post('/auth/usuarios', data)
  return response.data
}

export const updateClient = async (id, data) => {
  const response = await api.put(`/auth/usuarios/${id}`, data)
  return response.data
}

export const deleteClient = async (id) => {
  const response = await api.delete(`/auth/usuarios/${id}`)
  return response.data
}
