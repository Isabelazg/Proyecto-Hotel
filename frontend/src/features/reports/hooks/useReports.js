import { useState, useEffect } from 'react'
import { 
  getReportStats,
  getOccupancyReport,
  getRevenueReport,
  getClientsReport,
  getReservationsReport,
  getPaymentsReport
} from '../services/reports.api'

export function useReportStats(params = {}) {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadStats = async (filters = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await getReportStats({ ...params, ...filters })
      setStats(response.data || response)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al cargar estadísticas')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  return { stats, isLoading, error, refetch: loadStats }
}

export function useReport(reportType, params = {}) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const generateReport = async (filters = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      let response
      const reportParams = { ...params, ...filters }

      switch (reportType) {
        case 'occupancy':
          response = await getOccupancyReport(reportParams)
          break
        case 'revenue':
          response = await getRevenueReport(reportParams)
          break
        case 'clients':
          response = await getClientsReport(reportParams)
          break
        case 'reservations':
          response = await getReservationsReport(reportParams)
          break
        case 'payments':
          response = await getPaymentsReport(reportParams)
          break
        default:
          throw new Error('Tipo de reporte no válido')
      }

      setData(response.data || response)
      return response.data || response
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al generar reporte'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return { data, isLoading, error, generateReport }
}
