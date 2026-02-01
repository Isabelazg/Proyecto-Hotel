import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchAvailability({ className = '' }) {
  const navigate = useNavigate()
  const [searchData, setSearchData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2'
  })

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Construir query params y navegar a la página de habitaciones
    const params = new URLSearchParams()
    if (searchData.checkIn) params.append('checkIn', searchData.checkIn)
    if (searchData.checkOut) params.append('checkOut', searchData.checkOut)
    if (searchData.guests) params.append('capacidad', searchData.guests)
    
    navigate(`/habitaciones?${params.toString()}`)
  }

  return (
    <div className={`bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl shadow-black/10 p-8 border border-white/50 ${className}`}>
      <h3 className="text-2xl font-bold mb-6 text-emerald-950 tracking-tight">
        Buscar Disponibilidad
      </h3>
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Check-in */}
          <div>
            <label className="block text-sm font-semibold text-emerald-900 mb-3 tracking-wide">
              Fecha de Entrada
            </label>
            <input
              type="date"
              name="checkIn"
              value={searchData.checkIn}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border-2 border-emerald-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white shadow-sm transition-all duration-300 text-gray-700 font-medium"
            />
          </div>

          {/* Check-out */}
          <div>
            <label className="block text-sm font-semibold text-emerald-900 mb-3 tracking-wide">
              Fecha de Salida
            </label>
            <input
              type="date"
              name="checkOut"
              value={searchData.checkOut}
              onChange={handleChange}
              min={searchData.checkIn || new Date().toISOString().split('T')[0]}
              className="w-full border-2 border-emerald-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white shadow-sm transition-all duration-300 text-gray-700 font-medium"
            />
          </div>

          {/* Huéspedes */}
          <div>
            <label className="block text-sm font-semibold text-emerald-900 mb-3 tracking-wide">
              Huéspedes
            </label>
            <select
              name="guests"
              value={searchData.guests}
              onChange={handleChange}
              className="w-full border-2 border-emerald-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white shadow-sm transition-all duration-300 text-gray-700 font-medium"
            >
              <option value="1">1 persona</option>
              <option value="2">2 personas</option>
              <option value="3">3 personas</option>
              <option value="4">4 personas</option>
              <option value="5">5+ personas</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-xl shadow-emerald-900/20 tracking-wide text-lg"
        >
          Buscar Disponibilidad
        </button>
      </form>
    </div>
  )
}
