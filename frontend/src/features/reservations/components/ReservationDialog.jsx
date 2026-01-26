import { useEffect, useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Textarea } from '@/shared/components/ui/Textarea'
import { getUnits } from '../../units/services/units.api'

const STATUSES = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_ejecucion', label: 'En Ejecución' },
  { value: 'terminada', label: 'Terminada' }
]

export function ReservationDialog({ open, onClose, reservation, selectedDate, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    numero_reserva: '',
    hospedaje_id: '',
    estado: 'pendiente',
    fecha_ingreso_hora: '',
    fecha_salida_hora: '',
    numero_huespedes: 1,
    nombre_huesped: '',
    apellido_huesped: '',
    documento_huesped: '',
    telefono_huesped: '',
    email_huesped: '',
    notas: '',
    valor: ''
  })
  const [hospedajes, setHospedajes] = useState([])
  const [isLoadingHospedajes, setIsLoadingHospedajes] = useState(false)
  const [errorHospedajes, setErrorHospedajes] = useState(null)
  const [errors, setErrors] = useState({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (open) {
      loadHospedajes()
    }
  }, [open, reservation])

  useEffect(() => {
    if (reservation) {
      // Formatear las fechas para el input datetime-local
      const formatDateForInput = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().slice(0, 16)
      }

      console.log('Cargando reserva para editar:', reservation)
      console.log('hospedaje_id:', reservation.hospedaje_id, 'tipo:', typeof reservation.hospedaje_id)

      setFormData({
        numero_reserva: reservation.numero_reserva || '',
        hospedaje_id: reservation.hospedaje_id ? String(reservation.hospedaje_id) : '',
        estado: reservation.estado || 'pendiente',
        fecha_ingreso_hora: formatDateForInput(reservation.fecha_ingreso_hora),
        fecha_salida_hora: formatDateForInput(reservation.fecha_salida_hora),
        numero_huespedes: reservation.numero_huespedes || 1,
        nombre_huesped: reservation.nombre_huesped || '',
        apellido_huesped: reservation.apellido_huesped || '',
        documento_huesped: reservation.documento_huesped || '',
        telefono_huesped: reservation.telefono_huesped || '',
        email_huesped: reservation.email_huesped || '',
        notas: reservation.notas || '',
        valor: reservation.valor || ''
      })
    } else if (selectedDate && !reservation) {
      // Solo establecer fechas predeterminadas si NO hay reserva (nueva reserva)
      const dateStr = selectedDate.toISOString().slice(0, 10)
      // Calcular fecha de salida (día siguiente)
      const nextDay = new Date(selectedDate)
      nextDay.setDate(nextDay.getDate() + 1)
      const nextDayStr = nextDay.toISOString().slice(0, 10)
      
      setFormData({
        numero_reserva: '',
        hospedaje_id: '',
        estado: 'pendiente',
        fecha_ingreso_hora: `${dateStr}T15:00`,
        fecha_salida_hora: `${nextDayStr}T12:00`,
        numero_huespedes: 1,
        nombre_huesped: '',
        apellido_huesped: '',
        documento_huesped: '',
        telefono_huesped: '',
        email_huesped: '',
        notas: '',
        valor: ''
      })
    }
  }, [reservation, selectedDate])

  const loadHospedajes = async () => {
    setIsLoadingHospedajes(true)
    setErrorHospedajes(null)
    try {
      // Si es edición, cargar todos los hospedajes para mostrar el actual
      // Si es nueva reserva, solo cargar disponibles
      const filters = reservation ? {} : { estado: 'disponible' }
      const response = await getUnits(filters)
      const hospedajesData = response.data || response
      const hospedajesArray = Array.isArray(hospedajesData) ? hospedajesData : []
      console.log('Hospedajes cargados:', hospedajesArray.map(h => ({ id: h.id, nombre: h.nombre })))
      setHospedajes(hospedajesArray)
    } catch (error) {
      console.error('Error loading hospedajes:', error)
      setErrorHospedajes('No se pudieron cargar los hospedajes')
      setHospedajes([])
    } finally {
      setIsLoadingHospedajes(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newErrors = {}

    // Validación 1: Hospedaje requerido
    if (!formData.hospedaje_id || formData.hospedaje_id === '') {
      newErrors.hospedaje_id = 'Debe seleccionar un hospedaje'
    }

    // Validación 2: Fechas requeridas
    if (!formData.fecha_ingreso_hora) {
      newErrors.fecha_ingreso_hora = 'La fecha de ingreso es requerida'
    }
    
    if (!formData.fecha_salida_hora) {
      newErrors.fecha_salida_hora = 'La fecha de salida es requerida'
    }

    // Validación 3: Fecha de salida posterior a ingreso
    if (formData.fecha_ingreso_hora && formData.fecha_salida_hora) {
      const fechaIngreso = new Date(formData.fecha_ingreso_hora)
      const fechaSalida = new Date(formData.fecha_salida_hora)
      
      if (fechaSalida <= fechaIngreso) {
        newErrors.fecha_salida_hora = 'La fecha de salida debe ser posterior a la fecha de ingreso'
      }

      // Validación 4: No permitir fechas pasadas SOLO para nuevas reservas
      if (!reservation) {
        const ahora = new Date()
        if (fechaIngreso < ahora) {
          newErrors.fecha_ingreso_hora = 'No se pueden crear reservas con fechas pasadas'
        }
      }

      // Validación 5: Diferencia mínima de tiempo (al menos 1 hora)
      const diferenciaHoras = (fechaSalida - fechaIngreso) / (1000 * 60 * 60)
      if (diferenciaHoras < 1) {
        newErrors.fecha_salida_hora = 'La reserva debe tener una duración mínima de 1 hora'
      }

      // Validación adicional para edición: advertir si la fecha de ingreso ya pasó
      if (reservation) {
        const ahora = new Date()
        if (fechaIngreso < ahora && fechaSalida < ahora) {
          // Permitir pero no mostrar error, solo advertencia silenciosa
          console.warn('Editando una reserva con fechas pasadas')
        }
      }
    }

    // Validación 6: Nombre y apellido requeridos
    if (!formData.nombre_huesped || !formData.nombre_huesped.trim()) {
      newErrors.nombre_huesped = 'El nombre del huésped es requerido'
    } else if (formData.nombre_huesped.length < 2) {
      newErrors.nombre_huesped = 'El nombre debe tener al menos 2 caracteres'
    } else if (formData.nombre_huesped.length > 100) {
      newErrors.nombre_huesped = 'El nombre no puede exceder 100 caracteres'
    }

    if (!formData.apellido_huesped || !formData.apellido_huesped.trim()) {
      newErrors.apellido_huesped = 'El apellido del huésped es requerido'
    } else if (formData.apellido_huesped.length < 2) {
      newErrors.apellido_huesped = 'El apellido debe tener al menos 2 caracteres'
    } else if (formData.apellido_huesped.length > 100) {
      newErrors.apellido_huesped = 'El apellido no puede exceder 100 caracteres'
    }

    // Validación 7: Documento (si se proporciona)
    if (formData.documento_huesped && formData.documento_huesped.length > 50) {
      newErrors.documento_huesped = 'El documento no puede exceder 50 caracteres'
    }

    // Validación 8: Teléfono válido (si se proporciona)
    if (formData.telefono_huesped && formData.telefono_huesped.trim()) {
      const telefonoRegex = /^[\d\s\+\-\(\)]+$/
      if (!telefonoRegex.test(formData.telefono_huesped)) {
        newErrors.telefono_huesped = 'Solo números, espacios y los caracteres +, -, (, )'
      } else if (formData.telefono_huesped.replace(/\D/g, '').length < 7) {
        newErrors.telefono_huesped = 'El teléfono debe tener al menos 7 dígitos'
      } else if (formData.telefono_huesped.length > 50) {
        newErrors.telefono_huesped = 'El teléfono no puede exceder 50 caracteres'
      }
    }

    // Validación 9: Email válido (si se proporciona)
    if (formData.email_huesped && formData.email_huesped.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email_huesped)) {
        newErrors.email_huesped = 'El email no es válido'
      } else if (formData.email_huesped.length > 100) {
        newErrors.email_huesped = 'El email no puede exceder 100 caracteres'
      }
    }

    // Validación 10: Número de huéspedes válido
    const numHuespedes = parseInt(formData.numero_huespedes)
    if (isNaN(numHuespedes) || numHuespedes < 1) {
      newErrors.numero_huespedes = 'El número de huéspedes debe ser al menos 1'
    } else if (numHuespedes > 20) {
      newErrors.numero_huespedes = 'El número de huéspedes no puede ser mayor a 20'
    }

    // Validación 11: Valor válido (si se proporciona)
    if (formData.valor && formData.valor.trim()) {
      const valor = parseFloat(formData.valor)
      if (isNaN(valor) || valor < 0) {
        newErrors.valor = 'El valor debe ser un número positivo'
      } else if (valor > 999999999) {
        newErrors.valor = 'El valor es demasiado grande'
      }
    }

    // Validación 12: Notas
    if (formData.notas && formData.notas.length > 255) {
      newErrors.notas = 'Las notas no pueden exceder 255 caracteres'
    }

    // Si hay errores, actualizar estado y no enviar
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // Hacer scroll al primer error
      const firstErrorField = Object.keys(newErrors)[0]
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => element.focus(), 300)
      }
      // Mostrar alerta con el primer error
      alert(`Por favor corrija los siguientes errores:\n\n${Object.values(newErrors).join('\n')}`)
      return
    }

    // Limpiar errores si todo está bien
    setErrors({})

    // Convertir las fechas al formato ISO completo
    const fechaIngreso = new Date(formData.fecha_ingreso_hora)
    const fechaSalida = new Date(formData.fecha_salida_hora)
    
    const dataToSend = {
      ...formData,
      hospedaje_id: parseInt(formData.hospedaje_id),
      numero_huespedes: parseInt(formData.numero_huespedes),
      fecha_ingreso_hora: fechaIngreso.toISOString(),
      fecha_salida_hora: fechaSalida.toISOString(),
      valor: formData.valor ? parseFloat(formData.valor) : null,
      // Limpiar campos vacíos opcionales
      documento_huesped: formData.documento_huesped?.trim() || null,
      telefono_huesped: formData.telefono_huesped?.trim() || null,
      email_huesped: formData.email_huesped?.trim() || null,
      notas: formData.notas?.trim() || null
    }

    // Si no hay número de reserva, el backend lo genera
    if (!dataToSend.numero_reserva) {
      delete dataToSend.numero_reserva
    }

    onSave(dataToSend)
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (reservation) {
      onDelete(reservation.id)
      setShowDeleteConfirm(false)
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Hospedaje y Estado */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Seleccionar Hospedaje</h3>
            <div className="grid grid-cols-1 gap-4">
              {/* Hospedaje */}
              <div className="space-y-2">
                <label htmlFor="hospedaje_id" className="block text-sm font-medium text-gray-700">
                  Hospedaje <span className="text-red-600">*</span>
                </label>
                {isLoadingHospedajes ? (
                  <div className="text-sm text-gray-500 py-3">Cargando hospedajes...</div>
                ) : errorHospedajes ? (
                  <div className="text-sm text-red-600 py-3">{errorHospedajes}</div>
                ) : hospedajes.length === 0 ? (
                  <div className="text-sm text-amber-600 py-3 bg-amber-50 border border-amber-200 rounded-lg px-4">
                    No hay hospedajes disponibles. Por favor, cree un hospedaje primero.
                  </div>
                ) : (
                  <>
                    {console.log('Renderizando select - formData.hospedaje_id:', formData.hospedaje_id, 'hospedajes:', hospedajes.length)}
                    <select
                      id="hospedaje_id"
                      value={formData.hospedaje_id}
                      onChange={(e) => {
                        console.log('Cambio de hospedaje:', e.target.value)
                        setFormData({ ...formData, hospedaje_id: e.target.value })
                        // Limpiar error cuando se selecciona
                        if (errors.hospedaje_id) {
                          setErrors({ ...errors, hospedaje_id: undefined })
                        }
                      }}
                      className={`w-full h-12 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent bg-white ${
                        errors.hospedaje_id ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Selecciona un hospedaje</option>
                      {hospedajes.map(hospedaje => {
                        console.log('Option:', hospedaje.id, hospedaje.nombre, 'selected:', String(hospedaje.id) === String(formData.hospedaje_id))
                        return (
                          <option key={hospedaje.id} value={hospedaje.id}>
                            {hospedaje.nombre} - ${hospedaje.precio}
                          </option>
                        )
                      })}
                    </select>
                  </>
                )}
                {errors.hospedaje_id && (
                  <p className="text-sm text-red-600 mt-1 bg-red-50 border border-red-200 rounded px-3 py-2">
                    ⚠️ {errors.hospedaje_id}
                  </p>
                )}
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className="w-full h-12 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent bg-white"
                >
                  {STATUSES.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Información del Huésped */}
          <div className="border-t border-gray-200 pt-5">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Información del Huésped</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="space-y-2">
                <label htmlFor="nombre_huesped" className="block text-sm font-medium text-gray-700">
                  Nombre <span className="text-red-600">*</span>
                </label>
                <Input
                  id="nombre_huesped"
                  type="text"
                  value={formData.nombre_huesped}
                  onChange={(e) => setFormData({ ...formData, nombre_huesped: e.target.value })}
                  placeholder="Ej: María"
                  className="h-12"
                  required
                  maxLength={100}
                  minLength={2}
                />
                {errors.nombre_huesped && (
                  <p className="text-sm text-red-600 mt-1">{errors.nombre_huesped}</p>
                )}
              </div>

              {/* Apellido */}
              <div className="space-y-2">
                <label htmlFor="apellido_huesped" className="block text-sm font-medium text-gray-700">
                  Apellido <span className="text-red-600">*</span>
                </label>
                <Input
                  id="apellido_huesped"
                  type="text"
                  value={formData.apellido_huesped}
                  onChange={(e) => setFormData({ ...formData, apellido_huesped: e.target.value })}
                  placeholder="Ej: González"
                  className="h-12"
                  required
                  maxLength={100}
                  minLength={2}
                />
                {errors.apellido_huesped && (
                  <p className="text-sm text-red-600 mt-1">{errors.apellido_huesped}</p>
                )}
              </div>

              {/* Documento */}
              <div className="space-y-2">
                <label htmlFor="documento_huesped" className="block text-sm font-medium text-gray-700">
                  Documento
                </label>
                <Input
                  id="documento_huesped"
                  type="text"
                  value={formData.documento_huesped}
                  onChange={(e) => setFormData({ ...formData, documento_huesped: e.target.value })}
                  placeholder="Ej: 12345678"
                  className="h-12"
                  maxLength={50}
                />
                {errors.documento_huesped && (
                  <p className="text-sm text-red-600 mt-1">{errors.documento_huesped}</p>
                )}
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <label htmlFor="telefono_huesped" className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <Input
                  id="telefono_huesped"
                  type="tel"
                  value={formData.telefono_huesped}
                  onChange={(e) => setFormData({ ...formData, telefono_huesped: e.target.value })}
                  placeholder="Ej: +57 300 1234567"
                  className="h-12"
                  maxLength={50}
                  pattern="[\d\s\+\-\(\)]+"
                  title="Solo números, espacios y los caracteres +, -, (, )"
                />
                {errors.telefono_huesped && (
                  <p className="text-sm text-red-600 mt-1">{errors.telefono_huesped}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="email_huesped" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email_huesped"
                  type="email"
                  value={formData.email_huesped}
                  onChange={(e) => setFormData({ ...formData, email_huesped: e.target.value })}
                  placeholder="Ej: maria@ejemplo.com"
                  className="h-12"
                  maxLength={100}
                />
                {errors.email_huesped && (
                  <p className="text-sm text-red-600 mt-1">{errors.email_huesped}</p>
                )}
              </div>
            </div>
          </div>

          {/* Detalles de la Reserva */}
          <div className="border-t border-gray-200 pt-5">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Detalles de la Reserva</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha Ingreso */}
              <div className="space-y-2">
                <label htmlFor="fecha_ingreso_hora" className="block text-sm font-medium text-gray-700">
                  Fecha y Hora de Ingreso *
                </label>
                <Input
                  id="fecha_ingreso_hora"
                  type="datetime-local"
                  value={formData.fecha_ingreso_hora}
                  onChange={(e) => setFormData({ ...formData, fecha_ingreso_hora: e.target.value })}
                  className="h-12"
                  required
                />
                {errors.fecha_ingreso_hora && (
                  <p className="text-sm text-red-600 mt-1">{errors.fecha_ingreso_hora}</p>
                )}
              </div>

              {/* Fecha Salida */}
              <div className="space-y-2">
                <label htmlFor="fecha_salida_hora" className="block text-sm font-medium text-gray-700">
                  Fecha y Hora de Salida *
                </label>
                <Input
                  id="fecha_salida_hora"
                  type="datetime-local"
                  value={formData.fecha_salida_hora}
                  onChange={(e) => setFormData({ ...formData, fecha_salida_hora: e.target.value })}
                  className="h-12"
                  required
                />
                {errors.fecha_salida_hora && (
                  <p className="text-sm text-red-600 mt-1">{errors.fecha_salida_hora}</p>
                )}
              </div>

              {/* Número de Huéspedes */}
              <div className="space-y-2">
                <label htmlFor="numero_huespedes" className="block text-sm font-medium text-gray-700">
                  Número de Huéspedes
                </label>
                <Input
                  id="numero_huespedes"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.numero_huespedes}
                  onChange={(e) => setFormData({ ...formData, numero_huespedes: parseInt(e.target.value) || 1 })}
                  className="h-12"
                />
                {errors.numero_huespedes && (
                  <p className="text-sm text-red-600 mt-1">{errors.numero_huespedes}</p>
                )}
              </div>

              {/* Valor */}
              <div className="space-y-2">
                <label htmlFor="valor" className="block text-sm font-medium text-gray-700">
                  Valor
                </label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="0"
                  max="999999999"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  placeholder="0.00"
                  className="h-12"
                />
                {errors.valor && (
                  <p className="text-sm text-red-600 mt-1">{errors.valor}</p>
                )}
              </div>
            </div>

            {/* Notes - Full Width */}
            <div className="space-y-2 mt-4">
              <label htmlFor="notas" className="block text-sm font-medium text-gray-700">
                Notas Adicionales
              </label>
              <Textarea
                id="notas"
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                placeholder="Observaciones, preferencias, etc."
                rows={3}
                maxLength={255}
              />
              {errors.notas && (
                <p className="text-sm text-red-600 mt-1">{errors.notas}</p>
              )}
            </div>
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

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60"
            onClick={() => setShowDeleteConfirm(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 z-10">
            <div className="text-center">
              {/* Icono de advertencia */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              
              {/* Título */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Eliminar reserva?
              </h3>
              
              {/* Descripción */}
              <p className="text-sm text-gray-600 mb-6">
                Esta acción no se puede deshacer. La reserva <span className="font-semibold">{reservation?.numero_reserva}</span> será eliminada permanentemente y el hospedaje quedará disponible.
              </p>
              
              {/* Botones */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-200 border border-gray-300 text-gray-700 hover:bg-gray-300 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
