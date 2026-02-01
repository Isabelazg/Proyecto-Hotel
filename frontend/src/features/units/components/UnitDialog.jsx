import { useEffect, useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Textarea } from '@/shared/components/ui/Textarea'
import { CustomSelect } from '@/shared/components/ui/Select'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container with proper containment */}
      <div className="relative bg-gradient-to-br from-white to-emerald-50/30 rounded-3xl border-2 border-emerald-200 shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 bg-gradient-to-r from-emerald-900 via-green-900 to-emerald-800 border-b-2 border-emerald-700 px-8 py-6 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-3xl font-light tracking-wide text-white">
              {isEditing ? 'Editar Unidad' : 'Nueva Unidad'}
            </h2>
            <p className="text-sm text-emerald-100 mt-2 font-light">
              {isEditing
                ? 'Modifica los detalles de la unidad de alojamiento'
                : 'Completa los detalles para crear una nueva unidad'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110"
          >
            <X size={22} className="text-white" />
          </button>
        </div>

        {/* Form - Scrollable content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <form id="unit-form" onSubmit={handleSubmit} className="p-8 space-y-6">
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
                className="h-12 px-4"
              />
              {errors.nombre && <p className="text-red-600 text-sm">{errors.nombre}</p>}
            </div>

            {/* Tipo Hospedaje */}
            <div className="space-y-2">
              <label htmlFor="tipo_hospedaje_id" className="block text-sm font-medium text-gray-700">
                Tipo de Hospedaje
              </label>
              <CustomSelect
                options={tiposHospedaje.map(tipo => ({
                  value: tipo.id,
                  label: tipo.nombre
                }))}
                value={formData.tipo_hospedaje_id}
                onChange={(value) => setFormData({ ...formData, tipo_hospedaje_id: value })}
                placeholder="Selecciona un tipo"
                error={errors.tipo_hospedaje_id}
              />
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
              <CustomSelect
                options={STATUSES}
                value={formData.estado}
                onChange={(value) => setFormData({ ...formData, estado: value })}
                placeholder="Selecciona el estado"
              />
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
          </form>
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 bg-gradient-to-r from-emerald-50 to-green-50 border-t-2 border-emerald-200 px-8 py-5 rounded-b-3xl">
          <div className="flex gap-4">
            {isEditing && (
              <Button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:scale-105 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg"
              >
                <Trash2 size={18} />
                Eliminar
              </Button>
            )}
            <div className="flex-1 flex gap-4">
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-stone-300 to-gray-300 text-gray-800 hover:scale-105 py-3 rounded-full font-medium transition-all duration-300 shadow-lg"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="unit-form"
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:scale-105 text-white py-3 rounded-full font-medium transition-all duration-300 shadow-lg"
              >
                {isEditing ? 'Guardar Cambios' : 'Crear Unidad'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-gradient-to-br from-white to-red-50/30 rounded-3xl border-2 border-red-200 shadow-2xl p-8 max-w-md mx-4 z-70">
            <div className="flex items-center gap-5 mb-6">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-light tracking-wide text-red-950">Confirmar Eliminación</h3>
                <p className="text-sm text-gray-700 mt-2 font-light">
                  ¿Estás seguro de que deseas eliminar esta unidad? Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gradient-to-r from-stone-300 to-gray-300 text-gray-800 hover:scale-105 py-3 rounded-full font-medium transition-all duration-300 shadow-lg"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmDelete}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:scale-105 text-white py-3 rounded-full font-medium transition-all duration-300 shadow-lg"
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
