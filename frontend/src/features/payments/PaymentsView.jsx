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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-light">Cargando pagos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 font-light">Error: {error}</p>
          <button
            onClick={refetch}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50 to-lime-50 -m-6 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-light tracking-wide text-emerald-950">Pagos</h1>
            <p className="text-gray-700 mt-2 font-light">Gestión de pagos y transacciones del hotel</p>
          </div>
          <Button onClick={handleCreatePayment} className="bg-gradient-to-r from-emerald-600 to-green-600 hover:scale-105 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 shadow-lg transition-all duration-300">
            <Plus size={18} />
            Registrar Pago
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-500 p-6 rounded-3xl shadow-xl shadow-black/20 border border-emerald-400/30 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-100 tracking-wide">Total Recaudado</p>
                <p className="text-4xl font-light text-white mt-2">${totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/30">
                <DollarSign size={28} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-800 p-6 rounded-3xl shadow-xl shadow-black/20 border border-emerald-700/30 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-200 tracking-wide">Total Pagos</p>
                <p className="text-4xl font-light text-white mt-2">{totalPayments}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                <CheckCircle size={28} className="text-lime-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-xl shadow-black/10 border-2 border-emerald-200/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por cliente o reserva..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 h-12 rounded-xl bg-emerald-50/50 border border-emerald-200/30 focus:bg-white focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200/30 focus:outline-none transition-all duration-200 text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl shadow-black/10 border-2 border-emerald-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-emerald-50 to-green-50 border-b-2 border-emerald-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium tracking-wide text-emerald-900">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium tracking-wide text-emerald-900">Reserva</th>
                  <th className="px-6 py-4 text-left text-sm font-medium tracking-wide text-emerald-900">Cliente</th>
                  <th className="px-6 py-4 text-left text-sm font-medium tracking-wide text-emerald-900">Monto</th>
                  <th className="px-6 py-4 text-left text-sm font-medium tracking-wide text-emerald-900">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-600 font-light">
                      No se encontraron pagos
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map(payment => {
                    return (
                      <tr key={payment.id} className="hover:bg-emerald-50/50 transition-all duration-300">
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-medium text-emerald-900">#{payment.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-emerald-950">
                            {payment.reserva?.numero_reserva || 'Sin reserva'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700 font-light">
                            {payment.usuario ? `${payment.usuario.nombre} ${payment.usuario.apellido}` : 'Sin cliente'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-lg font-medium text-emerald-900">
                            ${parseFloat(payment.valor || 0).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleEditPayment(payment)}
                              className="p-2.5 hover:bg-emerald-100 rounded-full transition-all duration-300 hover:scale-110"
                              title="Editar pago"
                            >
                              <Edit2 size={16} className="text-emerald-700" />
                            </button>
                            <button 
                              onClick={() => confirmDelete(payment)}
                              className="p-2.5 hover:bg-red-100 rounded-full transition-all duration-300 hover:scale-110"
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
        <div className="flex items-center justify-between text-sm text-gray-700 bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-xl shadow-black/10 border-2 border-emerald-200/50">
          <p className="font-light">Mostrando <span className="font-medium text-emerald-900">{filteredPayments.length}</span> de <span className="font-medium text-emerald-900">{payments.length}</span> pagos</p>
          <p className="font-light">Total filtrado: <span className="font-medium text-emerald-900">${filteredPayments.reduce((sum, p) => sum + parseFloat(p.valor || 0), 0).toLocaleString()}</span></p>
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteConfirm({ show: false, paymentId: null, paymentInfo: '' })}
            />
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4 z-[70] border-2 border-emerald-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                  <Trash2 className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-light tracking-wide text-emerald-950">Confirmar Eliminación</h3>
                  <p className="text-sm text-gray-700 mt-2 font-light">
                    ¿Estás seguro de que deseas eliminar este pago?
                  </p>
                  <div className="mt-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-4 border-2 border-emerald-200">
                    <p className="text-sm font-medium text-emerald-900">
                      {deleteConfirm.paymentInfo}
                    </p>
                  </div>
                  <p className="text-xs text-red-600 mt-4 font-medium flex items-center gap-2">
                    <span className="text-base">⚠️</span> Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <Button
                  onClick={() => setDeleteConfirm({ show: false, paymentId: null, paymentInfo: '' })}
                  className="flex-1 bg-gradient-to-r from-stone-300 to-gray-300 text-gray-800 hover:scale-105 py-3 rounded-full font-medium transition-all duration-300 shadow-lg"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleDeletePayment}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:scale-105 text-white py-3 rounded-full font-medium transition-all duration-300 shadow-lg"
                >
                  Sí, Eliminar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
