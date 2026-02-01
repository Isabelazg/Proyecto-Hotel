import { Link } from 'react-router-dom'
import SearchAvailability from '../components/SearchAvailability'

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-stone-50 to-emerald-50">
      {/* Hero Section */}
      <section className="relative min-h-[700px] bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-950 text-emerald-50 overflow-hidden">
        {/* Organic background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 h-full min-h-[700px] flex items-center relative z-10">
          <div className="max-w-3xl py-20">
            <div className="inline-block mb-6 px-6 py-2 bg-emerald-800/40 backdrop-blur-md rounded-full border border-emerald-700/30">
              <span className="text-amber-200 font-medium tracking-wide text-sm">🌿 Experiencia Eco-Premium</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
              Vive la Naturaleza
              <span className="block text-lime-200 mt-2">con Lujo Sostenible</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-emerald-100 leading-relaxed font-light tracking-wide">
              Conecta con la naturaleza sin renunciar al confort. 
              Descubre nuestras exclusivas cabañas y domos en un entorno único.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link
                to="/habitaciones"
                className="bg-gradient-to-r from-lime-400 to-emerald-400 text-emerald-950 px-10 py-4 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-xl shadow-black/20 tracking-wide"
              >
                Explorar Alojamientos
              </Link>
              <Link
                to="/contacto"
                className="bg-emerald-800/40 backdrop-blur-md border-2 border-emerald-600/50 text-emerald-50 px-10 py-4 rounded-full font-semibold hover:bg-emerald-700/50 hover:scale-105 transition-all duration-300 tracking-wide"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Availability Section */}
      <section className="py-12 relative">
        <div className="container mx-auto px-6">
          <SearchAvailability className="-mt-32 relative z-20" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-transparent">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-medium tracking-widest text-sm uppercase mb-3 block">Nuestra Propuesta</span>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-4 tracking-tight">
              ¿Por qué Elegirnos?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group bg-gradient-to-br from-white to-emerald-50 rounded-3xl p-10 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 hover:-translate-y-2 border border-emerald-100/50">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-900/20">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-emerald-950 tracking-tight">Naturaleza Pura</h3>
              <p className="text-gray-700 leading-relaxed font-light">
                Ubicados en el corazón de paisajes naturales espectaculares, donde la tranquilidad se encuentra con la belleza salvaje
              </p>
            </div>

            <div className="group bg-gradient-to-br from-white to-amber-50 rounded-3xl p-10 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-amber-900/10 transition-all duration-500 hover:-translate-y-2 border border-amber-100/50">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-amber-900/20">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-emerald-950 tracking-tight">Confort Premium</h3>
              <p className="text-gray-700 leading-relaxed font-light">
                Instalaciones de lujo con todas las comodidades modernas, diseñadas para tu máximo bienestar
              </p>
            </div>

            <div className="group bg-gradient-to-br from-white to-lime-50 rounded-3xl p-10 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-lime-900/10 transition-all duration-500 hover:-translate-y-2 border border-lime-100/50">
              <div className="w-20 h-20 bg-gradient-to-br from-lime-400 to-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-lime-900/20">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-emerald-950 tracking-tight">Experiencia Única</h3>
              <p className="text-gray-700 leading-relaxed font-light">
                Servicios personalizados y actividades exclusivas que harán de tu estadía un recuerdo inolvidable
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Units Section */}
      <section className="py-24 bg-gradient-to-b from-transparent to-emerald-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-medium tracking-widest text-sm uppercase mb-3 block">Alojamientos</span>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-4 tracking-tight">
              Nuestros Espacios
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light leading-relaxed">
              Elige entre nuestras exclusivas opciones de alojamiento, 
              cada una diseñada para brindarte una experiencia inolvidable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 max-w-7xl mx-auto">
            {/* Sample Unit Card 1 */}
            <div className="group bg-white rounded-3xl overflow-hidden shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 hover:-translate-y-3 border border-gray-100">
              <div className="h-64 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-emerald-700 font-bold text-sm tracking-wide">Popular</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🏕️</span>
                  <span className="text-xs font-medium text-emerald-600 tracking-widest uppercase">Glamping</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-emerald-950 tracking-tight">Domo Deluxe</h3>
                <p className="text-gray-600 mb-6 leading-relaxed font-light">
                  Vista panorámica de 360° con techo transparente para observar las estrellas
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-3xl font-bold text-emerald-700">$150</span>
                    <span className="text-sm text-gray-500 ml-1">/noche</span>
                  </div>
                  <Link
                    to="/habitaciones"
                    className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-2 group-hover:gap-3 transition-all"
                  >
                    Ver más
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sample Unit Card 2 */}
            <div className="group bg-white rounded-3xl overflow-hidden shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 hover:-translate-y-3 border border-gray-100">
              <div className="h-64 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-amber-700 font-bold text-sm tracking-wide">Premium</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🏡</span>
                  <span className="text-xs font-medium text-teal-600 tracking-widest uppercase">Cabaña</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-emerald-950 tracking-tight">Cabaña Premium</h3>
                <p className="text-gray-600 mb-6 leading-relaxed font-light">
                  Espaciosa cabaña con terraza privada y jacuzzi al aire libre
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-3xl font-bold text-emerald-700">$200</span>
                    <span className="text-sm text-gray-500 ml-1">/noche</span>
                  </div>
                  <Link
                    to="/habitaciones"
                    className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-2 group-hover:gap-3 transition-all"
                  >
                    Ver más
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sample Unit Card 3 */}
            <div className="group bg-white rounded-3xl overflow-hidden shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 hover:-translate-y-3 border border-gray-100">
              <div className="h-64 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-blue-700 font-bold text-sm tracking-wide">Familia</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🌲</span>
                  <span className="text-xs font-medium text-blue-600 tracking-widest uppercase">Suite</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-emerald-950 tracking-tight">Suite Natura</h3>
                <p className="text-gray-600 mb-6 leading-relaxed font-light">
                  Perfecta para familias con área de estar amplia y vista al bosque
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-3xl font-bold text-emerald-700">$250</span>
                    <span className="text-sm text-gray-500 ml-1">/noche</span>
                  </div>
                  <Link
                    to="/habitaciones"
                    className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-2 group-hover:gap-3 transition-all"
                  >
                    Ver más
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/habitaciones"
              className="inline-block bg-gradient-to-r from-emerald-600 to-green-600 text-white px-12 py-4 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-xl shadow-emerald-900/20 tracking-wide"
            >
              Ver Todos los Alojamientos
            </Link>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-50 to-lime-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-medium tracking-widest text-sm uppercase mb-3 block">Servicios</span>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-4 tracking-tight">
              Servicios e Instalaciones
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { emoji: '🏊', text: 'Piscina Natural' },
              { emoji: '🍽️', text: 'Restaurante' },
              { emoji: '📶', text: 'Wi-Fi Gratis' },
              { emoji: '🚗', text: 'Parking' },
              { emoji: '💆', text: 'Spa & Wellness' },
              { emoji: '🏃', text: 'Gimnasio' },
              { emoji: '🌳', text: 'Tours Ecológicos' },
              { emoji: '🔥', text: 'Fogatas' }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/5 border border-white/50"
              >
                <div className="text-5xl mb-4">{item.emoji}</div>
                <p className="font-semibold text-emerald-950 tracking-wide">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-950 text-emerald-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-96 h-96 bg-lime-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-block mb-6 px-6 py-2 bg-emerald-800/40 backdrop-blur-md rounded-full border border-emerald-700/30">
            <span className="text-amber-200 font-medium tracking-wide text-sm">✨ Oferta Especial</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
            ¿Listo para tu próxima aventura?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-emerald-100 font-light tracking-wide max-w-2xl mx-auto">
            Reserva ahora y obtén un 10% de descuento en tu primera estadía
          </p>
          <Link
            to="/reservar"
            className="inline-block bg-gradient-to-r from-lime-400 to-emerald-400 text-emerald-950 px-12 py-5 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-2xl shadow-black/30 tracking-wide text-lg"
          >
            Reservar Ahora
          </Link>
        </div>
      </section>
    </div>
  )
}
