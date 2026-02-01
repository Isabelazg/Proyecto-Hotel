import { useState, useEffect } from 'react'
import { Calendar, Download, FileText, TrendingUp, Users, DollarSign, Home, BarChart3, Filter } from 'lucide-react'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { useReportStats, useReport } from './hooks/useReports'
import { getReservations } from '../reservations/services/reservations.api'
import { getPayments } from '../payments/services/payments.api'
import { getClients } from '../clients/services/clients.api'
import { getUnits } from '../units/services/units.api'

const REPORT_TYPES = [
  { 
    id: 'occupancy', 
    title: 'Reporte de Ocupación', 
    description: 'Análisis de ocupación por unidad y período',
    icon: Home,
    color: 'bg-blue-50 border-blue-200 text-blue-800'
  },
  { 
    id: 'revenue', 
    title: 'Reporte de Ingresos', 
    description: 'Ingresos totales y desglose por categoría',
    icon: DollarSign,
    color: 'bg-green-50 border-green-200 text-green-800'
  },
  { 
    id: 'clients', 
    title: 'Reporte de Clientes', 
    description: 'Clientes frecuentes y estadísticas de visitas',
    icon: Users,
    color: 'bg-purple-50 border-purple-200 text-purple-800'
  },
  { 
    id: 'reservations', 
    title: 'Reporte de Reservas', 
    description: 'Reservas por estado, cancelaciones y tendencias',
    icon: Calendar,
    color: 'bg-amber-50 border-amber-200 text-amber-800'
  },
  { 
    id: 'performance', 
    title: 'Reporte de Rendimiento', 
    description: 'Métricas clave y KPIs del hotel',
    icon: TrendingUp,
    color: 'bg-red-50 border-red-200 text-red-800'
  },
  { 
    id: 'payments', 
    title: 'Reporte de Pagos', 
    description: 'Análisis de pagos, métodos y transacciones',
    icon: BarChart3,
    color: 'bg-indigo-50 border-indigo-200 text-indigo-800'
  }
]

