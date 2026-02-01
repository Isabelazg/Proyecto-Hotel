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
        return 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg'
      case 'pendiente':
        return 'bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 shadow-lg'
      case 'terminada':
        return 'bg-gradient-to-r from-lime-400 to-green-400 text-green-900 shadow-lg'
      default:
        return 'bg-gradient-to-r from-stone-300 to-gray-300 text-gray-800 shadow-lg'
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Cargando dashboard...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50 to-lime-50 -m-6 p-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light tracking-wide text-emerald-950">Dashboard</h1>
          <p className="text-gray-700 mt-2 font-light">Vista general de las operaciones del hotel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Reservas de Hoy */}
          <div className="bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-800 rounded-3xl shadow-xl shadow-black/20 p-6 backdrop-blur-lg border border-emerald-700/30 transition-all duration-300 hover:scale-105">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-200 tracking-wide">Reservas de Hoy</p>
                <p className="text-4xl font-light text-white mt-3">{stats.reservasHoy}</p>
                <p className="text-xs text-emerald-300 mt-3 font-light">Check-ins programados</p>
              </div>
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <Calendar className="h-6 w-6 text-lime-300" />
              </div>
            </div>
          </div>

          {/* Ingresos del Día */}
          <div className="bg-gradient-to-br from-green-900 via-emerald-900 to-green-800 rounded-3xl shadow-xl shadow-black/20 p-6 backdrop-blur-lg border border-emerald-700/30 transition-all duration-300 hover:scale-105">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-200 tracking-wide">Ingresos Totales</p>
                <p className="text-4xl font-light text-white mt-3">${stats.ingresosDia.toLocaleString()}</p>
                <p className="text-xs text-emerald-300 mt-3 font-light">Pagos registrados</p>
              </div>
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <DollarSign className="h-6 w-6 text-lime-300" />
              </div>
            </div>
          </div>

          {/* Unidades Disponibles */}
          <div className="bg-gradient-to-br from-emerald-800 via-green-900 to-emerald-900 rounded-3xl shadow-xl shadow-black/20 p-6 backdrop-blur-lg border border-emerald-700/30 transition-all duration-300 hover:scale-105">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-200 tracking-wide">Unidades Disponibles</p>
                <p className="text-4xl font-light text-white mt-3">{stats.unidadesDisponibles}</p>
                <p className="text-xs text-emerald-300 mt-3 font-light">de {stats.totalUnidades} unidades</p>
              </div>
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <Home className="h-6 w-6 text-lime-300" />
              </div>
            </div>
          </div>

          {/* Tasa de Ocupación */}
          <div className="bg-gradient-to-br from-green-800 via-emerald-900 to-green-900 rounded-3xl shadow-xl shadow-black/20 p-6 backdrop-blur-lg border border-emerald-700/30 transition-all duration-300 hover:scale-105">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-200 tracking-wide">Tasa de Ocupación</p>
                <p className="text-4xl font-light text-white mt-3">{stats.tasaOcupacion}%</p>
                <p className="text-xs text-emerald-300 mt-3 font-light">{stats.totalUnidades - stats.unidadesDisponibles} ocupadas</p>
              </div>
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <TrendingUp className="h-6 w-6 text-lime-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Reservas Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reservas de Hoy */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl shadow-black/10 border-2 border-emerald-200/50 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-light tracking-wide text-emerald-950">Reservas de Hoy</h2>
              <p className="text-sm text-gray-700 mt-2 font-light">{reservasHoy.length} check-ins programados</p>
            </div>

            {reservasHoy.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex p-4 bg-emerald-50 rounded-3xl mb-4">
                  <Calendar className="h-12 w-12 text-emerald-400" />
                </div>
                <p className="text-gray-600 text-sm font-light">No hay reservas para hoy</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reservasHoy.map(reserva => (
                  <div key={reserva.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50/50 to-green-50/50 border-2 border-emerald-100 rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-green-600 text-white flex items-center justify-center font-medium text-sm shadow-lg">
                        {getInitials(reserva.nombre_huesped, reserva.apellido_huesped)}
                      </div>
                      <div>
                        <p className="font-medium text-emerald-950">
                          {reserva.nombre_huesped} {reserva.apellido_huesped}
                        </p>
                        <p className="text-sm text-gray-600 font-light">{reserva.hospedaje?.nombre || 'Sin unidad'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-emerald-700 bg-white/60 px-3 py-1.5 rounded-full">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">{formatTime(reserva.fecha_ingreso_hora)}</span>
                      </div>
                      <span className={`px-4 py-1.5 text-xs font-medium rounded-full ${getStatusColor(reserva.estado)}`}>
                        {getStatusLabel(reserva.estado)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Próximos Check-in */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl shadow-black/10 border-2 border-emerald-200/50 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-light tracking-wide text-emerald-950">Próximos Check-in</h2>
              <p className="text-sm text-gray-700 mt-2 font-light">Reservas confirmadas próximos días</p>
            </div>

            {proximosCheckins.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex p-4 bg-emerald-50 rounded-3xl mb-4">
                  <Calendar className="h-12 w-12 text-emerald-400" />
                </div>
                <p className="text-gray-600 text-sm font-light">No hay reservas próximas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {proximosCheckins.map(reserva => (
                  <div key={reserva.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50/50 to-green-50/50 border-2 border-emerald-100 rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white flex items-center justify-center font-medium text-sm shadow-lg">
                        {getInitials(reserva.nombre_huesped, reserva.apellido_huesped)}
                      </div>
                      <div>
                        <p className="font-medium text-emerald-950">
                          {reserva.nombre_huesped} {reserva.apellido_huesped}
                        </p>
                        <p className="text-sm text-gray-600 font-light">{reserva.hospedaje?.nombre || 'Sin unidad'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-emerald-700 bg-white/60 px-3 py-1.5 rounded-full">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-medium">{formatDate(reserva.fecha_ingreso_hora)}</span>
                      </div>
                      <span className="text-sm text-gray-700 font-light bg-white/60 px-3 py-1.5 rounded-full">
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
    </div>
  )
}
