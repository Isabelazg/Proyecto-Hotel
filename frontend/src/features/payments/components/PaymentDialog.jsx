import { useEffect, useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Textarea } from '@/shared/components/ui/Textarea'

const PAYMENT_METHODS = [
  'Tarjeta de Crédito',
  'Tarjeta de Débito',
  'Efectivo',
  'Transferencia'
]

const STATUSES = [
  { value: 'completado', label: 'Completado' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'rechazado', label: 'Rechazado' }
]

export function PaymentDialog({ open, onClose, payment, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    reservationId: '',
    client: '',
    amount: 0,
    method: 'Tarjeta de Crédito',
    status: 'pendiente',
    date: new Date().toISOString().split('T')[0],
    concept: '',
    notes: ''
  })

  useEffect(() => {
    if (payment) {
      setFormData({
        reservationId: payment.reservationId || '',
        client: payment.client || '',
        amount: payment.amount || 0,
        method: payment.method || 'Tarjeta de Crédito',
        status: payment.status || 'pendiente',
        date: payment.date || new Date().toISOString().split('T')[0],
        concept: payment.concept || '',
        notes: payment.notes || ''
      })
    } else {
      setFormData({
        reservationId: '',
        client: '',
        amount: 0,
        method: 'Tarjeta de Crédito',
        status: 'pendiente',
        date: new Date().toISOString().split('T')[0],
        concept: '',
        notes: ''
      })
    }
  }, [payment, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.reservationId || !formData.client || !formData.amount || !formData.concept) return

    onSave({
      id: payment?.id || Date.now().toString(),
      reservationId: formData.reservationId,
      client: formData.client,
      amount: parseFloat(formData.amount),
      method: formData.method,
      status: formData.status,
      date: formData.date,
      concept: formData.concept,
      notes: formData.notes
    })
  }

  const handleDelete = () => {
    if (payment && window.confirm('¿Estás seguro de eliminar este pago?')) {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Reservation ID */}
            <div className="space-y-2">
              <label htmlFor="reservationId" className="block text-sm font-medium text-gray-700">
                ID de Reserva
              </label>
              <Input
                id="reservationId"
                type="text"
                value={formData.reservationId}
                onChange={(e) => setFormData({ ...formData, reservationId: e.target.value })}
                placeholder="RES-001"
                className="h-12"
                required
              />
            </div>

            {/* Client */}
            <div className="space-y-2">
              <label htmlFor="client" className="block text-sm font-medium text-gray-700">
                Cliente
              </label>
              <Input
                id="client"
                type="text"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="Nombre del cliente"
                className="h-12"
                required
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Monto ($)
              </label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="h-12"
                required
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Fecha
              </label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="h-12"
                required
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label htmlFor="method" className="block text-sm font-medium text-gray-700">
                Método de Pago
              </label>
              <select
                id="method"
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className="w-full h-12 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              >
                {PAYMENT_METHODS.map(method => (
                  <option key={method} value={method}>{method}</option>
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
                className="w-full h-12 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              >
                {STATUSES.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Concept */}
          <div className="space-y-2">
            <label htmlFor="concept" className="block text-sm font-medium text-gray-700">
              Concepto
            </label>
            <Input
              id="concept"
              type="text"
              value={formData.concept}
              onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
              placeholder="Ej: Suite Deluxe - 3 noches"
              className="h-12"
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notas Adicionales
            </label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observaciones, número de transacción, etc..."
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
                  {isEditing ? 'Guardar Cambios' : 'Registrar Pago'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
