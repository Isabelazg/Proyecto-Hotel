import { useState } from 'react'
import { usePublicUnits, useUnitTypes } from '../hooks/usePublicUnits'
import UnitCard from '../components/UnitCard'

export default function UnitsView() {
  const [filters, setFilters] = useState({
    tipoHospedajeId: '',
    precioMin: '',
    precioMax: '',
    capacidad: '',
    page: 1,
    limit: 9
  })

  const { units, loading, error, pagination } = usePublicUnits(filters)
  const { types } = useUnitTypes()

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }))
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-gradient-to-b from-stone-50 to-emerald-50">
      {/* Hero Section */}
      <section className="relative min-h-[500px] bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-950 text-emerald-50 overflow-hidden">
        {/* Organic background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-lime-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 min-h-[500px] flex items-center relative z-10">
          <div className="max-w-3xl mx-auto text-center py-20">
            <div className="inline-block mb-6 px-6 py-2 bg-emerald-800/40 backdrop-blur-md rounded-full border border-emerald-700/30">
              <span className="text-amber-200 font-medium tracking-wide text-sm">🏕️ Nuestros Espacios</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
              Encuentra tu
              <span className="block text-lime-200 mt-2">Refugio Natural</span>
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 leading-relaxed font-light tracking-wide">
              Explora nuestras opciones de alojamiento y descubre el espacio perfecto para tu experiencia
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section - Superpuesto sobre el hero */}
      <section className="relative z-20 -mt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl shadow-black/10 p-8 border border-white/50">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-3 tracking-wide">
                  Tipo de Hospedaje
                </label>
                <select
                  value={filters.tipoHospedajeId}
                  onChange={(e) => handleFilterChange('tipoHospedajeId', e.target.value)}
                  className="w-full border-2 border-emerald-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white shadow-sm transition-all duration-300 text-gray-700 font-medium"
                >
                  <option value="">Todos</option>
                  {types.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-3 tracking-wide">
                  Precio Mínimo
                </label>
                <input
                  type="number"
                  value={filters.precioMin}
                  onChange={(e) => handleFilterChange('precioMin', e.target.value)}
                  placeholder="$0"
                  className="w-full border-2 border-emerald-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white shadow-sm transition-all duration-300 text-gray-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-3 tracking-wide">
                  Precio Máximo
                </label>
                <input
                  type="number"
                  value={filters.precioMax}
                  onChange={(e) => handleFilterChange('precioMax', e.target.value)}
                  placeholder="$1000"
                  className="w-full border-2 border-emerald-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white shadow-sm transition-all duration-300 text-gray-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-3 tracking-wide">
                  Capacidad
                </label>
                <select
                  value={filters.capacidad}
                  onChange={(e) => handleFilterChange('capacidad', e.target.value)}
                  className="w-full border-2 border-emerald-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white shadow-sm transition-all duration-300 text-gray-700 font-medium"
                >
                  <option value="">Cualquiera</option>
                  <option value="1">1 persona</option>
                  <option value="2">2 personas</option>
                  <option value="3">3 personas</option>
                  <option value="4">4+ personas</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setFilters({
                    tipoHospedajeId: '',
                    precioMin: '',
                    precioMax: '',
                    capacidad: '',
                    page: 1,
                    limit: 9
                  })}
                  className="w-full bg-gradient-to-r from-stone-200 to-amber-200 text-emerald-900 px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 font-semibold shadow-lg shadow-black/5 tracking-wide"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Units Grid Section */}
      <section className="py-16 pb-24">
        <div className="container mx-auto px-6">
          {loading && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full mb-6 shadow-xl shadow-emerald-900/20">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-emerald-900 font-semibold text-lg tracking-wide">Cargando alojamientos...</p>
            </div>
          )}

          {error && (
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-3xl p-10 text-center shadow-xl shadow-red-900/10">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-700 mb-6 font-medium">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 font-semibold shadow-lg shadow-red-900/20 tracking-wide"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {!loading && !error && units.length === 0 && (
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-amber-50 to-stone-50 border-2 border-amber-200 rounded-3xl p-10 text-center shadow-xl shadow-amber-900/10">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-2xl font-bold text-emerald-950 mb-3 tracking-tight">No hay resultados</h3>
                <p className="text-gray-600 mb-6 font-light leading-relaxed">
                  No se encontraron alojamientos con los filtros seleccionados.
                </p>
                <button
                  onClick={() => setFilters({
                    tipoHospedajeId: '',
                    precioMin: '',
                    precioMax: '',
                    capacidad: '',
                    page: 1,
                    limit: 9
                  })}
                  className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 font-semibold shadow-lg shadow-emerald-900/20 tracking-wide"
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>
          )}

          {!loading && !error && units.length > 0 && (
            <>
              <div className="mb-10">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4 inline-block shadow-lg shadow-black/5 border border-white/50">
                  <p className="text-gray-700 font-medium tracking-wide">
                    Mostrando <span className="font-bold text-emerald-700">{units.length}</span> de{' '}
                    <span className="font-bold text-emerald-900">{pagination?.total || units.length}</span> alojamientos
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {units.map(unit => (
                  <UnitCard key={unit.id} unit={unit} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-3 mt-16">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-emerald-200 text-emerald-700 rounded-full hover:bg-emerald-50 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 font-semibold shadow-lg shadow-black/5 tracking-wide"
                  >
                    ← Anterior
                  </button>
                  
                  <div className="flex space-x-2">
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-12 h-12 rounded-full font-bold transition-all duration-300 tracking-wide ${
                            filters.page === page
                              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-xl shadow-emerald-900/30 scale-110'
                              : 'bg-white/80 backdrop-blur-sm border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:scale-105 shadow-lg shadow-black/5'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    {pagination.totalPages > 5 && (
                      <span className="px-3 text-emerald-600 font-bold flex items-center">...</span>
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === pagination.totalPages}
                    className="px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-emerald-200 text-emerald-700 rounded-full hover:bg-emerald-50 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 font-semibold shadow-lg shadow-black/5 tracking-wide"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
