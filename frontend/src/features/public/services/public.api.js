import axios from '@/api/axios'

/**
 * Obtener información general del hotel (público)
 */
export const getHotelInfo = async () => {
  const response = await axios.get('/api/public/hotel-info')
  return response.data
}

/**
 * Obtener todos los hospedajes disponibles (público)
 */
export const getAvailableUnits = async (params = {}) => {
  const response = await axios.get('/api/public/hospedajes', { params })
  return response.data
}

/**
 * Obtener detalle de un hospedaje específico (público)
 */
export const getUnitDetails = async (id) => {
  const response = await axios.get(`/api/public/hospedajes/${id}`)
  return response.data
}

/**
 * Obtener tipos de hospedaje disponibles (público)
 */
export const getUnitTypes = async () => {
  const response = await axios.get('/api/public/tipos-hospedaje')
  return response.data
}

/**
 * Verificar disponibilidad de un hospedaje
 */
export const checkAvailability = async (hospedajeId, fechaInicio, fechaFin) => {
  const response = await axios.post('/api/public/check-availability', {
    hospedajeId,
    fechaInicio,
    fechaFin
  })
  return response.data
}
