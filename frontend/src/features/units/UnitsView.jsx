import { useState } from 'react'
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { UnitDialog } from './components/UnitDialog'
import { useUnits } from './hooks/useUnits'

const STATUS_CONFIG = {
  disponible: { label: 'Disponible', color: 'bg-green-100 text-green-800 border-green-200' },
  ocupado: { label: 'Ocupado', color: 'bg-red-100 text-red-800 border-red-200' },
  mantenimiento: { label: 'Mantenimiento', color: 'bg-gray-100 text-gray-800 border-gray-200' },
}

export function UnitsView() {
  const { units, isLoading, error, create, update, remove, refetch } = useUnits()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, unitId: null, unitName: '' })

  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.tipo_hospedaje?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || unit.estado === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleCreateUnit = () => {
    setSelectedUnit(null)
    setDialogOpen(true)
  }

  const handleEditUnit = (unit) => {
    setSelectedUnit(unit)
    setDialogOpen(true)
  }

  const handleSaveUnit = async (unitData) => {
    try {
      if (selectedUnit) {
        await update(selectedUnit.id, unitData)
      } else {
        await create(unitData)
      }
      setDialogOpen(false)
      setSelectedUnit(null)
    } catch (err) {
      console.error('Error saving unit:', err)
      alert(err.message || 'Error al guardar la unidad')
    }
  }

  const handleDeleteUnit = async () => {
    try {
      await remove(deleteConfirm.unitId)
      setDeleteConfirm({ show: false, unitId: null, unitName: '' })
      setDialogOpen(false)
      setSelectedUnit(null)
    } catch (err) {
      console.error('Error deleting unit:', err)
      alert(err.message || 'Error al eliminar la unidad')
      setDeleteConfirm({ show: false, unitId: null, unitName: '' })
    }
  }

  const confirmDelete = (unit) => {
    setDeleteConfirm({ show: true, unitId: unit.id, unitName: unit.nombre })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando unidades...</p>
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
          <h1 className="text-3xl font-serif font-bold text-gray-900">Unidades de Alojamiento</h1>
          <p className="text-stone-600 mt-1">Gestiona las habitaciones y suites del hotel</p>
        </div>
        <Button 
          onClick={handleCreateUnit}
          className="flex items-center gap-2 bg-black hover:bg-stone-900 text-white px-4 py-2.5 rounded-lg font-medium"
        >
          <Plus size={18} />
          Nueva Unidad
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <p className="text-sm text-stone-600">Total Unidades</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{units.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <p className="text-sm text-green-800">Disponibles</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {units.filter(u => u.estado === 'disponible').length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
          <p className="text-sm text-red-800">Ocupadas</p>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {units.filter(u => u.estado === 'ocupado').length}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-800">Mantenimiento</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {units.filter(u => u.estado === 'mantenimiento').length}
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
              placeholder="Buscar por nombre o tipo..."
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
              <option value="disponible">Disponible</option>
              <option value="ocupado">Ocupado</option>
              <option value="mantenimiento">Mantenimiento</option>
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tipo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Capacidad</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Precio/Noche</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-stone-500">
                    No se encontraron unidades
                  </td>
                </tr>
              ) : (
                filteredUnits.map(unit => (
                  <tr key={unit.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{unit.nombre}</span>
                    </td>
                    <td className="px-6 py-4 text-stone-700">
                      {unit.tipo_hospedaje?.nombre || 'Sin tipo'}
                    </td>
                    <td className="px-6 py-4 text-stone-700">{unit.capacidad} personas</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">${unit.precio}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${STATUS_CONFIG[unit.estado].color}`}>
                        {STATUS_CONFIG[unit.estado].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditUnit(unit)}
                          className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} className="text-stone-600" />
                        </button>
                        <button 
                          onClick={() => confirmDelete(unit)}
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
        <p>Mostrando <span className="font-semibold text-gray-900">{filteredUnits.length}</span> de <span className="font-semibold text-gray-900">{units.length}</span> unidades</p>
        <p>Capacidad total: <span className="font-semibold text-gray-900">{units.reduce((sum, u) => sum + (u.capacidad || 0), 0)}</span> personas</p>
      </div>

      {/* Unit Dialog */}
      <UnitDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          setSelectedUnit(null)
        }}
        unit={selectedUnit}
        onSave={handleSaveUnit}
        onDelete={(id) => {
          const unit = units.find(u => u.id === id)
          confirmDelete(unit)
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/60"
            onClick={() => setDeleteConfirm({ show: false, unitId: null, unitName: '' })}
          />
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md mx-4 z-70">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
                <p className="text-sm text-gray-600 mt-1">
                  ¿Estás seguro de que deseas eliminar la unidad <span className="font-semibold">"{deleteConfirm.unitName}"</span>? Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setDeleteConfirm({ show: false, unitId: null, unitName: '' })}
                className="flex-1 bg-stone-200 border border-stone-300 text-black hover:bg-stone-300 py-2.5 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteUnit}
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
