import { useEffect, useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Textarea } from '@/shared/components/ui/Textarea'

const ROOM_TYPES = [
  'Habitación Estándar',
  'Habitación Ejecutiva',
  'Suite Deluxe',
  'Suite Presidencial'
]

const STATUSES = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'reservada', label: 'Reservada' },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'cancelada', label: 'Cancelada' }
]

export function ReservationDialog({ open, onClose, reservation, selectedDate, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    guestName: '',
    roomType: '',
    status: 'pendiente',
    checkIn: '15:00',
    checkOut: '12:00',
    guests: 1,
    notes: ''
  })

  useEffect(() => {
    if (reservation) {
      setFormData({
        guestName: reservation.guestName || '',
        roomType: reservation.room || '',
        status: reservation.status || 'pendiente',
        checkIn: reservation.checkIn || '15:00',
        checkOut: reservation.checkOut || '12:00',
        guests: reservation.guests || 1,
        notes: reservation.notes || ''
      })
    } else if (selectedDate) {
      setFormData({
        guestName: '',
        roomType: '',
        status: 'pendiente',
        checkIn: '15:00',
        checkOut: '12:00',
        guests: 1,
        notes: ''
      })
    }
  }, [reservation, selectedDate])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.guestName || !formData.roomType) return

    onSave({
      id: reservation?.id || Date.now().toString(),
      date: selectedDate || reservation?.date,
      guestName: formData.guestName,
      room: formData.roomType,
      status: formData.status,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests,
      notes: formData.notes
    })
  }

  const handleDelete = () => {
    if (reservation && window.confirm('¿Estás seguro de eliminar esta reserva?')) {
      onDelete(reservation.id)
    }
  }

  if (!open) return null

  const isEditing = !!reservation

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              {isEditing ? 'Editar Reserva' : 'Nueva Reserva'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isEditing
                ? 'Modifica los detalles de la reserva existente'
                : 'Completa los detalles para crear una nueva reserva'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Guest Name - Full Width */}
          <div className="space-y-2">
            <label htmlFor="guestName" className="block text-sm font-medium text-gray-700">
              Nombre del Huésped
            </label>
            <Input
              id="guestName"
              type="text"
              value={formData.guestName}
              onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
              placeholder="Ej: María González"
              className="h-12"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Room Type */}
            <div className="space-y-2">
              <label htmlFor="roomType" className="block text-sm font-medium text-gray-700">
                Tipo de Habitación
              </label>
              <select
                id="roomType"
                value={formData.roomType}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                className="w-full h-12 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                required
              >
                <option value="">Selecciona una habitación</option>
                {ROOM_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Estado
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full h-12 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              >
                {STATUSES.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            {/* Check-in */}
            <div className="space-y-2">
              <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700">
                Check-in
              </label>
              <Input
                id="checkIn"
                type="time"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                className="h-12"
              />
            </div>

            {/* Check-out */}
            <div className="space-y-2">
              <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700">
                Check-out
              </label>
              <Input
                id="checkOut"
                type="time"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                className="h-12"
              />
            </div>

            {/* Guests */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
                Número de Huéspedes
              </label>
              <Input
                id="guests"
                type="number"
                min="1"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                className="h-12"
              />
            </div>
          </div>

          {/* Notes - Full Width */}
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notas Adicionales
            </label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Preferencias especiales, alergias, etc."
              rows={3}
            />
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-stone-200 -mx-6 px-6 py-4">
            <div className="flex gap-3">
              {isEditing && (
                <Button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-2 bg-red-900 hover:bg-red-950 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                  <Trash2 size={16} />
                  Eliminar
                </Button>
              )}
              <div className="flex-1 flex gap-3">
                <Button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-stone-200 border border-stone-300 text-black hover:bg-stone-300 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-black hover:bg-stone-900 text-white py-2.5 rounded-lg font-medium transition-colors"
                >
                  {isEditing ? 'Guardar Cambios' : 'Crear Reserva'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
