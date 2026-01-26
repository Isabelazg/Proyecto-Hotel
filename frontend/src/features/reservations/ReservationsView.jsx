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
  pendiente: { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500', label: 'Pendiente' },
  en_ejecucion: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: 'En Ejecución' },
  terminada: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500', label: 'Terminada' }
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando reservas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Calendario de Reservas</h1>
          <p className="text-gray-600 mt-1">Gestiona todas tus reservas de experiencias de lujo</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
          <button
            onClick={() => setView('monthly')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === 'monthly'
                ? 'bg-amber-900 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CalendarIcon size={16} />
            Mensual
          </button>
          <button
            onClick={() => setView('weekly')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === 'weekly'
                ? 'bg-amber-900 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List size={16} />
            Semanal
          </button>
        </div>
      </div>

      {/* Estados Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-gray-700">Estados:</span>
          <div className="flex items-center gap-4">
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${config.dot}`}></div>
                <span className="text-sm text-gray-600">{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-stone-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={view === 'weekly' ? previousWeek : previousMonth}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              {view === 'weekly' 
                ? `Semana del ${days[0]?.getDate()} ${MONTHS[days[0]?.getMonth()]} - ${days[6]?.getDate()} ${MONTHS[days[6]?.getMonth()]} ${currentDate.getFullYear()}`
                : `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
              }
            </h2>
            
            <button
              onClick={view === 'weekly' ? nextWeek : nextMonth}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {DAYS.map(day => (
            <div
              key={day}
              className="py-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200 last:border-r-0"
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
                className={`${view === 'weekly' ? 'min-h-[200px]' : 'min-h-[120px]'} border-r border-b border-gray-200 last:border-r-0 p-2 ${
                  date ? 'bg-white hover:bg-stone-50 cursor-pointer' : 'bg-gray-50'
                } ${isToday ? 'bg-amber-50' : ''}`}
                onClick={() => date && handleCreateReservation(date)}
              >
                {date && (
                  <>
                    <div className={`text-sm font-medium mb-2 ${
                      isToday
                        ? 'w-7 h-7 rounded-full bg-amber-900 text-white flex items-center justify-center'
                        : 'text-gray-700'
                    }`}>
                      {date.getDate()}
                    </div>
                    
                    {/* Reservations for this day */}
                    <div className="space-y-1">
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
                            className={`${statusConfig.bg} ${statusConfig.text} px-2 py-1 rounded text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity`}
                          >
                            <div className="font-semibold truncate">{reservation.numero_reserva}</div>
                            <div className="text-xs truncate">{hospedajeName}</div>
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
  )
}
