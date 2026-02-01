import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List } from 'lucide-react'
import { ReservationDialog } from './components/ReservationDialog'
import { useReservations } from './hooks/useReservations'

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const STATUS_CONFIG = {
  pendiente: { bg: 'bg-gradient-to-r from-amber-400 to-yellow-400 shadow-lg', text: 'text-amber-900', dot: 'bg-amber-500', label: 'Pendiente' },
  en_ejecucion: { bg: 'bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg', text: 'text-white', dot: 'bg-emerald-500', label: 'En Ejecución' },
  terminada: { bg: 'bg-gradient-to-r from-lime-400 to-green-400 shadow-lg', text: 'text-green-900', dot: 'bg-lime-500', label: 'Terminada' }
}

export function ReservationsView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('monthly')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  
  const { reservations, isLoading, error, create, update, remove, refetch } = useReservations()

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Días del mes anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const getReservationsForDay = (date) => {
    if (!date) return []
    return reservations.filter(res => {
      const resDate = new Date(res.fecha_ingreso_hora)
      return resDate.toDateString() === date.toDateString()
    })
  }

  const handleCreateReservation = (date) => {
    setSelectedDate(date)
    setSelectedReservation(null)
    setDialogOpen(true)
  }

  const handleEditReservation = (reservation) => {
    setSelectedReservation(reservation)
    setSelectedDate(new Date(reservation.fecha_ingreso_hora))
    setDialogOpen(true)
  }

  const handleSaveReservation = async (reservationData) => {
    try {
      if (selectedReservation) {
        await update(selectedReservation.id, reservationData)
      } else {
        await create(reservationData)
      }
      setDialogOpen(false)
      setSelectedReservation(null)
      setSelectedDate(null)
    } catch (err) {
      console.error('Error saving reservation:', err)
      alert(err.message || 'Error al guardar la reserva')
    }
  }

  const handleDeleteReservation = async (id) => {
    try {
      await remove(id)
      setDialogOpen(false)
      setSelectedReservation(null)
      setSelectedDate(null)
    } catch (err) {
      console.error('Error deleting reservation:', err)
      alert(err.message || 'Error al eliminar la reserva')
    }
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const previousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const nextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const getWeekDays = (date) => {
    const dayOfWeek = date.getDay()
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - dayOfWeek)
    
    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      weekDays.push(day)
    }
    return weekDays
  }

  const days = view === 'weekly' ? getWeekDays(currentDate) : getDaysInMonth(currentDate)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-light">Cargando reservas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 font-light">Error: {error}</p>
          <button
            onClick={refetch}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50 to-lime-50 -m-6 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-light tracking-wide text-emerald-950">Calendario de Reservas</h1>
            <p className="text-gray-700 mt-2 font-light">Gestiona todas tus reservas de experiencias de lujo</p>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-lg border-2 border-emerald-200 rounded-full p-1.5 shadow-lg">
            <button
              onClick={() => setView('monthly')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                view === 'monthly'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg scale-105'
                  : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <CalendarIcon size={16} />
              Mensual
            </button>
            <button
              onClick={() => setView('weekly')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                view === 'weekly'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg scale-105'
                  : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <List size={16} />
              Semanal
            </button>
          </div>
        </div>

        {/* Estados Legend */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl shadow-black/10 border-2 border-emerald-200/50 p-6">
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-emerald-900 tracking-wide">Estados:</span>
            <div className="flex items-center gap-6">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${config.dot} shadow-lg`}></div>
                  <span className="text-sm text-gray-700 font-light">{config.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl shadow-black/10 border-2 border-emerald-200/50 overflow-hidden">
          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-green-900 to-emerald-800 px-6 py-5">
            <div className="flex items-center justify-between">
              <button
                onClick={view === 'weekly' ? previousWeek : previousMonth}
                className="p-2.5 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-md"
              >
                <ChevronLeft size={20} className="text-emerald-100" />
              </button>
              
              <h2 className="text-2xl font-light tracking-wide text-white">
                {view === 'weekly' 
                  ? `Semana del ${days[0]?.getDate()} ${MONTHS[days[0]?.getMonth()]} - ${days[6]?.getDate()} ${MONTHS[days[6]?.getMonth()]} ${currentDate.getFullYear()}`
                  : `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                }
              </h2>
              
              <button
                onClick={view === 'weekly' ? nextWeek : nextMonth}
                className="p-2.5 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-md"
              >
                <ChevronRight size={20} className="text-emerald-100" />
              </button>
            </div>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 border-b-2 border-emerald-100 bg-emerald-50/30">
            {DAYS.map(day => (
              <div
                key={day}
                className="py-3 text-center text-sm font-medium text-emerald-900 tracking-wide border-r border-emerald-100 last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className={view === 'weekly' ? 'grid grid-cols-7' : 'grid grid-cols-7'}>
            {days.map((date, index) => {
              const reservations = getReservationsForDay(date)
              const isToday = date && date.toDateString() === new Date().toDateString()
              
              return (
                <div
                  key={index}
                  className={`${view === 'weekly' ? 'min-h-[200px]' : 'min-h-[120px]'} border-r border-b border-emerald-100 last:border-r-0 p-3 transition-all duration-300 ${
                    date ? 'bg-white/50 hover:bg-emerald-50/50 cursor-pointer hover:shadow-inner' : 'bg-stone-100/30'
                  } ${isToday ? 'bg-gradient-to-br from-emerald-50 to-lime-50' : ''}`}
                  onClick={() => date && handleCreateReservation(date)}
                >
                  {date && (
                    <>
                      <div className={`text-sm font-medium mb-2 ${
                        isToday
                          ? 'w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-green-600 text-white flex items-center justify-center shadow-lg'
                          : 'text-emerald-900'
                      }`}>
                        {date.getDate()}
                      </div>
                      
                      {/* Reservations for this day */}
                      <div className="space-y-1.5">
                        {reservations.map(reservation => {
                          const statusConfig = STATUS_CONFIG[reservation.estado] || STATUS_CONFIG.pendiente
                          const hospedajeName = reservation.hospedaje?.nombre || 'Sin hospedaje'
                          return (
                            <div
                              key={reservation.id}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditReservation(reservation)
                              }}
                              className={`${statusConfig.bg} ${statusConfig.text} px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer hover:scale-105 transition-all duration-300`}
                            >
                              <div className="font-semibold truncate">{reservation.numero_reserva}</div>
                              <div className="text-xs truncate opacity-90">{hospedajeName}</div>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
            </div>
        </div>

          {/* Reservation Dialog */}
        <ReservationDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false)
            setSelectedReservation(null)
            setSelectedDate(null)
          }}
          reservation={selectedReservation}
          selectedDate={selectedDate}
          onSave={handleSaveReservation}
          onDelete={handleDeleteReservation}
        />
      </div>
    </div>
  )
}
