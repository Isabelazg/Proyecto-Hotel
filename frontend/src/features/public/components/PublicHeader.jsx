import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-gradient-to-r from-emerald-900 via-green-900 to-emerald-900 backdrop-blur-lg shadow-2xl shadow-emerald-950/50 sticky top-0 z-50 border-b border-emerald-800/30">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="text-2xl font-bold text-emerald-50 tracking-wide group-hover:text-lime-300 transition-colors duration-300">
              Glamping Hotel
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            <Link
              to="/"
              className="text-emerald-100 hover:text-lime-300 font-medium transition-all duration-300 tracking-wide relative group"
            >
              Inicio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-lime-400 to-emerald-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            <Link
              to="/habitaciones"
              className="text-emerald-100 hover:text-lime-300 font-medium transition-all duration-300 tracking-wide relative group"
            >
              Habitaciones
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-lime-400 to-emerald-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            <Link
              to="/sobre-nosotros"
              className="text-emerald-100 hover:text-lime-300 font-medium transition-all duration-300 tracking-wide relative group"
            >
              Sobre Nosotros
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-lime-400 to-emerald-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            <Link
              to="/contacto"
              className="text-emerald-100 hover:text-lime-300 font-medium transition-all duration-300 tracking-wide relative group"
            >
              Contacto
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-lime-400 to-emerald-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/admin/login"
              className="text-emerald-100 hover:text-lime-300 font-medium transition-all duration-300 tracking-wide px-4 py-2 rounded-full hover:bg-emerald-800/30 backdrop-blur-sm"
            >
              Inicio de Sesión
            </Link>
            <Link
              to="/habitaciones"
              className="bg-gradient-to-r from-lime-400 to-emerald-400 text-emerald-950 px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 font-bold shadow-lg shadow-black/30 tracking-wide"
            >
              Reservar Ahora
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-emerald-50 p-2 rounded-full hover:bg-emerald-800/30 transition-all duration-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-6 pt-4 border-t border-emerald-800/30 mt-2">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-emerald-100 hover:text-lime-300 font-medium transition-all duration-300 tracking-wide px-4 py-3 rounded-2xl hover:bg-emerald-800/30 backdrop-blur-sm"
              >
                Inicio
              </Link>
              <Link
                to="/habitaciones"
                onClick={() => setMobileMenuOpen(false)}
                className="text-emerald-100 hover:text-lime-300 font-medium transition-all duration-300 tracking-wide px-4 py-3 rounded-2xl hover:bg-emerald-800/30 backdrop-blur-sm"
              >
                Habitaciones
              </Link>
              <Link
                to="/sobre-nosotros"
                onClick={() => setMobileMenuOpen(false)}
                className="text-emerald-100 hover:text-lime-300 font-medium transition-all duration-300 tracking-wide px-4 py-3 rounded-2xl hover:bg-emerald-800/30 backdrop-blur-sm"
              >
                Sobre Nosotros
              </Link>
              <Link
                to="/contacto"
                onClick={() => setMobileMenuOpen(false)}
                className="text-emerald-100 hover:text-lime-300 font-medium transition-all duration-300 tracking-wide px-4 py-3 rounded-2xl hover:bg-emerald-800/30 backdrop-blur-sm"
              >
                Contacto
              </Link>
              <div className="border-t border-emerald-800/30 pt-4 space-y-3">
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-emerald-100 hover:text-lime-300 font-medium transition-all duration-300 tracking-wide px-4 py-3 rounded-2xl hover:bg-emerald-800/30 backdrop-blur-sm"
                >
                  Administración
                </Link>
                <Link
                  to="/habitaciones"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-gradient-to-r from-lime-400 to-emerald-400 text-emerald-950 px-6 py-3 rounded-full hover:scale-105 transition-all duration-300 font-bold shadow-lg shadow-black/30 tracking-wide text-center"
                >
                  Reservar Ahora
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
