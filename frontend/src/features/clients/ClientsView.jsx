import { useState } from 'react'
import { Plus, Edit2, Trash2, Search, Filter, Mail, Phone, MapPin, History } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { ClientHistoryDialog } from './components/ClientHistoryDialog'
import { ClientDialog } from './components/ClientDialog'

const MOCK_CLIENTS = [
  { id: 1, name: 'María González', email: 'maria.gonzalez@email.com', phone: '+1 234-567-8900', document: 'DNI 12345678', address: 'Calle Principal 123', city: 'Madrid', country: 'España', reservations: 5, status: 'activo' },
  { id: 2, name: 'Juan Pérez', email: 'juan.perez@email.com', phone: '+1 234-567-8901', document: 'DNI 87654321', address: 'Avenida Central 456', city: 'Barcelona', country: 'España', reservations: 12, status: 'activo' },
  { id: 3, name: 'Ana Martínez', email: 'ana.martinez@email.com', phone: '+1 234-567-8902', document: 'DNI 11223344', address: 'Plaza Mayor 789', city: 'Valencia', country: 'España', reservations: 3, status: 'activo' },
  { id: 4, name: 'Carlos López', email: 'carlos.lopez@email.com', phone: '+1 234-567-8903', document: 'DNI 44332211', address: 'Paseo Marítimo 321', city: 'Sevilla', country: 'España', reservations: 8, status: 'inactivo' },
  { id: 5, name: 'Laura Sánchez', email: 'laura.sanchez@email.com', phone: '+1 234-567-8904', document: 'DNI 55667788', address: 'Calle Luna 654', city: 'Bilbao', country: 'España', reservations: 15, status: 'activo' },
  { id: 6, name: 'Pedro Ramírez', email: 'pedro.ramirez@email.com', phone: '+1 234-567-8905', document: 'DNI 99887766', address: 'Avenida Sol 987', city: 'Málaga', country: 'España', reservations: 1, status: 'activo' },
]

const STATUS_CONFIG = {
  activo: { label: 'Activo', color: 'bg-green-100 text-green-800 border-green-200' },
  inactivo: { label: 'Inactivo', color: 'bg-gray-100 text-gray-800 border-gray-200' },
}

export function ClientsView() {
  const [clients, setClients] = useState(MOCK_CLIENTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [clientDialogOpen, setClientDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.document.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      setClients(clients.filter(c => c.id !== id))
    }
  }

  const handleViewHistory = (client) => {
    setSelectedClient(client)
    setHistoryDialogOpen(true)
  }

  const handleCreateClient = () => {
    setSelectedClient(null)
    setClientDialogOpen(true)
  }

  const handleEditClient = (client) => {
    setSelectedClient(client)
    setClientDialogOpen(true)
  }

  const handleSaveClient = (clientData) => {
    if (selectedClient) {
      setClients(clients.map(c => c.id === selectedClient.id ? clientData : c))
    } else {
      setClients([...clients, clientData])
    }
    setClientDialogOpen(false)
    setSelectedClient(null)
  }

  const handleDeleteClient = (id) => {
    setClients(clients.filter(c => c.id !== id))
    setClientDialogOpen(false)
    setSelectedClient(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Clientes</h1>
          <p className="text-stone-600 mt-1">Gestiona la información de los clientes del hotel</p>
        </div>
        <Button 
          onClick={handleCreateClient}
          className="flex items-center gap-2 bg-black hover:bg-stone-900 text-white px-4 py-2.5 rounded-lg font-medium"
        >
          <Plus size={18} />
          Nuevo Cliente
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <p className="text-sm text-stone-600">Total Clientes</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{clients.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <p className="text-sm text-green-800">Activos</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {clients.filter(c => c.status === 'activo').length}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-800">Inactivos</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {clients.filter(c => c.status === 'inactivo').length}
          </p>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
          <p className="text-sm text-amber-800">Total Reservas</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">
            {clients.reduce((sum, c) => sum + c.reservations, 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-stone-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <Input
              type="text"
              placeholder="Buscar por nombre, email, documento o teléfono..."
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
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contacto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Documento</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ubicación</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reservas</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-stone-500">
                    No se encontraron clientes
                  </td>
                </tr>
              ) : (
                filteredClients.map(client => (
                  <tr key={client.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{client.name}</p>
                        <p className="text-sm text-stone-600">{client.city}, {client.country}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-stone-700">
                          <Mail size={14} className="text-stone-400" />
                          {client.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-stone-700">
                          <Phone size={14} className="text-stone-400" />
                          {client.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-700">{client.document}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-stone-400 mt-0.5" />
                        <span className="text-sm text-stone-700">{client.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{client.reservations}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${STATUS_CONFIG[client.status].color}`}>
                        {STATUS_CONFIG[client.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewHistory(client)}
                          className="p-2 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Ver historial"
                        >
                          <History size={16} className="text-amber-600" />
                        </button>
                        <button 
                          onClick={() => handleEditClient(client)}
                          className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} className="text-stone-600" />
                        </button>
                        <button 
                          onClick={() => handleDelete(client.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Summary */}
      <div className="flex items-center justify-between text-sm text-stone-600 bg-white p-4 rounded-xl border border-stone-200">
        <p>Mostrando <span className="font-semibold text-gray-900">{filteredClients.length}</span> de <span className="font-semibold text-gray-900">{clients.length}</span> clientes</p>
        <p>Promedio de reservas: <span className="font-semibold text-gray-900">{clients.length > 0 ? (clients.reduce((sum, c) => sum + c.reservations, 0) / clients.length).toFixed(1) : 0}</span> por cliente</p>
      </div>

      {/* Client History Dialog */}
      <ClientHistoryDialog
        open={historyDialogOpen}
        onClose={() => {
          setHistoryDialogOpen(false)
          setSelectedClient(null)
        }}
        client={selectedClient}
      />

      {/* Client Dialog */}
      <ClientDialog
        open={clientDialogOpen}
        onClose={() => {
          setClientDialogOpen(false)
          setSelectedClient(null)
        }}
        client={selectedClient}
        onSave={handleSaveClient}
        onDelete={handleDeleteClient}
      />
    </div>
  )
}
