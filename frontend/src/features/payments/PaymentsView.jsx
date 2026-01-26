import { useState } from 'react'
import { Plus, Search, DollarSign, CheckCircle, Edit2, Trash2 } from 'lucide-react'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { PaymentDialog } from './components/PaymentDialog'
import { usePayments } from './hooks/usePayments'

export function PaymentsView() {
  const { payments, isLoading, error, create, update, remove, refetch } = usePayments()
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, paymentId: null, paymentInfo: '' })

  const filteredPayments = payments.filter(payment => {
    const reservaInfo = payment.reserva?.numero_reserva || ''
    const clienteInfo = `${payment.usuario?.nombre || ''} ${payment.usuario?.apellido || ''}`
    const matchesSearch = 
      reservaInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clienteInfo.toLowerCase().includes(searchTerm.toLowerCase())
    // Eliminamos el filtro de status por ahora ya que el backend no lo envía
    return matchesSearch
  })

  const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.valor || 0), 0)
  const totalPayments = payments.length

  const handleCreatePayment = () => {
    setSelectedPayment(null)
    setPaymentDialogOpen(true)
  }

  const handleEditPayment = (payment) => {
    setSelectedPayment(payment)
    setPaymentDialogOpen(true)
  }

  const handleSavePayment = async (paymentData) => {
    try {
      if (selectedPayment) {
        await update(selectedPayment.id, paymentData)
      } else {
        await create(paymentData)
      }
      setPaymentDialogOpen(false)
      setSelectedPayment(null)
    } catch (err) {
      console.error('Error saving payment:', err)
      // Mostrar error en un formato más visible
      const errorMsg = err.message || 'Error al guardar el pago'
      alert(`❌ Error al guardar el pago\n\n${errorMsg}`)
    }
  }

  const handleDeletePayment = async () => {
    try {
      await remove(deleteConfirm.paymentId)
      setDeleteConfirm({ show: false, paymentId: null, paymentInfo: '' })
      setPaymentDialogOpen(false)
      setSelectedPayment(null)
    } catch (err) {
      console.error('Error deleting payment:', err)
      alert(err.message || 'Error al eliminar el pago')
      setDeleteConfirm({ show: false, paymentId: null, paymentInfo: '' })
    }
  }

  const confirmDelete = (payment) => {
    const paymentInfo = `${payment.reserva?.numero_reserva || 'Reserva'} - $${payment.valor}`
    setDeleteConfirm({ show: true, paymentId: payment.id, paymentInfo })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pagos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Pagos</h1>
          <p className="text-stone-600 mt-1">Gestión de pagos y transacciones del hotel</p>
        </div>
        <Button onClick={handleCreatePayment} className="bg-black hover:bg-stone-900 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} />
          Registrar Pago
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-800 font-medium">Total Recaudado</p>
              <p className="text-3xl font-bold text-green-900 mt-1">${totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-green-200 p-3 rounded-lg">
              <DollarSign size={24} className="text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 font-medium">Total Pagos</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{totalPayments}</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-lg">
              <CheckCircle size={24} className="text-blue-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-stone-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <Input
              type="text"
              placeholder="Buscar por cliente o reserva..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reserva</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Monto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-stone-500">
                    No se encontraron pagos
                  </td>
                </tr>
              ) : (
                filteredPayments.map(payment => {
                  return (
                    <tr key={payment.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-gray-900">#{payment.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {payment.reserva?.numero_reserva || 'Sin reserva'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-stone-700">
                          {payment.usuario ? `${payment.usuario.nombre} ${payment.usuario.apellido}` : 'Sin cliente'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-gray-900">
                          ${parseFloat(payment.valor || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEditPayment(payment)}
                            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                            title="Editar pago"
                          >
                            <Edit2 size={16} className="text-stone-600" />
                          </button>
                          <button 
                            onClick={() => confirmDelete(payment)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar pago"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Summary */}
      <div className="flex items-center justify-between text-sm text-stone-600 bg-white p-4 rounded-xl border border-stone-200">
        <p>Mostrando <span className="font-semibold text-gray-900">{filteredPayments.length}</span> de <span className="font-semibold text-gray-900">{payments.length}</span> pagos</p>
        <p>Total filtrado: <span className="font-semibold text-gray-900">${filteredPayments.reduce((sum, p) => sum + parseFloat(p.valor || 0), 0).toLocaleString()}</span></p>
      </div>

      {/* Payment Dialog */}
      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => {
          setPaymentDialogOpen(false)
          setSelectedPayment(null)
        }}
        payment={selectedPayment}
        onSave={handleSavePayment}
        onDelete={(id) => {
          const payment = payments.find(p => p.id === id)
          confirmDelete(payment)
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/70"
            onClick={() => setDeleteConfirm({ show: false, paymentId: null, paymentInfo: '' })}
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
                <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {deleteConfirm.paymentInfo}
                  </p>
                </div>
                <p className="text-xs text-red-600 mt-3 font-medium">
                  ⚠️ Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setDeleteConfirm({ show: false, paymentId: null, paymentInfo: '' })}
                className="flex-1 bg-stone-200 border border-stone-300 text-black hover:bg-stone-300 py-2.5 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDeletePayment}
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
