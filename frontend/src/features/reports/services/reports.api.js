import { api } from '@/api/axios'

// Obtener estadísticas generales
export async function getReportStats(params = {}) {
  const response = await api.get('/auth/reportes/estadisticas', { params })
  return response.data
}

// Reporte de ocupación
export async function getOccupancyReport(params = {}) {
  const response = await api.get('/auth/reportes/ocupacion', { params })
  return response.data
}

// Reporte de ingresos
export async function getRevenueReport(params = {}) {
  const response = await api.get('/auth/reportes/ingresos', { params })
  return response.data
}

// Reporte de clientes
export async function getClientsReport(params = {}) {
  const response = await api.get('/auth/reportes/clientes', { params })
  return response.data
}

// Reporte de reservas
export async function getReservationsReport(params = {}) {
  const response = await api.get('/auth/reportes/reservas', { params })
  return response.data
}

// Reporte de pagos
export async function getPaymentsReport(params = {}) {
  const response = await api.get('/auth/reportes/pagos', { params })
  return response.data
}
