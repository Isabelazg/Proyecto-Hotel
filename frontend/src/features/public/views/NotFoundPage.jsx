import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-950 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Organic background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-lime-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-400 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center relative z-10 max-w-2xl">
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 md:p-16 shadow-2xl shadow-black/20 border border-white/20">
          {/* Icon/Illustration */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-xl shadow-amber-900/30 mb-6">
              <span className="text-6xl">🌲</span>
            </div>
          </div>

          {/* 404 Number */}
          <div className="mb-6">
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-lime-200 via-emerald-200 to-green-200 bg-clip-text text-transparent tracking-tight leading-none">
              404
            </h1>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-50 mb-4 tracking-tight">
            Página No Encontrada
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-emerald-100 mb-10 leading-relaxed font-light tracking-wide max-w-lg mx-auto">
            Lo sentimos, parece que te has perdido en el bosque. 
            La página que buscas no existe o ha sido movida.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-gradient-to-r from-emerald-400 to-green-500 text-emerald-950 px-10 py-4 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-xl shadow-emerald-900/30 tracking-wide"
            >
              🏠 Volver al Inicio
            </Link>
            <Link
              to="/habitaciones"
              className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-emerald-50 px-10 py-4 rounded-full font-bold hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20 tracking-wide"
            >
              🏕️ Ver Alojamientos
            </Link>
          </div>
        </div>

        {/* Bottom suggestion */}
        <p className="mt-8 text-emerald-200 text-sm font-medium tracking-wide">
          ¿Necesitas ayuda? <a href="mailto:info@glampinghotel.com" className="text-lime-200 hover:text-lime-300 underline transition-colors">Contáctanos</a>
        </p>
      </div>
    </div>
  )
}
