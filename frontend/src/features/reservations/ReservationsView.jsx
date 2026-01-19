import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List } from 'lucide-react'
import { ReservationDialog } from './components/ReservationDialog'

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

// Mock data de reservas (ahora será editable)
const initialReservations = [
  {
    id: '1',
    date: new Date(2026, 0, 8),
    guestName: 'Mario Díaz',
    room: 'Habitación Ejecutiva',
    status: 'reservada',
    checkIn: '14:00',
    checkOut: '12:00',
    guests: 2,
    notes: ''
  },
  {
    id: '2',
    date: new Date(2026, 0, 12),
    guestName: 'Laura Fernández',
    room: 'Suite 201',
    status: 'confirmada',
    checkIn: '15:00',
    checkOut: '11:00',
    guests: 1,
    notes: ''
  },
  {
    id: '3',
    date: new Date(2026, 0, 15),
    guestName: 'Carlos Rodríguez',
    room: 'Habitación Deluxe',
    status: 'pendiente',
    checkIn: '15:30',
    checkOut: '12:00',
    guests: 3,
    notes: ''
  },
  {
    id: '4',
    date: new Date(2026, 0, 20),
    guestName: 'Ana Martínez',
    room: 'Suite Premium',
    status: 'cancelada',
    checkIn: '16:00',
    checkOut: '12:00',
    guests: 2,
    notes: ''
  }
]

const STATUS_CONFIG = {
  confirmada: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  reservada: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
  pendiente: { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
  cancelada: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' }
}

export function ReservationsView() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1))
  const [view, setView] = useState('monthly')
  const [reservations, setReservations] = useState(initialReservations)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

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
    return reservations.filter(res => 
      res.date.toDateString() === date.toDateString()
    )
  }

  const handleCreateReservation = (date) => {
    setSelectedDate(date)
    setSelectedReservation(null)
    setDialogOpen(true)
  }

  const handleEditReservation = (reservation) => {
    setSelectedReservation(reservation)
    setSelectedDate(reservation.date)
    setDialogOpen(true)
  }

  const handleSaveReservation = (reservation) => {
    if (selectedReservation) {
      // Editar reserva existente
      setReservations(prev => 
        prev.map(r => r.id === reservation.id ? reservation : r)
      )
    } else {
      // Crear nueva reserva
      setReservations(prev => [...prev, reservation])
    }
    setDialogOpen(false)
    setSelectedReservation(null)
    setSelectedDate(null)
  }

  const handleDeleteReservation = (id) => {
    setReservations(prev => prev.filter(r => r.id !== id))
    setDialogOpen(false)
    setSelectedReservation(null)
    setSelectedDate(null)
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const days = getDaysInMonth(currentDate)

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
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Confirmada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-gray-600">Reservada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-sm text-gray-600">Pendiente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">Cancelada</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-stone-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button
              onClick={nextMonth}
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
        <div className="grid grid-cols-7">
          {days.map((date, index) => {
            const reservations = getReservationsForDay(date)
            const isToday = date && date.toDateString() === new Date().toDateString()
            
            return (
              <div
                key={index}
                className={`min-h-[120px] border-r border-b border-gray-200 last:border-r-0 p-2 ${
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
                        const statusConfig = STATUS_CONFIG[reservation.status]
                        return (
                          <div
                            key={reservation.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditReservation(reservation)
                            }}
                            className={`${statusConfig.bg} ${statusConfig.text} px-2 py-1 rounded text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity`}
                          >
                            <div className="font-semibold truncate">{reservation.guestName}</div>
                            <div className="text-xs truncate">{reservation.room}</div>
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