export function ReportsView() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedType, setSelectedType] = useState(null)
  const [reportData, setReportData] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Estados para datos reales
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalReservations: 0,
    averageOccupancy: 0,
    totalClients: 0,
    completedPayments: 0,
    pendingPayments: 0
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  // Cargar estadísticas reales
  useEffect(() => {
    loadRealStats()
  }, [dateFrom, dateTo])

  const loadRealStats = async () => {
    setIsLoadingStats(true)
    try {
      const filters = {}
      if (dateFrom) filters.fecha_desde = dateFrom
      if (dateTo) filters.fecha_hasta = dateTo

      const [reservasRes, pagosRes, clientesRes, unidadesRes] = await Promise.all([
        getReservations({ limit: 1000, ...filters }),
        getPayments({ limit: 1000, ...filters }),
        getClients({ limit: 1000 }),
        getUnits({ limit: 1000 })
      ])

      const reservas = reservasRes.data || []
      const pagos = pagosRes.data || []
      const clientes = clientesRes.data || []
      const unidades = unidadesRes.data || []

      // Calcular ingresos totales
      const totalRevenue = pagos.reduce((sum, p) => sum + parseFloat(p.valor || 0), 0)

      // Calcular ocupación promedio
      const unidadesOcupadas = unidades.filter(u => !u.estado).length
      const averageOccupancy = unidades.length > 0 
        ? Math.round((unidadesOcupadas / unidades.length) * 100) 
        : 0

      // Contar estados de reservas
      const reservasCompletadas = reservas.filter(r => r.estado === 'terminada').length
      const reservasPendientes = reservas.filter(r => r.estado === 'pendiente').length

      setStats({
        totalRevenue,
        totalReservations: reservas.length,
        averageOccupancy,
        totalClients: clientes.length,
        completedPayments: pagos.length,
        pendingPayments: reservasPendientes
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const handleGenerateReport = async (reportType) => {
    setSelectedType(reportType)
    setIsGenerating(true)
    
    try {
      const filters = {}
      if (dateFrom) filters.fecha_desde = dateFrom
      if (dateTo) filters.fecha_hasta = dateTo

      let data
      switch (reportType) {
        case 'occupancy':
          const unidadesRes = await getUnits({ limit: 1000 })
          const reservasRes = await getReservations({ limit: 1000, ...filters })
          data = {
            type: 'occupancy',
            unidades: unidadesRes.data || [],
            reservas: reservasRes.data || []
          }
          break
        case 'revenue':
          const pagosRes = await getPayments({ limit: 1000, ...filters })
          data = {
            type: 'revenue',
            pagos: pagosRes.data || []
          }
          break
        case 'clients':
          const clientesRes = await getClients({ limit: 1000 })
          data = {
            type: 'clients',
            clientes: clientesRes.data || []
          }
          break
        case 'reservations':
          const reservasReportRes = await getReservations({ limit: 1000, ...filters })
          data = {
            type: 'reservations',
            reservas: reservasReportRes.data || []
          }
          break
        case 'payments':
          const pagosReportRes = await getPayments({ limit: 1000, ...filters })
          data = {
            type: 'payments',
            pagos: pagosReportRes.data || []
          }
          break
        default:
          data = { type: reportType, message: 'Reporte no implementado' }
      }

      setReportData(data)
      alert(`✅ Reporte generado exitosamente\n\nTipo: ${REPORT_TYPES.find(t => t.id === reportType)?.title}\nRegistros: ${Object.values(data).filter(Array.isArray).flat().length}`)
    } catch (error) {
      console.error('Error generating report:', error)
      alert(`❌ Error al generar el reporte\n\n${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadReport = (reportType) => {
    if (!reportData) {
      alert('⚠️ Primero debes generar un reporte')
      return
    }

    try {
      // Convertir a JSON y descargar
      const dataStr = JSON.stringify(reportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `reporte_${reportData.type}_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      alert('✅ Reporte descargado exitosamente')
    } catch (error) {
      console.error('Error downloading report:', error)
      alert(`❌ Error al descargar el reporte\n\n${error.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50 to-lime-50 -m-6 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-light tracking-wide text-emerald-950">Reportes</h1>
            <p className="text-gray-700 mt-2 font-light">Genera y descarga reportes personalizados del hotel</p>
          </div>
          {reportData && (
            <Button 
              onClick={() => handleDownloadReport(reportData.type)}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:scale-105 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 shadow-lg transition-all duration-300"
            >
              <Download size={18} />
              Descargar Último Reporte
            </Button>
          )}
        </div>

        {/* Quick Stats */}
        {isLoadingStats ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-3 text-gray-700 text-sm font-light">Cargando estadísticas...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-500 p-5 rounded-3xl shadow-xl shadow-black/20 border border-emerald-400/30 transition-all duration-300 hover:scale-105">
              <p className="text-xs text-emerald-100 tracking-wide mb-1">Ingresos Totales</p>
              <p className="text-2xl font-light text-white">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-700 via-green-700 to-emerald-600 p-5 rounded-3xl shadow-xl shadow-black/20 border border-emerald-500/30 transition-all duration-300 hover:scale-105">
              <p className="text-xs text-emerald-100 tracking-wide mb-1">Reservas</p>
              <p className="text-2xl font-light text-white">{stats.totalReservations}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-800 via-green-800 to-emerald-700 p-5 rounded-3xl shadow-xl shadow-black/20 border border-emerald-600/30 transition-all duration-300 hover:scale-105">
              <p className="text-xs text-emerald-200 tracking-wide mb-1">Ocupación Prom.</p>
              <p className="text-2xl font-light text-white">{stats.averageOccupancy}%</p>
            </div>
            <div className="bg-gradient-to-br from-green-700 via-emerald-700 to-green-600 p-5 rounded-3xl shadow-xl shadow-black/20 border border-green-500/30 transition-all duration-300 hover:scale-105">
              <p className="text-xs text-emerald-100 tracking-wide mb-1">Clientes</p>
              <p className="text-2xl font-light text-white">{stats.totalClients}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-800 p-5 rounded-3xl shadow-xl shadow-black/20 border border-emerald-700/30 transition-all duration-300 hover:scale-105">
              <p className="text-xs text-emerald-200 tracking-wide mb-1">Pagos Totales</p>
              <p className="text-2xl font-light text-white">{stats.completedPayments}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-amber-500 p-5 rounded-3xl shadow-xl shadow-black/20 border border-amber-400/30 transition-all duration-300 hover:scale-105">
              <p className="text-xs text-amber-100 tracking-wide mb-1">Reservas Pendientes</p>
              <p className="text-2xl font-light text-white">{stats.pendingPayments}</p>
            </div>
          </div>
        )}

        {/* Date Range Filter */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-xl shadow-black/10 border-2 border-emerald-200/50">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="text-emerald-700" size={18} />
            <h2 className="font-medium tracking-wide text-emerald-950">Filtros de Fecha</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-12 rounded-2xl border-2 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-12 rounded-2xl border-2 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* Report Types Grid */}
        <div>
          <h2 className="text-2xl font-light tracking-wide text-emerald-950 mb-6">Tipos de Reportes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REPORT_TYPES.map(report => {
              const Icon = report.icon
              const isActive = selectedType === report.id
              return (
                <div 
                  key={report.id}
                  className={`bg-white/80 backdrop-blur-lg rounded-3xl border-2 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group ${
                    isActive ? 'border-emerald-400 ring-2 ring-emerald-200 shadow-xl scale-105' : 'border-emerald-200/50 hover:border-emerald-300'
                  }`}
                  onClick={() => !isGenerating && handleGenerateReport(report.id)}
                >
                  <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 border-2 border-emerald-200 mb-4 shadow-lg">
                    <Icon size={24} className="text-emerald-700" />
                  </div>
                  <h3 className="text-lg font-medium tracking-wide text-emerald-950 mb-2 group-hover:text-emerald-700 transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-700 font-light mb-4">
                    {report.description}
                  </p>
                  <Button 
                    disabled={isGenerating}
                    className={`w-full py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                      isActive 
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:scale-105 text-white' 
                        : 'bg-gradient-to-r from-emerald-700 to-green-700 hover:scale-105 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <FileText size={16} />
                    {isGenerating && isActive ? 'Generando...' : 'Generar Reporte'}
                  </Button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Generated Report Summary */}
        {reportData && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl shadow-black/10 border-2 border-emerald-200/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light tracking-wide text-emerald-950">Último Reporte Generado</h2>
              <span className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-medium rounded-full shadow-lg">
                ✓ Generado
              </span>
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-700 font-light mb-1">Tipo de Reporte</p>
                  <p className="font-medium text-emerald-950">
                    {REPORT_TYPES.find(t => t.id === reportData.type)?.title || reportData.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-700 font-light mb-1">Fecha de Generación</p>
                  <p className="font-medium text-emerald-950">
                    {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-700 font-light mb-1">Total de Registros</p>
                  <p className="font-medium text-emerald-950">
                    {Object.values(reportData).filter(Array.isArray).flat().length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Notice */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-3xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-lg border-2 border-emerald-200">
              <FileText className="text-emerald-700 flex-shrink-0" size={24} />
            </div>
            <div>
              <h3 className="font-medium tracking-wide text-emerald-950 mb-2">Generación de Reportes</h3>
              <p className="text-sm text-gray-700 font-light">
                Selecciona un tipo de reporte y configura el rango de fechas para generar reportes personalizados. 
                Los reportes se pueden exportar en formato PDF o Excel para análisis detallado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
