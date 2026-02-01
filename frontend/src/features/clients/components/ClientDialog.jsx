import { useEffect, useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Textarea } from '@/shared/components/ui/Textarea'

export function ClientDialog({ open, onClose, client, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    documento: '',
    contrasena: ''
  })
  const [errors, setErrors] = useState({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (client) {
      setFormData({
        nombre: client.nombre || '',
        apellido: client.apellido || '',
        correo: client.correo || '',
        telefono: client.telefono?.toString() || '',
        documento: client.documento?.toString() || '',
        contrasena: ''
      })
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        documento: '',
        contrasena: ''
      })
    }
    setErrors({})
    setShowDeleteConfirm(false)
  }, [client, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newErrors = {}
    
    if (!formData.nombre || !formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = 'El nombre no puede exceder 100 caracteres'
    }
    
    if (!formData.apellido || !formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido'
    } else if (formData.apellido.length > 100) {
      newErrors.apellido = 'El apellido no puede exceder 100 caracteres'
    }
    
    if (!formData.correo || !formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'Correo inválido'
    } else if (formData.correo.length > 100) {
      newErrors.correo = 'El correo no puede exceder 100 caracteres'
    }
    
    if (!client && (!formData.contrasena || !formData.contrasena.trim())) {
      newErrors.contrasena = 'La contraseña es requerida'
    } else if (formData.contrasena && formData.contrasena.length < 6) {
      newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    if (formData.documento && formData.documento.length > 20) {
      newErrors.documento = 'El documento no puede exceder 20 dígitos'
    }
    
    if (formData.telefono && formData.telefono.length > 20) {
      newErrors.telefono = 'El teléfono no puede exceder 20 dígitos'
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
      apellido: formData.apellido.trim(),
      correo: formData.correo.trim(),
      telefono: formData.telefono ? parseInt(formData.telefono) : null,
      documento: formData.documento ? parseInt(formData.documento) : null
    }

    if (formData.contrasena) {
      dataToSend.contrasena = formData.contrasena
    }

    onSave(dataToSend)
  }

  const confirmDelete = () => {
    if (client) {
      onDelete(client.id)
    }
  }

  if (!open) return null

  const isEditing = !!client

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container with proper containment */}
      <div className="relative bg-gradient-to-br from-white to-emerald-50/30 rounded-3xl border-2 border-emerald-200 shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 bg-gradient-to-r from-emerald-900 via-green-900 to-emerald-800 border-b-2 border-emerald-700 px-8 py-6 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-3xl font-light tracking-wide text-white">
              {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>
            <p className="text-sm text-emerald-100 mt-2 font-light">
              {isEditing
                ? 'Modifica los detalles del cliente'
                : 'Completa los detalles para registrar un nuevo cliente'}
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
          <form id="client-form" onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-xl font-light tracking-wide text-emerald-950 mb-5">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nombre */}
              <div className="space-y-2">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <Input
                  id="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: María"
                  className="h-12"
                />
                {errors.nombre && <p className="text-red-600 text-sm">{errors.nombre}</p>}
              </div>

              {/* Apellido */}
              <div className="space-y-2">
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <Input
                  id="apellido"
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  placeholder="Ej: González"
                  className="h-12"
                />
                {errors.apellido && <p className="text-red-600 text-sm">{errors.apellido}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
                  Correo Electrónico
                </label>
                <Input
                  id="correo"
                  type="email"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  placeholder="ejemplo@email.com"
                  className="h-12"
                />
                {errors.correo && <p className="text-red-600 text-sm">{errors.correo}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <Input
                  id="telefono"
                  type="number"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="1234567890"
                  className="h-12"
                />
                {errors.telefono && <p className="text-red-600 text-sm">{errors.telefono}</p>}
              </div>

              {/* Document */}
              <div className="space-y-2">
                <label htmlFor="documento" className="block text-sm font-medium text-gray-700">
                  Documento de Identidad
                </label>
                <Input
                  id="documento"
                  type="number"
                  value={formData.documento}
                  onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                  placeholder="12345678"
                  className="h-12"
                />
                {errors.documento && <p className="text-red-600 text-sm">{errors.documento}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">
                  Contraseña {client && <span className="text-xs text-stone-500">(dejar vacío para mantener)</span>}
                </label>
                <Input
                  id="contrasena"
                  type="password"
                  value={formData.contrasena}
                  onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                  placeholder="••••••••"
                  className="h-12"
                />
                {errors.contrasena && <p className="text-red-600 text-sm">{errors.contrasena}</p>}
              </div>
            </div>
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
                form="client-form"
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:scale-105 text-white py-3 rounded-full font-medium transition-all duration-300 shadow-lg"
              >
                {isEditing ? 'Guardar Cambios' : 'Crear Cliente'}
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
                  ¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.
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
