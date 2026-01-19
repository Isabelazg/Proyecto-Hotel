import { useState } from 'react'
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { UnitDialog } from './components/UnitDialog'

const MOCK_UNITS = [
  { id: 1, number: '101', type: 'Habitación Estándar', capacity: 2, status: 'disponible', floor: 1, price: 150 },
  { id: 2, number: '102', type: 'Habitación Estándar', capacity: 2, status: 'ocupada', floor: 1, price: 150 },
  { id: 3, number: '103', type: 'Habitación Ejecutiva', capacity: 3, status: 'disponible', floor: 1, price: 250 },
  { id: 4, number: '201', type: 'Suite Deluxe', capacity: 4, status: 'mantenimiento', floor: 2, price: 400 },
  { id: 5, number: '202', type: 'Suite Deluxe', capacity: 4, status: 'disponible', floor: 2, price: 400 },
  { id: 6, number: '301', type: 'Suite Presidencial', capacity: 6, status: 'reservada', floor: 3, price: 800 },
  { id: 7, number: '104', type: 'Habitación Estándar', capacity: 2, status: 'disponible', floor: 1, price: 150 },
  { id: 8, number: '203', type: 'Habitación Ejecutiva', capacity: 3, status: 'limpieza', floor: 2, price: 250 },
]

const STATUS_CONFIG = {
  disponible: { label: 'Disponible', color: 'bg-green-100 text-green-800 border-green-200' },
  ocupada: { label: 'Ocupada', color: 'bg-red-100 text-red-800 border-red-200' },
  reservada: { label: 'Reservada', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  mantenimiento: { label: 'Mantenimiento', color: 'bg-gray-100 text-gray-800 border-gray-200' },
  limpieza: { label: 'Limpieza', color: 'bg-blue-100 text-blue-800 border-blue-200' },
}

export function UnitsView() {
  const [units, setUnits] = useState(MOCK_UNITS)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState(null)

  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || unit.status === filterStatus
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

  const handleSaveUnit = (unitData) => {
    if (selectedUnit) {
      setUnits(units.map(u => u.id === selectedUnit.id ? unitData : u))
    } else {
      setUnits([...units, unitData])
    }
    setDialogOpen(false)
    setSelectedUnit(null)
  }

  const handleDeleteUnit = (id) => {
    setUnits(units.filter(u => u.id !== id))
    setDialogOpen(false)
    setSelectedUnit(null)
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <p className="text-sm text-stone-600">Total Unidades</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{units.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <p className="text-sm text-green-800">Disponibles</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {units.filter(u => u.status === 'disponible').length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
          <p className="text-sm text-red-800">Ocupadas</p>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {units.filter(u => u.status === 'ocupada').length}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
          <p className="text-sm text-orange-800">Reservadas</p>
          <p className="text-2xl font-bold text-orange-900 mt-1">
            {units.filter(u => u.status === 'reservada').length}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-800">Mantenimiento</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {units.filter(u => u.status === 'mantenimiento' || u.status === 'limpieza').length}
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
              placeholder="Buscar por número o tipo de habitación..."
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
              <option value="ocupada">Ocupada</option>
              <option value="reservada">Reservada</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="limpieza">Limpieza</option>
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Número</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tipo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Piso</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Capacidad</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Precio/Noche</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-stone-500">
                    No se encontraron unidades
                  </td>
                </tr>
              ) : (
                filteredUnits.map(unit => (
                  <tr key={unit.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{unit.number}</span>
                    </td>
                    <td className="px-6 py-4 text-stone-700">{unit.type}</td>
                    <td className="px-6 py-4 text-stone-700">{unit.floor}</td>
                    <td className="px-6 py-4 text-stone-700">{unit.capacity} personas</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">${unit.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${STATUS_CONFIG[unit.status].color}`}>
                        {STATUS_CONFIG[unit.status].label}
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
                          onClick={() => {
                            if (window.confirm('¿Estás seguro de eliminar esta unidad?')) {
                              handleDeleteUnit(unit.id)
                            }
                          }}
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
        <p>Capacidad total: <span className="font-semibold text-gray-900">{units.reduce((sum, u) => sum + u.capacity, 0)}</span> personas</p>
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
        onDelete={handleDeleteUnit}
      />
    </div>
  )
}
