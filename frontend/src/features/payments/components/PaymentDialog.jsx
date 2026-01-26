import { useEffect, useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { getReservations } from '../../reservations/services/reservations.api'
import { getClients } from '../../clients/services/clients.api'

export function PaymentDialog({ open, onClose, payment, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    reserva_id: '',
    usuario_id: '',
    valor: ''
  })
  const [errors, setErrors] = useState({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [reservations, setReservations] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [generalError, setGeneralError] = useState('')

  useEffect(() => {
    if (open) {
      loadData()
    }
  }, [open])

  const loadData = async () => {
    setIsLoadingData(true)
    try {
      const [resResponse, userResponse] = await Promise.all([
        getReservations({ limit: 100 }),
        getClients({ limit: 100 })
      ])
      setReservations(resResponse.data || [])
      setUsuarios(userResponse.data || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoadingData(false)
    }
  }

  useEffect(() => {
    if (payment) {
      setFormData({
        reserva_id: payment.reserva_id || '',
        usuario_id: payment.usuario_id || '',
        valor: payment.valor || ''
      })
    } else {
      setFormData({
        reserva_id: '',
        usuario_id: '',
        valor: ''
      })
    }
    setErrors({})
    setGeneralError('')
    setShowDeleteConfirm(false)
  }, [payment, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Limpiar errores previos
    setErrors({})
    setGeneralError('')
    
    const newErrors = {}
    
    if (!formData.reserva_id) {
      newErrors.reserva_id = 'La reserva es requerida'
    }
    
    if (!formData.usuario_id) {
      newErrors.usuario_id = 'El usuario es requerido'
    }
    
    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      newErrors.valor = 'El valor debe ser mayor a 0'
    }

    // Validar que la reserva tenga un valor asignado
    if (formData.reserva_id && selectedReservation) {
      if (!selectedReservation.valor || selectedReservation.valor <= 0) {
        newErrors.reserva_id = 'La reserva seleccionada no tiene un valor asignado. Por favor, edite la reserva primero.'
        setGeneralError('⚠️ La reserva seleccionada no tiene un valor asignado. Debes editar la reserva y asignarle un valor antes de registrar pagos.')
      } else {
        // Validar que el pago no exceda el valor pendiente
        const valorReserva = parseFloat(selectedReservation.valor)
        const valorPago = parseFloat(formData.valor)
        
        if (valorPago > valorReserva) {
          newErrors.valor = `El pago ($${valorPago.toLocaleString()}) no puede ser mayor al valor de la reserva ($${valorReserva.toLocaleString()})`
          setGeneralError(`⚠️ El valor del pago ($${valorPago.toLocaleString()}) excede el valor total de la reserva ($${valorReserva.toLocaleString()}). Por favor, ingresa un monto menor o igual al valor de la reserva.`)
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      
      const firstErrorField = Object.keys(newErrors)[0]
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => element.focus(), 300)
      }
      
      // Ya no mostramos alert, usamos el mensaje visual
      return
    }

    const dataToSend = {
      reserva_id: parseInt(formData.reserva_id),
      usuario_id: parseInt(formData.usuario_id),
      valor: parseFloat(formData.valor)
    }

    onSave(dataToSend)
  }

  const confirmDelete = () => {
    if (payment) {
      onDelete(payment.id)
    }
  }

  if (!open) return null

  const isEditing = !!payment

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              {isEditing ? 'Editar Pago' : 'Registrar Pago'}
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              {isEditing
                ? 'Modifica los detalles del pago'
                : 'Completa los detalles para registrar un nuevo pago'}
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
          {/* Error General */}
          {generalError && (
            <div className="bg-red-50 border-2 border-red-500 rounded-lg px-4 py-3 flex items-start gap-3">
              <div className="flex-shrink-0 text-red-600 text-xl">⚠️</div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-800 mb-1">Error de Validación</h4>
                <p className="text-sm text-red-700">{generalError}</p>
              </div>
            </div>
          )}

          {isLoadingData ? (
            <div className="text-center py-8">
              <p className="text-stone-600">Cargando datos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {/* Reserva */}
              <div className="space-y-2">
                <label htmlFor="reserva_id" className="block text-sm font-medium text-gray-700">
                  Reserva
                </label>
                <select
                  id="reserva_id"
                  value={formData.reserva_id}
                  onChange={(e) => {
                    const reservaId = e.target.value
                    setFormData({ ...formData, reserva_id: reservaId })
                    
                    // Guardar la reserva seleccionada para validación
                    const reserva = reservations.find(r => r.id === parseInt(reservaId))
                    setSelectedReservation(reserva || null)
                    
                    // Limpiar errores
                    if (errors.reserva_id) {
                      setErrors({ ...errors, reserva_id: undefined })
                    }
                  }}
                  className={`w-full h-12 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent ${
                    errors.reserva_id ? 'border-red-500' : 'border-stone-300'
                  }`}
                >
                  <option value="">Selecciona una reserva</option>
                  {reservations.map(res => (
                    <option key={res.id} value={res.id}>
                      {res.numero_reserva} - {res.hospedaje?.nombre || 'Hospedaje'} (${parseFloat(res.valor || 0).toLocaleString()})
                    </option>
                  ))}
                </select>
                {errors.reserva_id && (
                  <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
                    ⚠️ {errors.reserva_id}
                  </p>
                )}
                {selectedReservation && selectedReservation.valor && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                    <p className="text-sm text-blue-800">
                      <strong>Valor de la reserva:</strong> ${parseFloat(selectedReservation.valor).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Usuario */}
              <div className="space-y-2">
                <label htmlFor="usuario_id" className="block text-sm font-medium text-gray-700">
                  Usuario/Cliente
                </label>
                <select
                  id="usuario_id"
                  value={formData.usuario_id}
                  onChange={(e) => setFormData({ ...formData, usuario_id: e.target.value })}
                  className="w-full h-12 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                >
                  <option value="">Selecciona un usuario</option>
                  {usuarios.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.nombre} {user.apellido} - {user.correo}
                    </option>
                  ))}
                </select>
                {errors.usuario_id && <p className="text-red-600 text-sm">{errors.usuario_id}</p>}
              </div>

              {/* Valor */}
              <div className="space-y-2">
                <label htmlFor="valor" className="block text-sm font-medium text-gray-700">
                  Valor del Pago ($)
                </label>
                <Input
                  id="valor"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => {
                    setFormData({ ...formData, valor: e.target.value })
                    if (errors.valor) {
                      setErrors({ ...errors, valor: undefined })
                    }
                  }}
                  placeholder="0.00"
                  className={`h-12 ${errors.valor ? 'border-red-500' : ''}`}
                />
                {errors.valor && (
                  <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
                    ⚠️ {errors.valor}
                  </p>
                )}
                {selectedReservation && selectedReservation.valor && formData.valor && (
                  <div className={`border rounded-lg px-4 py-3 ${
                    parseFloat(formData.valor) <= parseFloat(selectedReservation.valor)
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <p className={`text-sm ${
                      parseFloat(formData.valor) <= parseFloat(selectedReservation.valor)
                        ? 'text-green-800'
                        : 'text-red-800'
                    }`}>
                      {parseFloat(formData.valor) <= parseFloat(selectedReservation.valor)
                        ? `✓ El pago es válido (${((parseFloat(formData.valor) / parseFloat(selectedReservation.valor)) * 100).toFixed(1)}% de la reserva)`
                        : `✗ El pago excede el valor de la reserva`
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

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
                  disabled={isLoadingData}
                >
                  {isEditing ? 'Guardar Cambios' : 'Registrar Pago'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/70"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md mx-4 z-[70]">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
                <p className="text-sm text-gray-600 mt-2">
                  ¿Estás seguro de que deseas eliminar este pago?
                </p>
                {payment && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Detalles del pago:</p>
                    <p className="text-sm font-medium text-gray-900">
                      Valor: <span className="text-green-600">${parseFloat(payment.valor || 0).toLocaleString()}</span>
                    </p>
                    {payment.reserva && (
                      <p className="text-xs text-gray-600 mt-1">
                        Reserva: {payment.reserva.numero_reserva}
                      </p>
                    )}
                  </div>
                )}
                <p className="text-xs text-red-600 mt-3 font-medium">
                  ⚠️ Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-stone-200 border border-stone-300 text-black hover:bg-stone-300 py-2.5 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition-colors"
              >
                Sí, Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
