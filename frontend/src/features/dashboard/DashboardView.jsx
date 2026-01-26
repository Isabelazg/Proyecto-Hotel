import { useState, useEffect } from 'react'
import { Calendar, DollarSign, Home, TrendingUp, Clock } from 'lucide-react'
import { getReservations } from '../reservations/services/reservations.api'
import { getPayments } from '../payments/services/payments.api'
import { getUnits } from '../units/services/units.api'

export function DashboardView() {
  const [stats, setStats] = useState({
    reservasHoy: 0,
    ingresosDia: 0,
    unidadesDisponibles: 0,
    totalUnidades: 0,
    tasaOcupacion: 0
  })
  const [reservasHoy, setReservasHoy] = useState([])
  const [proximosCheckins, setProximosCheckins] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      const hoy = new Date()
      const inicioDia = new Date(hoy.setHours(0, 0, 0, 0)).toISOString()
      const finDia = new Date(hoy.setHours(23, 59, 59, 999)).toISOString()
      const manana = new Date(new Date().setDate(new Date().getDate() + 1))
      const proximosSieteDias = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString()

      // Cargar datos en paralelo
      const [reservasRes, pagosRes, unidadesRes] = await Promise.all([
        getReservations({ limit: 1000 }),
        getPayments({ limit: 1000 }),
        getUnits({ limit: 1000 })
      ])

      const todasReservas = reservasRes.data || []
      const todosPagos = pagosRes.data || []
      const todasUnidades = unidadesRes.data || []

      // Filtrar reservas de hoy
      const reservasDeHoy = todasReservas.filter(r => {
        const fechaIngreso = new Date(r.fecha_ingreso_hora)
        return fechaIngreso.toDateString() === new Date().toDateString()
      })

      // Filtrar próximos check-ins (próximos 7 días, excluyendo hoy)
      const proximasReservas = todasReservas.filter(r => {
        const fechaIngreso = new Date(r.fecha_ingreso_hora)
        const hoyDate = new Date()
        hoyDate.setHours(0, 0, 0, 0)
        const futuroDate = new Date(hoyDate)
        futuroDate.setDate(futuroDate.getDate() + 7)
        
        return fechaIngreso > hoyDate && fechaIngreso <= futuroDate && r.estado !== 'terminada'
      }).sort((a, b) => new Date(a.fecha_ingreso_hora) - new Date(b.fecha_ingreso_hora))

      // Calcular ingresos del día (pagos de hoy)
      const ingresosHoy = todosPagos
        .filter(p => {
          // Asumiendo que los pagos no tienen fecha, usamos todos
          return true
        })
        .reduce((sum, p) => sum + parseFloat(p.valor || 0), 0)

      // Calcular unidades disponibles
      const unidadesDisponibles = todasUnidades.filter(u => u.estado === true || u.estado === 'disponible').length
      const tasaOcupacion = todasUnidades.length > 0 
        ? Math.round(((todasUnidades.length - unidadesDisponibles) / todasUnidades.length) * 100)
        : 0

      setStats({
        reservasHoy: reservasDeHoy.length,
        ingresosDia: ingresosHoy,
        unidadesDisponibles,
        totalUnidades: todasUnidades.length,
        tasaOcupacion
      })

      setReservasHoy(reservasDeHoy.slice(0, 5))
      setProximosCheckins(proximasReservas.slice(0, 5))

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (nombre, apellido) => {
    const n = nombre?.charAt(0) || ''
    const a = apellido?.charAt(0) || ''
    return (n + a).toUpperCase() || '??'
  }

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'en_ejecucion':
      case 'confirmada':
        return 'bg-gray-900 text-white'
      case 'pendiente':
        return 'bg-amber-100 text-amber-800'
      case 'terminada':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (estado) => {
    switch (estado) {
      case 'en_ejecucion':
        return 'en curso'
      case 'pendiente':
        return 'pendiente'
      case 'terminada':
        return 'finalizada'
      default:
        return estado
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return '--:--'
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const hoy = new Date()
    const manana = new Date(hoy)
    manana.setDate(manana.getDate() + 1)

    if (date.toDateString() === hoy.toDateString()) {
      return 'Hoy'
    } else if (date.toDateString() === manana.toDateString()) {
      return 'Mañana'
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    }
  }

  const calculateNights = (fechaIngreso, fechaSalida) => {
    if (!fechaIngreso || !fechaSalida) return 0
    const ingreso = new Date(fechaIngreso)
    const salida = new Date(fechaSalida)
    const diffTime = Math.abs(salida - ingreso)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Vista general de las operaciones del hotel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Reservas de Hoy */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reservas de Hoy</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.reservasHoy}</p>
              <p className="text-xs text-gray-500 mt-2">Check-ins programados</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Ingresos del Día */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">${stats.ingresosDia.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">Pagos registrados</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        {/* Unidades Disponibles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unidades Disponibles</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.unidadesDisponibles}</p>
              <p className="text-xs text-gray-500 mt-2">de {stats.totalUnidades} unidades</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Home className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Tasa de Ocupación */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasa de Ocupación</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.tasaOcupacion}%</p>
              <p className="text-xs text-gray-500 mt-2">{stats.totalUnidades - stats.unidadesDisponibles} ocupadas</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Reservas Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reservas de Hoy */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900">Reservas de Hoy</h2>
            <p className="text-sm text-gray-600 mt-1">{reservasHoy.length} check-ins programados</p>
          </div>

          {reservasHoy.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No hay reservas para hoy</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservasHoy.map(reserva => (
                <div key={reserva.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-900 text-white flex items-center justify-center font-medium text-sm">
                      {getInitials(reserva.nombre_huesped, reserva.apellido_huesped)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {reserva.nombre_huesped} {reserva.apellido_huesped}
                      </p>
                      <p className="text-sm text-gray-500">{reserva.hospedaje?.nombre || 'Sin unidad'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{formatTime(reserva.fecha_ingreso_hora)}</span>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(reserva.estado)}`}>
                      {getStatusLabel(reserva.estado)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Próximos Check-in */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900">Próximos Check-in</h2>
            <p className="text-sm text-gray-600 mt-1">Reservas confirmadas próximos días</p>
          </div>

          {proximosCheckins.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No hay reservas próximas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {proximosCheckins.map(reserva => (
                <div key={reserva.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-800 text-white flex items-center justify-center font-medium text-sm">
                      {getInitials(reserva.nombre_huesped, reserva.apellido_huesped)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {reserva.nombre_huesped} {reserva.apellido_huesped}
                      </p>
                      <p className="text-sm text-gray-500">{reserva.hospedaje?.nombre || 'Sin unidad'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{formatDate(reserva.fecha_ingreso_hora)}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {calculateNights(reserva.fecha_ingreso_hora, reserva.fecha_salida_hora)} {calculateNights(reserva.fecha_ingreso_hora, reserva.fecha_salida_hora) === 1 ? 'noche' : 'noches'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
