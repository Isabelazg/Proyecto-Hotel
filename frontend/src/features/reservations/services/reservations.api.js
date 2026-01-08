import { api } from '@/api/axios'

export async function getReservations() {
  const response = await api.get('/reservations')
  return response.data
}

export async function getReservationById(id) {
  const response = await api.get(`/reservations/${id}`)
  return response.data
}

export async function createReservation(data) {
  const response = await api.post('/reservations', data)
  return response.data
}

export async function updateReservation(id, data) {
  const response = await api.put(`/reservations/${id}`, data)
  return response.data
}

export async function deleteReservation(id) {
  const response = await api.delete(`/reservations/${id}`)
  return response.data
}
