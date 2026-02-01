import { Link } from 'react-router-dom'

export default function UnitCard({ unit }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
      {/* Image */}
      <div className="relative h-64 bg-gradient-to-br from-emerald-400 to-teal-600 overflow-hidden">
        {unit.imagen ? (
          <img
            src={unit.imagen}
            alt={unit.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white text-7xl group-hover:scale-110 transition-transform duration-500">
            🏕️
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Estado badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
              unit.estado === 'disponible'
                ? 'bg-green-500/90 text-white'
                : unit.estado === 'ocupado'
                ? 'bg-red-500/90 text-white'
                : 'bg-yellow-500/90 text-white'
            }`}
          >
            {unit.estado === 'disponible' ? '✓ Disponible' : 
             unit.estado === 'ocupado' ? '✕ Ocupado' : 
             '⚠ Mantenimiento'}
          </span>
        </div>

        {/* Tipo badge */}
        {unit.TipoHospedaje && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-emerald-700 rounded-full text-xs font-bold shadow-lg">
              {unit.TipoHospedaje.nombre}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Nombre */}
        <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-emerald-600 transition-colors">
          {unit.nombre}
        </h3>

        {/* Descripción */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {unit.descripcion || 'Hermoso espacio diseñado para tu confort y descanso en un entorno natural único'}
        </p>

        {/* Características */}
        <div className="flex flex-wrap gap-4 mb-5">
          <div className="flex items-center text-gray-700">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-sm font-semibold">{unit.capacidad || 2} personas</span>
          </div>
          <div className="flex items-center text-gray-700">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-sm font-semibold">Nº {unit.numero}</span>
          </div>
        </div>

        {/* Precio y acción */}
        <div className="flex items-center justify-between pt-5 border-t-2 border-gray-100">
          <div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-emerald-600">
                ${unit.precio || '0'}
              </span>
              <span className="text-sm text-gray-500 ml-2">/noche</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Impuestos incluidos</p>
          </div>
          <Link
            to={`/habitaciones/${unit.id}`}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
          >
            Ver Más
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
