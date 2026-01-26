import { useEffect, useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Textarea } from '@/shared/components/ui/Textarea'
import { getTiposHospedaje } from '../services/tipoHospedaje.api'

const STATUSES = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'ocupado', label: 'Ocupado' },
  { value: 'mantenimiento', label: 'Mantenimiento' }
]

export function UnitDialog({ open, onClose, unit, onSave, onDelete }) {
  const [tiposHospedaje, setTiposHospedaje] = useState([])
  const [formData, setFormData] = useState({
    nombre: '',
    tipo_hospedaje_id: '',
    capacidad: 2,
    precio: '',
    estado: 'disponible',
    descripcion: ''
  })
  const [errors, setErrors] = useState({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (open) {
      loadTiposHospedaje()
    }
  }, [open])

  const loadTiposHospedaje = async () => {
    try {
      const response = await getTiposHospedaje({ limit: 100 })
      setTiposHospedaje(response.data || [])
    } catch (error) {
      console.error('Error loading tipos hospedaje:', error)
    }
  }

  useEffect(() => {
    if (unit) {
      setFormData({
        nombre: unit.nombre || '',
        tipo_hospedaje_id: unit.tipo_hospedaje_id || unit.tipo_hospedaje?.id || '',
        capacidad: unit.capacidad || 2,
        precio: unit.precio || '',
        estado: unit.estado || 'disponible',
        descripcion: unit.descripcion || ''
      })
    } else {
      setFormData({
        nombre: '',
        tipo_hospedaje_id: '',
        capacidad: 2,
        precio: '',
        estado: 'disponible',
        descripcion: ''
      })
    }
    setErrors({})
    setShowDeleteConfirm(false)
  }, [unit, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newErrors = {}
    
    if (!formData.nombre || !formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    } else if (formData.nombre.length > 50) {
      newErrors.nombre = 'El nombre no puede exceder 50 caracteres'
    }
    
    if (!formData.tipo_hospedaje_id) {
      newErrors.tipo_hospedaje_id = 'El tipo de hospedaje es requerido'
    }
    
    if (!formData.capacidad || formData.capacidad < 1) {
      newErrors.capacidad = 'La capacidad debe ser al menos 1'
    } else if (formData.capacidad > 20) {
      newErrors.capacidad = 'La capacidad no puede exceder 20 personas'
    }
    
    if (!formData.precio || formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0'
    }
    
    if (formData.descripcion && formData.descripcion.length > 255) {
      newErrors.descripcion = 'La descripción no puede exceder 255 caracteres'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      
      const firstErrorField = Object.keys(newErrors)[0]
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => element.focus(), 300)
      }
      return
    }

    const dataToSend = {
      nombre: formData.nombre.trim(),
      tipo_hospedaje_id: parseInt(formData.tipo_hospedaje_id),
      capacidad: parseInt(formData.capacidad),
      precio: parseFloat(formData.precio),
      estado: formData.estado,
      descripcion: formData.descripcion?.trim() || null
    }

    onSave(dataToSend)
  }

  const confirmDelete = () => {
    if (unit) {
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
            {/* Nombre */}
            <div className="space-y-2">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre de la Unidad
              </label>
              <Input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Habitación 101"
                className="h-12"
              />
              {errors.nombre && <p className="text-red-600 text-sm">{errors.nombre}</p>}
            </div>

            {/* Tipo Hospedaje */}
            <div className="space-y-2">
              <label htmlFor="tipo_hospedaje_id" className="block text-sm font-medium text-gray-700">
                Tipo de Hospedaje
              </label>
              <select
                id="tipo_hospedaje_id"
                value={formData.tipo_hospedaje_id}
                onChange={(e) => setFormData({ ...formData, tipo_hospedaje_id: e.target.value })}
                className="w-full h-12 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              >
                <option value="">Selecciona un tipo</option>
                {tiposHospedaje.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
              {errors.tipo_hospedaje_id && <p className="text-red-600 text-sm">{errors.tipo_hospedaje_id}</p>}
            </div>

            {/* Capacidad */}
            <div className="space-y-2">
              <label htmlFor="capacidad" className="block text-sm font-medium text-gray-700">
                Capacidad (Personas)
              </label>
              <Input
                id="capacidad"
                type="number"
                min="1"
                max="20"
                value={formData.capacidad}
                onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
                className="h-12"
              />
              {errors.capacidad && <p className="text-red-600 text-sm">{errors.capacidad}</p>}
            </div>

            {/* Precio */}
            <div className="space-y-2">
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
                Precio por Noche ($)
              </label>
              <Input
                id="precio"
                type="number"
                min="0"
                step="0.01"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                placeholder="150.00"
                className="h-12"
              />
              {errors.precio && <p className="text-red-600 text-sm">{errors.precio}</p>}
            </div>

            {/* Estado */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                Estado
              </label>
              <select
                id="estado"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full h-12 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              >
                {STATUSES.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Descripción - Full Width */}
          <div className="space-y-2">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
              Descripción / Características
            </label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Ej: Vista al mar, cama king size, balcón privado..."
              rows={3}
            />
            {errors.descripcion && <p className="text-red-600 text-sm">{errors.descripcion}</p>}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-stone-200 -mx-6 px-6 py-4">
            <div className="flex gap-3">
              {isEditing && (
                <Button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/60"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md mx-4 z-70">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
                <p className="text-sm text-gray-600 mt-1">
                  ¿Estás seguro de que deseas eliminar esta unidad? Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-stone-200 border border-stone-300 text-black hover:bg-stone-300 py-2.5 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition-colors"
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
