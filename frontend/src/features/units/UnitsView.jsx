import { useState } from 'react'
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { UnitDialog } from './components/UnitDialog'
import { useUnits } from './hooks/useUnits'

const STATUS_CONFIG = {
  disponible: { label: 'Disponible', color: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg' },
  ocupado: { label: 'Ocupado', color: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' },
  mantenimiento: { label: 'Mantenimiento', color: 'bg-gradient-to-r from-stone-400 to-gray-400 text-white shadow-lg' },
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-light">Cargando unidades...</p>
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
            <h1 className="text-4xl font-light tracking-wide text-emerald-950">Unidades de Alojamiento</h1>
            <p className="text-gray-700 mt-2 font-light">Gestiona las habitaciones y suites del hotel</p>
          </div>
          <Button 
            onClick={handleCreateUnit}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:scale-105 text-white px-6 py-3 rounded-full font-medium shadow-lg transition-all duration-300"
          >
            <Plus size={18} />
            Nueva Unidad
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-800 p-6 rounded-3xl shadow-xl shadow-black/20 border border-emerald-700/30 transition-all duration-300 hover:scale-105">
            <p className="text-sm text-emerald-200 tracking-wide">Total Unidades</p>
            <p className="text-3xl font-light text-white mt-2">{units.length}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-500 p-6 rounded-3xl shadow-xl shadow-black/20 border border-emerald-400/30 transition-all duration-300 hover:scale-105">
            <p className="text-sm text-emerald-100 tracking-wide">Disponibles</p>
            <p className="text-3xl font-light text-white mt-2">
              {units.filter(u => u.estado === 'disponible').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-amber-500 p-6 rounded-3xl shadow-xl shadow-black/20 border border-amber-400/30 transition-all duration-300 hover:scale-105">
            <p className="text-sm text-amber-100 tracking-wide">Ocupadas</p>
            <p className="text-3xl font-light text-white mt-2">
              {units.filter(u => u.estado === 'ocupado').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-stone-600 via-gray-600 to-stone-500 p-6 rounded-3xl shadow-xl shadow-black/20 border border-stone-400/30 transition-all duration-300 hover:scale-105">
            <p className="text-sm text-stone-100 tracking-wide">Mantenimiento</p>
            <p className="text-3xl font-light text-white mt-2">
              {units.filter(u => u.estado === 'mantenimiento').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-xl shadow-black/10 border-2 border-emerald-200/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por nombre o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 h-12 rounded-xl bg-emerald-50/50 border border-emerald-200/30 focus:bg-white focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200/30 focus:outline-none transition-all duration-200 text-gray-700 placeholder:text-gray-400"
              />
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-12 px-5 py-2 rounded-xl bg-emerald-50/50 border border-emerald-200/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200/30 focus:border-emerald-300 transition-all duration-200 font-light text-gray-700 appearance-none pr-10"
                style={{ backgroundImage: 'none' }}
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
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl shadow-black/10 border-2 border-emerald-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-emerald-50 to-green-50 border-b-2 border-emerald-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium tracking-wide text-emerald-900">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-medium tracking-wide text-emerald-900">Tipo</th>
                  <th className="px-6 py-4 text-left text-sm font-medium tracking-wide text-emerald-900">Capacidad</th>
                  <th className="px-6 py-4 text-left text-sm font-medium tracking-wide text-emerald-900">Precio/Noche</th>
                  <th className="px-6 py-4 text-left text-sm font-medium tracking-wide text-emerald-900">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-medium tracking-wide text-emerald-900">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100">
                {filteredUnits.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-600 font-light">
                      No se encontraron unidades
                    </td>
                  </tr>
                ) : (
                  filteredUnits.map(unit => (
                    <tr key={unit.id} className="hover:bg-emerald-50/50 transition-all duration-300">
                      <td className="px-6 py-4">
                        <span className="font-medium text-emerald-950">{unit.nombre}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-light">
                        {unit.tipo_hospedaje?.nombre || 'Sin tipo'}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-light">{unit.capacidad} personas</td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-emerald-900">${unit.precio}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1.5 text-xs font-medium rounded-full ${STATUS_CONFIG[unit.estado].color}`}>
                          {STATUS_CONFIG[unit.estado].label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEditUnit(unit)}
                            className="p-2.5 hover:bg-emerald-100 rounded-full transition-all duration-300 hover:scale-110"
                          >
                            <Edit2 size={16} className="text-emerald-700" />
                          </button>
                          <button 
                            onClick={() => confirmDelete(unit)}
                            className="p-2.5 hover:bg-red-100 rounded-full transition-all duration-300 hover:scale-110"
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
        <div className="flex items-center justify-between text-sm text-gray-700 bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-xl shadow-black/10 border-2 border-emerald-200/50">
          <p className="font-light">Mostrando <span className="font-medium text-emerald-900">{filteredUnits.length}</span> de <span className="font-medium text-emerald-900">{units.length}</span> unidades</p>
          <p className="font-light">Capacidad total: <span className="font-medium text-emerald-900">{units.reduce((sum, u) => sum + (u.capacidad || 0), 0)}</span> personas</p>
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteConfirm({ show: false, unitId: null, unitName: '' })}
            />
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4 z-70 border-2 border-emerald-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                  <Trash2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-light tracking-wide text-emerald-950">Confirmar Eliminación</h3>
                  <p className="text-sm text-gray-700 mt-2 font-light">
                    ¿Estás seguro de que deseas eliminar la unidad <span className="font-medium text-emerald-900">"{deleteConfirm.unitName}"</span>? Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <Button
                  onClick={() => setDeleteConfirm({ show: false, unitId: null, unitName: '' })}
                  className="flex-1 bg-gradient-to-r from-stone-300 to-gray-300 text-gray-800 hover:scale-105 py-3 rounded-full font-medium transition-all duration-300 shadow-lg"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleDeleteUnit}
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
