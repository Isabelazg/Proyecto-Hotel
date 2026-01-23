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
  confirmada: { label: 'Confirmada', color: 'bg-green-100 text-green-800 border-green-200' },
  pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  completada: { label: 'Completada', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  cancelada: { label: 'Cancelada', color: 'bg-red-100 text-red-800 border-red-200' },
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
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                Historial de Reservas
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                Cliente: <span className="font-semibold text-gray-900">{client?.name}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-stone-600" />
            </button>
          </div>
        </div>

        {/* Client Summary Stats */}
        <div className="p-6 border-b border-stone-200 bg-stone-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <p className="text-xs text-stone-600 uppercase tracking-wide">Total Reservas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{MOCK_RESERVATIONS.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <p className="text-xs text-stone-600 uppercase tracking-wide">Completadas</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{completedReservations}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <p className="text-xs text-stone-600 uppercase tracking-wide">Total Noches</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalNights}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <p className="text-xs text-stone-600 uppercase tracking-wide">Total Gastado</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">${totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Reservations List */}
        <div className="p-6 space-y-4">
          {MOCK_RESERVATIONS.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <Calendar size={48} className="mx-auto mb-4 text-stone-300" />
              <p>No hay reservas registradas para este cliente</p>
            </div>
          ) : (
            MOCK_RESERVATIONS.map(reservation => (
              <div 
                key={reservation.id}
                className="bg-white border border-stone-200 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Room and Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-amber-600" />
                        <h3 className="font-semibold text-gray-900 text-lg">{reservation.room}</h3>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${STATUS_CONFIG[reservation.status].color}`}>
                        {STATUS_CONFIG[reservation.status].label}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-stone-700">
                        <Calendar size={16} className="text-stone-400" />
                        <div>
                          <p className="text-xs text-stone-500">Check-in</p>
                          <p className="font-medium">{new Date(reservation.checkIn).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-stone-700">
                        <Calendar size={16} className="text-stone-400" />
                        <div>
                          <p className="text-xs text-stone-500">Check-out</p>
                          <p className="font-medium">{new Date(reservation.checkOut).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-stone-700">
                        <Clock size={16} className="text-stone-400" />
                        <div>
                          <p className="text-xs text-stone-500">Noches</p>
                          <p className="font-medium">{reservation.nights}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-stone-700">
                        <Users size={16} className="text-stone-400" />
                        <div>
                          <p className="text-xs text-stone-500">Huéspedes</p>
                          <p className="font-medium">{reservation.guests}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="flex items-center gap-2 bg-stone-50 px-4 py-3 rounded-lg border border-stone-200">
                    <DollarSign size={20} className="text-stone-600" />
                    <div>
                      <p className="text-xs text-stone-600">Total</p>
                      <p className="text-xl font-bold text-gray-900">${reservation.total}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-stone-200 px-6 py-4">
          <div className="flex justify-end">
            <Button
              onClick={onClose}
              className="bg-stone-200 border border-stone-300 text-black hover:bg-stone-300 py-2.5 px-6 rounded-lg font-medium transition-colors"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
