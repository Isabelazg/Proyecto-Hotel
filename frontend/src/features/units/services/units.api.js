import { api } from '@/api/axios'

export async function getUnits(params = {}) {
  const response = await api.get('/auth/hospedajes', { params })
  return response.data
}

export async function getUnitById(id) {
  const response = await api.get(`/auth/hospedajes/${id}`)
  return response.data
}

export async function createUnit(data) {
  const response = await api.post('/auth/hospedajes', data)
  return response.data
}

export async function updateUnit(id, data) {
  const response = await api.put(`/auth/hospedajes/${id}`, data)
  return response.data
}

export async function deleteUnit(id) {
  const response = await api.delete(`/auth/hospedajes/${id}`)
  return response.data
}
