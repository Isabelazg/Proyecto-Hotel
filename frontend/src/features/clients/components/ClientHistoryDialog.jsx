import { X, Calendar, MapPin, Users, Clock, DollarSign } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'

const MOCK_RESERVATIONS = [
  { id: 1, checkIn: '2026-02-15', checkOut: '2026-02-18', room: 'Suite Deluxe 201', guests: 2, status: 'confirmada', total: 1200, nights: 3 },
  { id: 2, checkIn: '2025-12-20', checkOut: '2025-12-25', room: 'Habitación Ejecutiva 103', guests: 2, status: 'completada', total: 1250, nights: 5 },
  { id: 3, checkIn: '2025-08-10', checkOut: '2025-08-15', room: 'Suite Presidencial 301', guests: 4, status: 'completada', total: 4000, nights: 5 },
  { id: 4, checkIn: '2025-06-05', checkOut: '2025-06-08', room: 'Habitación Estándar 101', guests: 2, status: 'completada', total: 450, nights: 3 },
  { id: 5, checkIn: '2025-03-15', checkOut: '2025-03-20', room: 'Suite Deluxe 202', guests: 3, status: 'completada', total: 2000, nights: 5 },
]

const STATUS_CONFIG = {
  confirmada: { label: 'Confirmada', color: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg' },
  pendiente: { label: 'Pendiente', color: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 shadow-lg' },
  completada: { label: 'Completada', color: 'bg-gradient-to-r from-lime-400 to-green-400 text-green-900 shadow-lg' },
  cancelada: { label: 'Cancelada', color: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' },
}

export function ClientHistoryDialog({ open, onClose, client }) {
  if (!open) return null

  const totalSpent = MOCK_RESERVATIONS.reduce((sum, r) => sum + r.total, 0)
  const totalNights = MOCK_RESERVATIONS.reduce((sum, r) => sum + r.nights, 0)
  const completedReservations = MOCK_RESERVATIONS.filter(r => r.status === 'completada').length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-white to-emerald-50/30 rounded-3xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto border-2 border-emerald-200">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-900 via-green-900 to-emerald-800 px-8 py-6 rounded-t-3xl z-10 border-b-2 border-emerald-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-light tracking-wide text-white">
                Historial de Reservas
              </h2>
              <p className="text-sm text-emerald-100 mt-2 font-light">
                Cliente: <span className="font-medium text-white">{client?.name}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-md"
            >
              <X size={20} className="text-emerald-100" />
            </button>
          </div>
        </div>

        {/* Client Summary Stats */}
        <div className="p-8 border-b-2 border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-green-50/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-500 p-5 rounded-3xl shadow-xl shadow-black/20 border border-emerald-400/30 transition-all duration-300 hover:scale-105">
              <p className="text-xs text-emerald-100 uppercase tracking-wide">Total Reservas</p>
              <p className="text-3xl font-light text-white mt-2">{MOCK_RESERVATIONS.length}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-700 via-green-700 to-emerald-600 p-5 rounded-3xl shadow-xl shadow-black/20 border border-emerald-500/30 transition-all duration-300 hover:scale-105">
              <p className="text-xs text-emerald-100 uppercase tracking-wide">Completadas</p>
              <p className="text-3xl font-light text-white mt-2">{completedReservations}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-800 via-green-800 to-emerald-700 p-5 rounded-3xl shadow-xl shadow-black/20 border border-emerald-600/30 transition-all duration-300 hover:scale-105">
              <p className="text-xs text-emerald-200 uppercase tracking-wide">Total Noches</p>
              <p className="text-3xl font-light text-white mt-2">{totalNights}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-800 p-5 rounded-3xl shadow-xl shadow-black/20 border border-emerald-700/30 transition-all duration-300 hover:scale-105">
              <p className="text-xs text-emerald-200 uppercase tracking-wide">Total Gastado</p>
              <p className="text-3xl font-light text-white mt-2">${totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Reservations List */}
        <div className="p-8 space-y-5">
          {MOCK_RESERVATIONS.length === 0 ? (
            <div className="text-center py-16 text-gray-600">
              <div className="inline-flex p-5 bg-emerald-50 rounded-3xl mb-5 border-2 border-emerald-200">
                <Calendar size={48} className="text-emerald-400" />
              </div>
              <p className="font-light">No hay reservas registradas para este cliente</p>
            </div>
          ) : (
            MOCK_RESERVATIONS.map(reservation => (
              <div 
                key={reservation.id}
                className="bg-white/80 backdrop-blur-lg border-2 border-emerald-200/50 rounded-3xl p-6 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    {/* Room and Status */}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-2xl border-2 border-emerald-200">
                          <MapPin size={18} className="text-emerald-700" />
                        </div>
                        <h3 className="font-medium text-emerald-950 text-lg tracking-wide">{reservation.room}</h3>
                      </div>
                      <span className={`inline-flex px-4 py-1.5 text-xs font-medium rounded-full ${STATUS_CONFIG[reservation.status].color}`}>
                        {STATUS_CONFIG[reservation.status].label}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={16} className="text-emerald-600" />
                        <div>
                          <p className="text-xs text-gray-600 font-light">Check-in</p>
                          <p className="font-medium text-emerald-900">{new Date(reservation.checkIn).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={16} className="text-emerald-600" />
                        <div>
                          <p className="text-xs text-gray-600 font-light">Check-out</p>
                          <p className="font-medium text-emerald-900">{new Date(reservation.checkOut).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock size={16} className="text-emerald-600" />
                        <div>
                          <p className="text-xs text-gray-600 font-light">Noches</p>
                          <p className="font-medium text-emerald-900">{reservation.nights}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users size={16} className="text-emerald-600" />
                        <div>
                          <p className="text-xs text-gray-600 font-light">Huéspedes</p>
                          <p className="font-medium text-emerald-900">{reservation.guests}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="flex items-center gap-3 bg-gradient-to-br from-emerald-50 to-green-50 px-5 py-4 rounded-2xl border-2 border-emerald-200 shadow-lg">
                    <div className="p-2 bg-white rounded-full shadow-md">
                      <DollarSign size={20} className="text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-700 font-light">Total</p>
                      <p className="text-2xl font-medium text-emerald-900">${reservation.total}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-emerald-50 to-green-50 border-t-2 border-emerald-200 px-8 py-5 rounded-b-3xl">
          <div className="flex justify-end">
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-stone-300 to-gray-300 text-gray-800 hover:scale-105 py-3 px-8 rounded-full font-medium transition-all duration-300 shadow-lg"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
