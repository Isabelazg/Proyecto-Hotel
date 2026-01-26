import { useState } from 'react'
import { Plus, Edit2, Trash2, Search, Filter, Mail, Phone, MapPin, History } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { ClientHistoryDialog } from './components/ClientHistoryDialog'
import { ClientDialog } from './components/ClientDialog'
import { useClients } from './hooks/useClients'

const STATUS_CONFIG = {
  activo: { label: 'Activo', color: 'bg-green-100 text-green-800 border-green-200' },
  inactivo: { label: 'Inactivo', color: 'bg-gray-100 text-gray-800 border-gray-200' },
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando clientes...</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rol</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-stone-500">
                    No se encontraron clientes
                  </td>
                </tr>
              ) : (
                filteredClients.map(client => {
                  const fullName = `${client.nombre || ''} ${client.apellido || ''}`
                  return (
                  <tr key={client.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{fullName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-stone-700">
                          <Mail size={14} className="text-stone-400" />
                          {client.correo || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-stone-700">
                          <Phone size={14} className="text-stone-400" />
                          {client.telefono || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-700">{client.documento || 'N/A'}</td>
                    <td className="px-6 py-4 text-stone-700">{client.rol?.nombre || 'Sin rol'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditClient(client)}
                          className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} className="text-stone-600" />
                        </button>
                        <button 
                          onClick={() => confirmDelete(client)}
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
        <p>Mostrando <span className="font-semibold text-gray-900">{filteredClients.length}</span> de <span className="font-semibold text-gray-900">{clients.length}</span> clientes</p>
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
            className="fixed inset-0 bg-black/60"
            onClick={() => setDeleteConfirm({ show: false, clientId: null, clientName: '' })}
          />
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md mx-4 z-70">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
                <p className="text-sm text-gray-600 mt-1">
                  ¿Estás seguro de que deseas eliminar el cliente <span className="font-semibold">"{deleteConfirm.clientName}"</span>? Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setDeleteConfirm({ show: false, clientId: null, clientName: '' })}
                className="flex-1 bg-stone-200 border border-stone-300 text-black hover:bg-stone-300 py-2.5 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteClient}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition-colors"
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
