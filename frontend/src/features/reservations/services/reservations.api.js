import { api } from '@/api/axios'

export async function getReservations(params = {}) {
  const response = await api.get('/auth/reservas', { params })
  return response.data
}

export async function getReservationById(id) {
  const response = await api.get(`/auth/reservas/${id}`)
  return response.data
}

export async function createReservation(data) {
  const response = await api.post('/auth/reservas', data)
  return response.data
}

export async function updateReservation(id, data) {
  const response = await api.put(`/auth/reservas/${id}`, data)
  return response.data
}

export async function deleteReservation(id) {
  const response = await api.delete(`/auth/reservas/${id}`)
  return response.data
}

export async function startReservation(id) {
  const response = await api.patch(`/auth/reservas/${id}/iniciar`)
  return response.data
}

export async function finalizeReservation(id) {
  const response = await api.patch(`/auth/reservas/${id}/finalizar`)
  return response.data
}
