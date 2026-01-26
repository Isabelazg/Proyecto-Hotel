import api from '@/api/axios'

export const getPayments = async (params) => {
  const response = await api.get('/auth/pagos', { params })
  return response.data
}

export const createPayment = async (data) => {
  const response = await api.post('/auth/pagos', data)
  return response.data
}

export const updatePayment = async (id, data) => {
  const response = await api.put(`/auth/pagos/${id}`, data)
  return response.data
}

export const deletePayment = async (id) => {
  const response = await api.delete(`/auth/pagos/${id}`)
  return response.data
}
