import { useState } from 'react'
import { Calendar, Download, FileText, TrendingUp, Users, DollarSign, Home, BarChart3, Filter } from 'lucide-react'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'

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

const MOCK_STATS = {
  totalRevenue: 125800,
  totalReservations: 156,
  averageOccupancy: 78,
  totalClients: 89,
  completedPayments: 142,
  pendingPayments: 14
}

const MOCK_RECENT_REPORTS = [
  { id: 1, name: 'Ocupación Enero 2026', type: 'occupancy', date: '2026-01-20', generatedBy: 'Admin' },
  { id: 2, name: 'Ingresos Q4 2025', type: 'revenue', date: '2026-01-15', generatedBy: 'Admin' },
  { id: 3, name: 'Clientes Frecuentes 2025', type: 'clients', date: '2026-01-10', generatedBy: 'Admin' },
]

export function ReportsView() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedType, setSelectedType] = useState(null)

  const handleGenerateReport = (reportType) => {
    setSelectedType(reportType)
    // Aquí iría la lógica para generar el reporte
    console.log('Generando reporte:', reportType)
  }

  const handleDownloadReport = (reportId) => {
    // Aquí iría la lógica para descargar el reporte
    console.log('Descargando reporte:', reportId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Reportes</h1>
          <p className="text-stone-600 mt-1">Genera y descarga reportes personalizados del hotel</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <p className="text-xs text-green-800 font-medium mb-1">Ingresos Totales</p>
          <p className="text-2xl font-bold text-green-900">${MOCK_STATS.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <p className="text-xs text-blue-800 font-medium mb-1">Reservas</p>
          <p className="text-2xl font-bold text-blue-900">{MOCK_STATS.totalReservations}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
          <p className="text-xs text-amber-800 font-medium mb-1">Ocupación Prom.</p>
          <p className="text-2xl font-bold text-amber-900">{MOCK_STATS.averageOccupancy}%</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <p className="text-xs text-purple-800 font-medium mb-1">Clientes</p>
          <p className="text-2xl font-bold text-purple-900">{MOCK_STATS.totalClients}</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
          <p className="text-xs text-indigo-800 font-medium mb-1">Pagos Completados</p>
          <p className="text-2xl font-bold text-indigo-900">{MOCK_STATS.completedPayments}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <p className="text-xs text-red-800 font-medium mb-1">Pagos Pendientes</p>
          <p className="text-2xl font-bold text-red-900">{MOCK_STATS.pendingPayments}</p>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white p-5 rounded-xl border border-stone-200">
        <div className="flex items-center gap-3 mb-3">
          <Filter className="text-stone-600" size={18} />
          <h2 className="font-semibold text-gray-900">Filtros de Fecha</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-11"
            />
          </div>
        </div>
      </div>

      {/* Report Types Grid */}
      <div>
        <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">Tipos de Reportes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORT_TYPES.map(report => {
            const Icon = report.icon
            return (
              <div 
                key={report.id}
                className="bg-white rounded-xl border border-stone-200 p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handleGenerateReport(report.id)}
              >
                <div className={`inline-flex p-3 rounded-lg border ${report.color} mb-4`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-900 transition-colors">
                  {report.title}
                </h3>
                <p className="text-sm text-stone-600 mb-4">
                  {report.description}
                </p>
                <Button className="w-full bg-black hover:bg-stone-900 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2">
                  <FileText size={16} />
                  Generar Reporte
                </Button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-bold text-gray-900">Reportes Recientes</h2>
          <span className="text-sm text-stone-600">{MOCK_RECENT_REPORTS.length} reportes</span>
        </div>
        <div className="space-y-3">
          {MOCK_RECENT_REPORTS.map(report => {
            const reportType = REPORT_TYPES.find(t => t.id === report.type)
            const Icon = reportType?.icon || FileText
            return (
              <div 
                key={report.id}
                className="flex items-center justify-between p-4 bg-stone-50 rounded-lg border border-stone-200 hover:border-amber-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg border ${reportType?.color || 'bg-gray-50 border-gray-200 text-gray-800'}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{report.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-stone-600 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(report.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-xs text-stone-600">•</span>
                      <span className="text-xs text-stone-600">{report.generatedBy}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleDownloadReport(report.id)}
                  className="bg-stone-200 hover:bg-stone-300 text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                  <Download size={16} />
                  Descargar
                </Button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <FileText className="text-amber-700 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-amber-900 mb-1">Generación de Reportes</h3>
            <p className="text-sm text-amber-800">
              Selecciona un tipo de reporte y configura el rango de fechas para generar reportes personalizados. 
              Los reportes se pueden exportar en formato PDF o Excel para análisis detallado.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
