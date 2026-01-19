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
  { value: 'disponible', label: 'Disponible' },
  { value: 'ocupada', label: 'Ocupada' },
  { value: 'reservada', label: 'Reservada' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'limpieza', label: 'Limpieza' }
]

export function UnitDialog({ open, onClose, unit, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    number: '',
    type: '',
    floor: 1,
    capacity: 2,
    price: 0,
    status: 'disponible',
    description: ''
  })

  useEffect(() => {
    if (unit) {
      setFormData({
        number: unit.number || '',
        type: unit.type || '',
        floor: unit.floor || 1,
        capacity: unit.capacity || 2,
        price: unit.price || 0,
        status: unit.status || 'disponible',
        description: unit.description || ''
      })
    } else {
      setFormData({
        number: '',
        type: '',
        floor: 1,
        capacity: 2,
        price: 0,
        status: 'disponible',
        description: ''
      })
    }
  }, [unit, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.number || !formData.type || !formData.price) return

    onSave({
      id: unit?.id || Date.now().toString(),
      number: formData.number,
      type: formData.type,
      floor: formData.floor,
      capacity: formData.capacity,
      price: formData.price,
      status: formData.status,
      description: formData.description
    })
  }

  const handleDelete = () => {
    if (unit && window.confirm('¿Estás seguro de eliminar esta unidad?')) {
      onDelete(unit.id)
    }
  }

  if (!open) return null

  const isEditing = !!unit

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
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              {isEditing ? 'Editar Unidad' : 'Nueva Unidad'}
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              {isEditing
                ? 'Modifica los detalles de la unidad de alojamiento'
                : 'Completa los detalles para crear una nueva unidad'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-stone-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Room Number */}
            <div className="space-y-2">
              <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                Número de Habitación
              </label>
              <Input
                id="number"
                type="text"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="Ej: 101"
                className="h-12"
                required
              />
            </div>

            {/* Room Type */}
            <div className="space-y-2">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Tipo de Habitación
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full h-12 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                required
              >
                <option value="">Selecciona un tipo</option>
                {ROOM_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Floor */}
            <div className="space-y-2">
              <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
                Piso
              </label>
              <Input
                id="floor"
                type="number"
                min="1"
                max="20"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
                className="h-12"
                required
              />
            </div>

            {/* Capacity */}
            <div className="space-y-2">
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                Capacidad (Personas)
              </label>
              <Input
                id="capacity"
                type="number"
                min="1"
                max="10"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="h-12"
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Precio por Noche ($)
              </label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                placeholder="150.00"
                className="h-12"
                required
              />
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
                className="w-full h-12 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              >
                {STATUSES.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description - Full Width */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descripción / Características
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ej: Vista al mar, cama king size, balcón privado..."
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
                  {isEditing ? 'Guardar Cambios' : 'Crear Unidad'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
