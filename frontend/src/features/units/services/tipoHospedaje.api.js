import api from '@/api/axios'

export const getTiposHospedaje = async (params) => {
  const response = await api.get('/auth/tipos-hospedaje', { params })
  return response.data
}

export const createTipoHospedaje = async (data) => {
  const response = await api.post('/auth/tipos-hospedaje', data)
  return response.data
}

export const updateTipoHospedaje = async (id, data) => {
  const response = await api.put(`/auth/tipos-hospedaje/${id}`, data)
  return response.data
}

export const deleteTipoHospedaje = async (id) => {
  const response = await api.delete(`/auth/tipos-hospedaje/${id}`)
  return response.data
}
