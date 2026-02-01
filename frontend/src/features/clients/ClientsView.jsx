import { useState } from 'react'
import { Plus, Edit2, Trash2, Search, Filter, Mail, Phone, MapPin, History } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { ClientHistoryDialog } from './components/ClientHistoryDialog'
import { ClientDialog } from './components/ClientDialog'
import { useClients } from './hooks/useClients'

const STATUS_CONFIG = {
  activo: { label: 'Activo', color: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg' },
  inactivo: { label: 'Inactivo', color: 'bg-gradient-to-r from-stone-400 to-gray-400 text-white shadow-lg' },
}

export function ClientsView() {
  const { clients, isLoading, error, create, update, remove, refetch } = useClients()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [clientDialogOpen, setClientDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, clientId: null, clientName: '' })

  const filteredClients = clients.filter(client => {
    const fullName = `${client.nombre || ''} ${client.apellido || ''}`.toLowerCase()
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      client.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.documento?.toString().includes(searchTerm) ||
      client.telefono?.toString().includes(searchTerm)
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus
    return matchesSearch && matchesStatus
  })

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

  const handleSaveClient = async (clientData) => {
    try {
      if (selectedClient) {
        await update(selectedClient.id, clientData)
      } else {
        await create(clientData)
      }
      setClientDialogOpen(false)
      setSelectedClient(null)
    } catch (err) {
      console.error('Error saving client:', err)
      alert(err.message || 'Error al guardar el cliente')
    }
  }

  const handleDeleteClient = async () => {
    try {
      await remove(deleteConfirm.clientId)
      setDeleteConfirm({ show: false, clientId: null, clientName: '' })
      setClientDialogOpen(false)
      setSelectedClient(null)
    } catch (err) {
      console.error('Error deleting client:', err)
      alert(err.message || 'Error al eliminar el cliente')
      setDeleteConfirm({ show: false, clientId: null, clientName: '' })
    }
  }

  const confirmDelete = (client) => {
    const fullName = `${client.nombre || ''} ${client.apellido || ''}`
    setDeleteConfirm({ show: true, clientId: client.id, clientName: fullName })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-light">Cargando clientes...</p>
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
            <h1 className="text-4xl font-light tracking-wide text-emerald-950">Clientes</h1>
            <p className="text-gray-700 mt-2 font-light">Gestiona la información de los clientes del hotel</p>
          </div>
          <Button 
            onClick={handleCreateClient}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:scale-105 text-white px-6 py-3 rounded-full font-medium shadow-lg transition-all duration-300"
          >
            <Plus size={18} />
            Nuevo Cliente
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-800 p-6 rounded-3xl shadow-xl shadow-black/20 border border-emerald-700/30 transition-all duration-300 hover:scale-105">
            <p className="text-sm text-emerald-200 tracking-wide">Total Clientes</p>
            <p className="text-3xl font-light text-white mt-2">{clients.length}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-500 p-6 rounded-3xl shadow-xl shadow-black/20 border border-emerald-400/30 transition-all duration-300 hover:scale-105">
            <p className="text-sm text-emerald-100 tracking-wide">Activos</p>
            <p className="text-3xl font-light text-white mt-2">
              {clients.filter(c => c.status === 'activo').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-stone-600 via-gray-600 to-stone-500 p-6 rounded-3xl shadow-xl shadow-black/20 border border-stone-400/30 transition-all duration-300 hover:scale-105">
            <p className="text-sm text-stone-100 tracking-wide">Inactivos</p>
            <p className="text-3xl font-light text-white mt-2">
              {clients.filter(c => c.status === 'inactivo').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-xl shadow-black/10 border-2 border-emerald-200/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 h-12 rounded-xl bg-emerald-50/50 border border-emerald-200/30 focus:bg-white focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200/30 focus:outline-none transition-all duration-200 text-gray-700 placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter className="text-emerald-700" size={18} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-12 px-5 py-2 rounded-xl bg-emerald-50/50 border border-emerald-200/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200/30 focus:border-emerald-300 transition-all duration-200 font-light text-gray-700"
              >
                <option value="all">Todos los estados</option>
                <option value="activo">Activos</option>
                <option value="inactivo">Inactivos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl shadow-black/10 border-2 border-emerald-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-emerald-50 to-green-50 border-b-2 border-emerald-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium tracking-wide text-emerald-900">Cliente</th>
                  <th className="px-6 py-4 text-left text-sm font-medium tracking-wide text-emerald-900">Contacto</th>
                  <th className="px-6 py-4 text-left text-sm font-medium tracking-wide text-emerald-900">Documento</th>
                  <th className="px-6 py-4 text-left text-sm font-medium tracking-wide text-emerald-900">Rol</th>
                  <th className="px-6 py-4 text-left text-sm font-medium tracking-wide text-emerald-900">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-600 font-light">
                      No se encontraron clientes
                    </td>
                  </tr>
                ) : (
                  filteredClients.map(client => {
                    const fullName = `${client.nombre || ''} ${client.apellido || ''}`
                    return (
                    <tr key={client.id} className="hover:bg-emerald-50/50 transition-all duration-300">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-emerald-950">{fullName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-700 font-light">
                            <Mail size={14} className="text-emerald-600" />
                            {client.correo || 'N/A'}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700 font-light">
                            <Phone size={14} className="text-emerald-600" />
                            {client.telefono || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-light">{client.documento || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-700 font-light">{client.rol?.nombre || 'Sin rol'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEditClient(client)}
                            className="p-2.5 hover:bg-emerald-100 rounded-full transition-all duration-300 hover:scale-110"
                          >
                            <Edit2 size={16} className="text-emerald-700" />
                          </button>
                          <button 
                            onClick={() => confirmDelete(client)}
                            className="p-2.5 hover:bg-red-100 rounded-full transition-all duration-300 hover:scale-110"
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
          <p className="font-light">Mostrando <span className="font-medium text-emerald-900">{filteredClients.length}</span> de <span className="font-medium text-emerald-900">{clients.length}</span> clientes</p>
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
        onDelete={(id) => {
          const client = clients.find(c => c.id === id)
          confirmDelete(client)
        }}
      />

        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 z-60 flex items-center justify-center">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteConfirm({ show: false, clientId: null, clientName: '' })}
            />
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4 z-70 border-2 border-emerald-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                  <Trash2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-light tracking-wide text-emerald-950">Confirmar Eliminación</h3>
                  <p className="text-sm text-gray-700 mt-2 font-light">
                    ¿Estás seguro de que deseas eliminar el cliente <span className="font-medium text-emerald-900">"{deleteConfirm.clientName}"</span>? Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <Button
                  onClick={() => setDeleteConfirm({ show: false, clientId: null, clientName: '' })}
                  className="flex-1 bg-gradient-to-r from-stone-300 to-gray-300 text-gray-800 hover:scale-105 py-3 rounded-full font-medium transition-all duration-300 shadow-lg"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleDeleteClient}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:scale-105 text-white py-3 rounded-full font-medium transition-all duration-300 shadow-lg"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
