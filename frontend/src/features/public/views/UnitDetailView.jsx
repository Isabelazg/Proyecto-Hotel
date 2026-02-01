import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useUnitDetails } from '../hooks/usePublicUnits'

export default function UnitDetailView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { unit, loading, error } = useUnitDetails(id)
  const [selectedImage, setSelectedImage] = useState(0)

  // Mock images - you can replace with actual images from the backend
  const images = [
    unit?.imagen || '',
    unit?.imagen || '',
    unit?.imagen || '',
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full mb-6 shadow-xl shadow-emerald-900/20">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-emerald-900 font-semibold text-lg tracking-wide">Cargando detalles...</p>
        </div>
      </div>
    )
  }

  if (error || !unit) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-3xl p-10 shadow-xl shadow-red-900/10">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-700 text-lg mb-6 font-medium">
              {error || 'No se pudo cargar la información del alojamiento'}
            </p>
            <Link
              to="/habitaciones"
              className="inline-block bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 font-semibold shadow-lg shadow-emerald-900/20 tracking-wide"
            >
              ← Volver a Alojamientos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-stone-50 to-emerald-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white/60 backdrop-blur-md border-b border-emerald-100/50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center space-x-3 text-sm font-medium">
            <Link to="/" className="text-gray-600 hover:text-emerald-700 transition-colors tracking-wide">Inicio</Link>
            <span className="text-emerald-400">→</span>
            <Link to="/habitaciones" className="text-gray-600 hover:text-emerald-700 transition-colors tracking-wide">Alojamientos</Link>
            <span className="text-emerald-400">→</span>
            <span className="text-emerald-900 font-semibold tracking-wide">{unit.nombre}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl shadow-black/10 border border-white/50">
              {/* Main Image */}
              <div className="relative h-[500px] bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage]}
                    alt={unit.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <span className="text-9xl mb-4 block">🏕️</span>
                      <p className="text-white text-xl font-light tracking-wide">Vista del alojamiento</p>
                    </div>
                  </div>
                )}
                {/* Status badge overlay */}
                <div className="absolute top-6 right-6">
                  <span
                    className={`px-6 py-3 rounded-full text-sm font-bold backdrop-blur-md shadow-xl tracking-wide ${
                      unit.estado === 'disponible'
                        ? 'bg-green-500/90 text-white'
                        : unit.estado === 'ocupado'
                        ? 'bg-red-500/90 text-white'
                        : 'bg-amber-500/90 text-white'
                    }`}
                  >
                    {unit.estado === 'disponible' ? '✓ Disponible' : 
                     unit.estado === 'ocupado' ? '✗ Ocupado' : 
                     '⚠ Mantenimiento'}
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-4 p-6 bg-gradient-to-r from-emerald-50 to-lime-50">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-28 h-28 rounded-2xl overflow-hidden transition-all duration-300 ${
                      selectedImage === index
                        ? 'ring-4 ring-emerald-500 scale-105 shadow-xl shadow-emerald-900/20'
                        : 'ring-2 ring-emerald-200 hover:scale-105 shadow-lg shadow-black/5'
                    }`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-3xl">
                      🏕️
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-black/5 p-10 border border-white/50">
              <div className="mb-8">
                {unit.TipoHospedaje && (
                  <div className="inline-block mb-4 px-5 py-2 bg-gradient-to-r from-emerald-100 to-lime-100 rounded-full">
                    <span className="text-sm font-bold text-emerald-800 uppercase tracking-widest">
                      {unit.TipoHospedaje.nombre}
                    </span>
                  </div>
                )}
                <h1 className="text-4xl md:text-5xl font-bold text-emerald-950 tracking-tight leading-tight">
                  {unit.nombre}
                </h1>
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-8 mb-10 pb-10 border-b border-emerald-100">
                <div className="flex items-center bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 rounded-2xl shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-emerald-900/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Capacidad</p>
                    <p className="text-lg font-bold text-emerald-900">{unit.capacidad || 2} personas</p>
                  </div>
                </div>
                <div className="flex items-center bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 rounded-2xl shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-amber-900/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Número</p>
                    <p className="text-lg font-bold text-emerald-900">{unit.numero}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-5 text-emerald-950 tracking-tight flex items-center">
                  <span className="w-1.5 h-8 bg-gradient-to-b from-emerald-400 to-green-500 rounded-full mr-3"></span>
                  Descripción
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg font-light">
                  {unit.descripcion || 
                   'Disfruta de una experiencia única en nuestra exclusiva habitación, diseñada para ofrecerte el máximo confort en un entorno natural incomparable. Equipada con todas las comodidades modernas, esta unidad es perfecta para una escapada romántica o unas vacaciones en familia.'}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-emerald-950 tracking-tight flex items-center">
                  <span className="w-1.5 h-8 bg-gradient-to-b from-lime-400 to-emerald-500 rounded-full mr-3"></span>
                  Comodidades
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: '📶', text: 'Wi-Fi Gratis' },
                    { icon: '❄️', text: 'Aire Acondicionado' },
                    { icon: '📺', text: 'TV por Cable' },
                    { icon: '🚿', text: 'Baño Privado' },
                    { icon: '🍷', text: 'Minibar' },
                    { icon: '🌿', text: 'Terraza Privada' }
                  ].map((amenity, index) => (
                    <div key={index} className="flex items-center bg-gradient-to-r from-emerald-50 to-green-50 px-5 py-4 rounded-2xl shadow-sm border border-emerald-100/50 hover:scale-105 transition-all duration-300">
                      <span className="text-2xl mr-4">{amenity.icon}</span>
                      <span className="text-gray-800 font-medium tracking-wide">{amenity.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl shadow-black/10 p-8 sticky top-24 border border-white/50">
              <div className="mb-8">
                <div className="bg-gradient-to-r from-emerald-50 to-lime-50 rounded-2xl p-6 mb-6 border border-emerald-100/50">
                  <p className="text-sm text-gray-600 font-medium tracking-wide mb-2">Precio por noche</p>
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-emerald-700">
                      ${unit.precio || '0'}
                    </span>
                    <span className="text-gray-500 ml-2 text-lg">/noche</span>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="space-y-5 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-emerald-900 mb-3 tracking-wide">
                    Check-in
                  </label>
                  <input
                    type="date"
                    className="w-full border-2 border-emerald-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white shadow-sm transition-all duration-300 text-gray-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-emerald-900 mb-3 tracking-wide">
                    Check-out
                  </label>
                  <input
                    type="date"
                    className="w-full border-2 border-emerald-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white shadow-sm transition-all duration-300 text-gray-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-emerald-900 mb-3 tracking-wide">
                    Huéspedes
                  </label>
                  <select className="w-full border-2 border-emerald-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white shadow-sm transition-all duration-300 text-gray-700 font-medium">
                    <option>1 persona</option>
                    <option>2 personas</option>
                    <option>3 personas</option>
                    <option>4+ personas</option>
                  </select>
                </div>
              </div>

              <button
                disabled={unit.estado !== 'disponible'}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-4 rounded-full font-bold hover:scale-105 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl shadow-emerald-900/20 tracking-wide text-lg mb-4"
              >
                {unit.estado === 'disponible' ? '✓ Reservar Ahora' : 'No Disponible'}
              </button>

              <p className="text-xs text-gray-500 text-center font-medium tracking-wide mb-6">
                No se realizará ningún cargo todavía
              </p>

              {/* Contact Info */}
              <div className="pt-6 border-t border-emerald-100 space-y-4">
                <p className="text-sm font-semibold text-emerald-900 mb-4 tracking-wide">¿Necesitas ayuda?</p>
                <a href="tel:+571234567890" className="flex items-center text-sm text-gray-700 hover:text-emerald-700 transition-colors bg-emerald-50 px-4 py-3 rounded-xl group">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-900/20">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="font-medium">+57 123 456 7890</span>
                </a>
                <a href="mailto:info@glampinghotel.com" className="flex items-center text-sm text-gray-700 hover:text-emerald-700 transition-colors bg-emerald-50 px-4 py-3 rounded-xl group">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform shadow-lg shadow-amber-900/20">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium">info@glampinghotel.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
