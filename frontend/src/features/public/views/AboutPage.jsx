export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-stone-50 to-emerald-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-950 text-emerald-50 overflow-hidden py-24">
        {/* Organic background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-lime-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-block mb-6 px-6 py-2 bg-emerald-800/40 backdrop-blur-md rounded-full border border-emerald-700/30">
            <span className="text-amber-200 font-medium tracking-wide text-sm">🌿 Nuestra Esencia</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Sobre Nosotros
          </h1>
          <p className="text-xl md:text-2xl text-emerald-100 leading-relaxed font-light tracking-wide max-w-2xl mx-auto">
            Nuestra historia y compromiso con la naturaleza y el lujo sostenible
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-black/10 p-10 md:p-16 border border-white/50">
              <div className="mb-10">
                <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 tracking-tight flex items-center mb-6">
                  <span className="w-1.5 h-12 bg-gradient-to-b from-emerald-400 to-green-500 rounded-full mr-4"></span>
                  Nuestra Historia
                </h2>
              </div>
              
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed font-light">
                <p className="text-xl">
                  Glamping Hotel nació de un sueño: crear un espacio donde las personas
                  pudieran reconectarse con la naturaleza sin sacrificar el confort y el lujo.
                  Fundado en 2020, nos hemos convertido en uno de los destinos de glamping
                  más reconocidos de la región.
                </p>
                <p>
                  Ubicados en un entorno natural privilegiado, nuestras instalaciones están
                  diseñadas para minimizar el impacto ambiental mientras maximizan la experiencia
                  de nuestros huéspedes. Cada unidad ha sido cuidadosamente planificada para
                  ofrecer vistas espectaculares y total privacidad.
                </p>
                <p>
                  Nuestro compromiso con la sostenibilidad y la excelencia en el servicio nos
                  ha valido el reconocimiento de nuestros huéspedes, quienes nos otorgan
                  consistentemente las más altas calificaciones.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-emerald-100">
                <div className="text-center bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-emerald-700 mb-2">2020</div>
                  <p className="text-gray-600 font-medium tracking-wide">Año de Fundación</p>
                </div>
                <div className="text-center bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-amber-700 mb-2">500+</div>
                  <p className="text-gray-600 font-medium tracking-wide">Huéspedes Felices</p>
                </div>
                <div className="text-center bg-gradient-to-r from-lime-50 to-green-50 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-lime-700 mb-2">4.9★</div>
                  <p className="text-gray-600 font-medium tracking-wide">Calificación Promedio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-medium tracking-widest text-sm uppercase mb-3 block">Nuestros Pilares</span>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-4 tracking-tight">
              Nuestros Valores
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group bg-gradient-to-br from-white to-emerald-50 rounded-3xl p-10 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 hover:-translate-y-3 border border-emerald-100/50">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-900/20">
                <span className="text-5xl">🌿</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-emerald-950 tracking-tight text-center">Sostenibilidad</h3>
              <p className="text-gray-700 text-center leading-relaxed font-light">
                Comprometidos con el cuidado del medio ambiente en todas nuestras operaciones,
                reduciendo nuestra huella y preservando la naturaleza
              </p>
            </div>

            <div className="group bg-gradient-to-br from-white to-amber-50 rounded-3xl p-10 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-amber-900/10 transition-all duration-500 hover:-translate-y-3 border border-amber-100/50">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-amber-900/20">
                <span className="text-5xl">⭐</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-emerald-950 tracking-tight text-center">Excelencia</h3>
              <p className="text-gray-700 text-center leading-relaxed font-light">
                Dedicados a superar las expectativas de cada uno de nuestros huéspedes,
                brindando experiencias memorables
              </p>
            </div>

            <div className="group bg-gradient-to-br from-white to-lime-50 rounded-3xl p-10 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-lime-900/10 transition-all duration-500 hover:-translate-y-3 border border-lime-100/50">
              <div className="w-20 h-20 bg-gradient-to-br from-lime-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-lime-900/20">
                <span className="text-5xl">❤️</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-emerald-950 tracking-tight text-center">Hospitalidad</h3>
              <p className="text-gray-700 text-center leading-relaxed font-light">
                Tratamos a cada huésped como parte de nuestra familia,
                con calidez, respeto y atención personalizada
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-emerald-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-medium tracking-widest text-sm uppercase mb-3 block">El Corazón de Glamping</span>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-4 tracking-tight">
              Nuestro Equipo
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light leading-relaxed">
              Profesionales apasionados dedicados a crear experiencias inolvidables
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { name: 'María González', role: 'Gerente General', gradient: 'from-emerald-400 to-green-500' },
              { name: 'Carlos Ramírez', role: 'Chef Ejecutivo', gradient: 'from-amber-400 to-orange-500' },
              { name: 'Ana Martínez', role: 'Coordinadora de Eventos', gradient: 'from-lime-400 to-green-500' },
              { name: 'Diego López', role: 'Director de Sostenibilidad', gradient: 'from-teal-400 to-cyan-500' }
            ].map((member, index) => (
              <div key={index} className="group text-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 hover:-translate-y-3 border border-white/50">
                  <div className={`w-32 h-32 bg-gradient-to-br ${member.gradient} rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/10`}>
                    <span className="text-6xl">👤</span>
                  </div>
                  <h3 className="font-bold text-lg text-emerald-950 mb-2 tracking-wide">{member.name}</h3>
                  <p className="text-gray-600 text-sm font-medium tracking-wide">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-950 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-emerald-900/20">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-64 h-64 bg-lime-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-64 h-64 bg-emerald-400 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="inline-block mb-6 px-6 py-2 bg-emerald-800/40 backdrop-blur-md rounded-full border border-emerald-700/30">
                <span className="text-amber-200 font-medium tracking-wide text-sm">✨ Únete a la Experiencia</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-50 mb-6 tracking-tight">
                ¿Listo para vivir la experiencia Glamping?
              </h2>
              <p className="text-xl text-emerald-100 mb-8 font-light leading-relaxed">
                Reserva ahora y descubre por qué somos el destino favorito de nuestros huéspedes
              </p>
              <a
                href="/habitaciones"
                className="inline-block bg-gradient-to-r from-lime-400 to-emerald-400 text-emerald-950 px-12 py-4 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-xl shadow-black/30 tracking-wide text-lg"
              >
                Ver Alojamientos
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
