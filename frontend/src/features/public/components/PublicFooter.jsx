import { Link } from 'react-router-dom'

export default function PublicFooter() {
  return (
    <footer className="relative bg-gradient-to-br from-emerald-950 via-green-950 to-emerald-900 text-emerald-50 overflow-hidden">
      {/* Organic background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-lime-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mt-12">
          {/* Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <h3 className="text-emerald-50 text-2xl font-bold tracking-wide">Glamping Hotel</h3>
            </div>
            <p className="text-emerald-100 leading-relaxed font-light tracking-wide">
              Experimenta la naturaleza con el confort de un hotel de lujo. Donde la sostenibilidad se encuentra con la elegancia.
            </p>
            <div className="flex space-x-4 pt-6">
              <a 
                href="#" 
                className="w-12 h-12 bg-gradient-to-br from-emerald-800 to-green-800 backdrop-blur-md rounded-full flex items-center justify-center hover:from-lime-400 hover:to-emerald-400 hover:text-emerald-950 transition-all duration-300 transform hover:scale-110 shadow-lg shadow-black/20 border border-emerald-700/30"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-gradient-to-br from-emerald-800 to-green-800 backdrop-blur-md rounded-full flex items-center justify-center hover:from-lime-400 hover:to-emerald-400 hover:text-emerald-950 transition-all duration-300 transform hover:scale-110 shadow-lg shadow-black/20 border border-emerald-700/30"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-gradient-to-br from-emerald-800 to-green-800 backdrop-blur-md rounded-full flex items-center justify-center hover:from-lime-400 hover:to-emerald-400 hover:text-emerald-950 transition-all duration-300 transform hover:scale-110 shadow-lg shadow-black/20 border border-emerald-700/30"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-emerald-50 font-bold text-lg mb-8 relative inline-block tracking-wide">
              Enlaces Rápidos
              <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-emerald-100 hover:text-lime-300 transition-all duration-300 flex items-center group font-light tracking-wide">
                  <span className="mr-3 text-lime-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">→</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Inicio</span>
                </Link>
              </li>
              <li>
                <Link to="/habitaciones" className="text-emerald-100 hover:text-lime-300 transition-all duration-300 flex items-center group font-light tracking-wide">
                  <span className="mr-3 text-lime-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">→</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Habitaciones</span>
                </Link>
              </li>
              <li>
                <Link to="/sobre-nosotros" className="text-emerald-100 hover:text-lime-300 transition-all duration-300 flex items-center group font-light tracking-wide">
                  <span className="mr-3 text-lime-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">→</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Sobre Nosotros</span>
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-emerald-100 hover:text-lime-300 transition-all duration-300 flex items-center group font-light tracking-wide">
                  <span className="mr-3 text-lime-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">→</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Contacto</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-emerald-50 font-bold text-lg mb-8 relative inline-block tracking-wide">
              Servicios
              <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-emerald-100">
              <li className="flex items-center group hover:text-lime-300 transition-colors duration-300 font-light tracking-wide">
                <span className="w-2 h-2 bg-gradient-to-br from-lime-400 to-emerald-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300 shadow-sm shadow-lime-400/50"></span>
                <span>Wi-Fi Gratuito</span>
              </li>
              <li className="flex items-center group hover:text-lime-300 transition-colors duration-300 font-light tracking-wide">
                <span className="w-2 h-2 bg-gradient-to-br from-lime-400 to-emerald-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300 shadow-sm shadow-lime-400/50"></span>
                <span>Restaurante</span>
              </li>
              <li className="flex items-center group hover:text-lime-300 transition-colors duration-300 font-light tracking-wide">
                <span className="w-2 h-2 bg-gradient-to-br from-lime-400 to-emerald-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300 shadow-sm shadow-lime-400/50"></span>
                <span>Piscina</span>
              </li>
              <li className="flex items-center group hover:text-lime-300 transition-colors duration-300 font-light tracking-wide">
                <span className="w-2 h-2 bg-gradient-to-br from-lime-400 to-emerald-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300 shadow-sm shadow-lime-400/50"></span>
                <span>Spa & Bienestar</span>
              </li>
              <li className="flex items-center group hover:text-lime-300 transition-colors duration-300 font-light tracking-wide">
                <span className="w-2 h-2 bg-gradient-to-br from-lime-400 to-emerald-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300 shadow-sm shadow-lime-400/50"></span>
                <span>Tours Ecológicos</span>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-emerald-50 font-bold text-lg mb-8 relative inline-block tracking-wide">
              Contacto
              <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full"></span>
            </h4>
            <ul className="space-y-5 text-emerald-100">
              <li className="flex items-start group hover:text-lime-300 transition-colors duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-800 to-green-800 rounded-full flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md shadow-black/20 border border-emerald-700/30">
                  <svg className="w-5 h-5 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="font-light tracking-wide leading-relaxed pt-2">Dirección del Hotel, Ciudad, País</span>
              </li>
              <li className="flex items-center group hover:text-lime-300 transition-colors duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-800 to-green-800 rounded-full flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md shadow-black/20 border border-emerald-700/30">
                  <svg className="w-5 h-5 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="font-light tracking-wide">+57 123 456 7890</span>
              </li>
              <li className="flex items-center group hover:text-lime-300 transition-colors duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-800 to-green-800 rounded-full flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md shadow-black/20 border border-emerald-700/30">
                  <svg className="w-5 h-5 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-light tracking-wide">info@glampinghotel.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-emerald-800/50 text-center">
          <p className="text-emerald-200 font-light tracking-wide">&copy; 2026 Glamping Hotel. Todos los derechos reservados. Hecho con 💚 por la naturaleza.</p>
        </div>
      </div>
    </footer>
  )
}
