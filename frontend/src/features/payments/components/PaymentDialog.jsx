import { useEffect, useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { CustomSelect } from '@/shared/components/ui/Select'
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
        reserva_id: String(payment.reserva?.id || payment.reserva_id || ''),
        usuario_id: String(payment.usuario?.id || payment.usuario_id || ''),
        valor: payment.valor || ''
      })
      // Si estamos editando y ya tenemos las reservas cargadas, buscar la reserva seleccionada
      const reservaId = payment.reserva?.id || payment.reserva_id
      if (reservations.length > 0 && reservaId) {
        const reserva = reservations.find(r => r.id === parseInt(reservaId))
        setSelectedReservation(reserva || null)
      }
    } else {
      setFormData({
        reserva_id: '',
        usuario_id: '',
        valor: ''
      })
      setSelectedReservation(null)
    }
    setErrors({})
    setGeneralError('')
    setShowDeleteConfirm(false)
  }, [payment, open, reservations])

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
              {isEditing ? 'Editar Pago' : 'Registrar Pago'}
            </h2>
            <p className="text-sm text-emerald-100 mt-2 font-light">
              {isEditing
                ? 'Modifica los detalles del pago'
                : 'Completa los detalles para registrar un nuevo pago'}
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
          <form id="payment-form" onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Error General */}
          {generalError && (
            <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-400 rounded-2xl px-5 py-4 flex items-start gap-4 shadow-lg">
              <div className="flex-shrink-0 text-red-600 text-2xl">⚠️</div>
              <div className="flex-1">
                <h4 className="font-medium tracking-wide text-red-900 mb-2">Error de Validación</h4>
                <p className="text-sm text-red-800 font-light">{generalError}</p>
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
                <CustomSelect
                  options={reservations.map(res => ({
                    value: String(res.id),
                    label: `${res.numero_reserva} - ${res.hospedaje?.nombre || 'Hospedaje'} ($${parseFloat(res.valor || 0).toLocaleString()})`
                  }))}
                  value={formData.reserva_id}
                  onChange={(value) => {
                    setFormData({ ...formData, reserva_id: value })
                    
                    // Guardar la reserva seleccionada para validación
                    const reserva = reservations.find(r => r.id === parseInt(value))
                    setSelectedReservation(reserva || null)
                    
                    // Limpiar errores
                    if (errors.reserva_id) {
                      setErrors({ ...errors, reserva_id: undefined })
                    }
                  }}
                  placeholder="Selecciona una reserva"
                  error={errors.reserva_id}
                />
                {errors.reserva_id && (
                  <p className="text-red-700 text-sm bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-300 rounded-2xl px-4 py-3 shadow-md">
                    ⚠️ {errors.reserva_id}
                  </p>
                )}
                {selectedReservation && selectedReservation.valor && (
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl px-5 py-3 shadow-md">
                    <p className="text-sm text-emerald-900 font-medium">
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
                <CustomSelect
                  options={usuarios.map(user => ({
                    value: String(user.id),
                    label: `${user.nombre} ${user.apellido} - ${user.correo}`
                  }))}
                  value={formData.usuario_id}
                  onChange={(value) => setFormData({ ...formData, usuario_id: value })}
                  placeholder="Selecciona un usuario"
                  error={errors.usuario_id}
                />
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
                  className={`h-12 ${errors.valor ? 'border-red-400 bg-red-50/30' : ''}`}
                />
                {errors.valor && (
                  <p className="text-red-700 text-sm bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-300 rounded-2xl px-4 py-3 shadow-md">
                    ⚠️ {errors.valor}
                  </p>
                )}
                {selectedReservation && selectedReservation.valor && formData.valor && (
                  <div className={`border-2 rounded-2xl px-5 py-3 shadow-md ${
                    parseFloat(formData.valor) <= parseFloat(selectedReservation.valor)
                      ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300'
                      : 'bg-gradient-to-r from-red-50 to-red-100/50 border-red-300'
                  }`}>
                    <p className={`text-sm font-medium ${
                      parseFloat(formData.valor) <= parseFloat(selectedReservation.valor)
                        ? 'text-emerald-900'
                        : 'text-red-900'
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
                form="payment-form"
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:scale-105 text-white py-3 rounded-full font-medium transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={isLoadingData}
              >
                {isEditing ? 'Guardar Cambios' : 'Registrar Pago'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-gradient-to-br from-white to-red-50/30 rounded-3xl border-2 border-red-200 shadow-2xl p-8 max-w-md mx-4 z-[70]">
            <div className="flex items-start gap-5 mb-6">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-light tracking-wide text-red-950">Confirmar Eliminación</h3>
                <p className="text-sm text-gray-700 mt-2 font-light">
                  ¿Estás seguro de que deseas eliminar este pago?
                </p>
                {payment && (
                  <div className="mt-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-4 border-2 border-emerald-200 shadow-md">
                    <p className="text-xs text-emerald-700 mb-2 font-medium">Detalles del pago:</p>
                    <p className="text-sm font-medium text-emerald-950">
                      Valor: <span className="text-green-700">${parseFloat(payment.valor || 0).toLocaleString()}</span>
                    </p>
                    {payment.reserva && (
                      <p className="text-xs text-gray-700 mt-2">
                        Reserva: {payment.reserva.numero_reserva}
                      </p>
                    )}
                  </div>
                )}
                <p className="text-xs text-red-700 mt-4 font-medium bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  ⚠️ Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <Button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gradient-to-r from-stone-300 to-gray-300 text-gray-800 hover:scale-105 py-3 rounded-full font-medium transition-all duration-300 shadow-lg"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={confirmDelete}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:scale-105 text-white py-3 rounded-full font-medium transition-all duration-300 shadow-lg"
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
