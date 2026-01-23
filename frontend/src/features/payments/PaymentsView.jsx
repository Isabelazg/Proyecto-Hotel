import { useState } from 'react'
import { Plus, Search, Filter, DollarSign, CreditCard, Receipt, Calendar, CheckCircle, XCircle, Clock, Edit2, Trash2 } from 'lucide-react'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { PaymentDialog } from './components/PaymentDialog'

const MOCK_PAYMENTS = [
  { id: 1, reservationId: 'RES-001', client: 'María González', amount: 1200, method: 'Tarjeta de Crédito', status: 'completado', date: '2026-01-20', concept: 'Suite Deluxe - 3 noches' },
  { id: 2, reservationId: 'RES-002', client: 'Juan Pérez', amount: 1250, method: 'Transferencia', status: 'completado', date: '2026-01-19', concept: 'Habitación Ejecutiva - 5 noches' },
  { id: 3, reservationId: 'RES-003', client: 'Ana Martínez', amount: 450, method: 'Efectivo', status: 'pendiente', date: '2026-01-18', concept: 'Habitación Estándar - 3 noches' },
  { id: 4, reservationId: 'RES-004', client: 'Carlos López', amount: 4000, method: 'Tarjeta de Débito', status: 'completado', date: '2026-01-17', concept: 'Suite Presidencial - 5 noches' },
  { id: 5, reservationId: 'RES-005', client: 'Laura Sánchez', amount: 2000, method: 'Tarjeta de Crédito', status: 'completado', date: '2026-01-16', concept: 'Suite Deluxe - 5 noches' },
  { id: 6, reservationId: 'RES-006', client: 'Pedro Ramírez', amount: 750, method: 'Transferencia', status: 'rechazado', date: '2026-01-15', concept: 'Habitación Ejecutiva - 3 noches' },
  { id: 7, reservationId: 'RES-007', client: 'Isabel Torres', amount: 300, method: 'Efectivo', status: 'completado', date: '2026-01-14', concept: 'Habitación Estándar - 2 noches' },
  { id: 8, reservationId: 'RES-008', client: 'Miguel Ruiz', amount: 1600, method: 'Tarjeta de Crédito', status: 'pendiente', date: '2026-01-13', concept: 'Suite Deluxe - 4 noches' },
]

const STATUS_CONFIG = {
  completado: { label: 'Completado', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
  pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
  rechazado: { label: 'Rechazado', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
}

const PAYMENT_METHODS = ['Todos', 'Tarjeta de Crédito', 'Tarjeta de Débito', 'Efectivo', 'Transferencia']

export function PaymentsView() {
  const [payments, setPayments] = useState(MOCK_PAYMENTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterMethod, setFilterMethod] = useState('Todos')
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reservationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.concept.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus
    const matchesMethod = filterMethod === 'Todos' || payment.method === filterMethod
    return matchesSearch && matchesStatus && matchesMethod
  })

  const totalAmount = payments.reduce((sum, p) => sum + (p.status === 'completado' ? p.amount : 0), 0)
  const pendingAmount = payments.reduce((sum, p) => sum + (p.status === 'pendiente' ? p.amount : 0), 0)
  const completedPayments = payments.filter(p => p.status === 'completado').length
  const pendingPayments = payments.filter(p => p.status === 'pendiente').length

  const handleCreatePayment = () => {
    setSelectedPayment(null)
    setPaymentDialogOpen(true)
  }

  const handleEditPayment = (payment) => {
    setSelectedPayment(payment)
    setPaymentDialogOpen(true)
  }

  const handleSavePayment = (paymentData) => {
    if (selectedPayment) {
      setPayments(payments.map(p => p.id === selectedPayment.id ? paymentData : p))
    } else {
      setPayments([...payments, paymentData])
    }
    setPaymentDialogOpen(false)
    setSelectedPayment(null)
  }

  const handleDeletePayment = (id) => {
    setPayments(payments.filter(p => p.id !== id))
    setPaymentDialogOpen(false)
    setSelectedPayment(null)
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <p className="text-sm text-blue-800 font-medium">Pagos Completados</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{completedPayments}</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-lg">
              <CheckCircle size={24} className="text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-xl border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-800 font-medium">Pagos Pendientes</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">{pendingPayments}</p>
            </div>
            <div className="bg-yellow-200 p-3 rounded-lg">
              <Clock size={24} className="text-yellow-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-xl border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-800 font-medium">Por Cobrar</p>
              <p className="text-3xl font-bold text-amber-900 mt-1">${pendingAmount.toLocaleString()}</p>
            </div>
            <div className="bg-amber-200 p-3 rounded-lg">
              <Receipt size={24} className="text-amber-700" />
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
              placeholder="Buscar por cliente, reserva o concepto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-stone-600" size={18} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-11 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="completado">Completado</option>
              <option value="pendiente">Pendiente</option>
              <option value="rechazado">Rechazado</option>
            </select>
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="h-11 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            >
              {PAYMENT_METHODS.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID Reserva</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Concepto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Método</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Monto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-stone-500">
                    No se encontraron pagos
                  </td>
                </tr>
              ) : (
                filteredPayments.map(payment => {
                  const StatusIcon = STATUS_CONFIG[payment.status].icon
                  return (
                    <tr key={payment.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-gray-900">{payment.reservationId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{payment.client}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-stone-700">{payment.concept}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-stone-700">
                          <Calendar size={14} className="text-stone-400" />
                          {new Date(payment.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-stone-700">
                          <CreditCard size={14} className="text-stone-400" />
                          {payment.method}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-gray-900">${payment.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${STATUS_CONFIG[payment.status].color}`}>
                          <StatusIcon size={14} />
                          {STATUS_CONFIG[payment.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEditPayment(payment)}
                            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} className="text-stone-600" />
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm('¿Estás seguro de eliminar este pago?')) {
                                handleDeletePayment(payment.id)
                              }
                            }}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
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
        <p>Total filtrado: <span className="font-semibold text-gray-900">${filteredPayments.reduce((sum, p) => sum + (p.status === 'completado' ? p.amount : 0), 0).toLocaleString()}</span></p>
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
        onDelete={handleDeletePayment}
      />
    </div>
  )
}
