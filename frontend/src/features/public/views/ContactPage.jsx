import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí puedes agregar la lógica para enviar el formulario
    console.log('Form data:', formData)
    alert('¡Gracias por contactarnos! Te responderemos pronto.')
  }

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
            <span className="text-amber-200 font-medium tracking-wide text-sm">💬 Estamos aquí para ti</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Contáctanos
          </h1>
          <p className="text-xl md:text-2xl text-emerald-100 leading-relaxed font-light tracking-wide max-w-2xl mx-auto">
            Estamos aquí para ayudarte con cualquier consulta sobre tu próxima aventura
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-900/30 p-10 border border-emerald-100/50">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-emerald-950 tracking-tight flex items-center mb-3">
                <span className="w-1.5 h-10 bg-gradient-to-b from-emerald-400 to-green-500 rounded-full mr-4"></span>
                Envíanos un Mensaje
              </h2>
              <p className="text-gray-600 font-light tracking-wide">
                Completa el formulario y te responderemos lo antes posible
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-3 tracking-wide">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full border-2 border-emerald-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white shadow-sm transition-all duration-300 text-gray-700 font-medium placeholder:text-gray-400"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-3 tracking-wide">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-2 border-emerald-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white shadow-sm transition-all duration-300 text-gray-700 font-medium placeholder:text-gray-400"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-3 tracking-wide">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full border-2 border-emerald-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white shadow-sm transition-all duration-300 text-gray-700 font-medium placeholder:text-gray-400"
                  placeholder="+57 123 456 7890"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-3 tracking-wide">
                  Asunto *
                </label>
                <select
                  name="asunto"
                  required
                  value={formData.asunto}
                  onChange={handleChange}
                  className="w-full border-2 border-emerald-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white shadow-sm transition-all duration-300 text-gray-700 font-medium"
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="reserva">Consulta sobre Reservas</option>
                  <option value="informacion">Información General</option>
                  <option value="evento">Eventos y Grupos</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-3 tracking-wide">
                  Mensaje *
                </label>
                <textarea
                  name="mensaje"
                  required
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows={6}
                  className="w-full border-2 border-emerald-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white shadow-sm transition-all duration-300 text-gray-700 font-medium placeholder:text-gray-400 resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-4 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-xl shadow-emerald-900/20 tracking-wide text-lg"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Info Cards */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-900/30 p-8 border border-emerald-100/50">
              <h3 className="text-2xl font-bold text-emerald-950 mb-6 tracking-tight flex items-center">
                <span className="w-1.5 h-8 bg-gradient-to-b from-lime-400 to-emerald-500 rounded-full mr-3"></span>
                Información de Contacto
              </h3>
              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0 shadow-lg shadow-emerald-900/20 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 mb-1 tracking-wide">Dirección</h4>
                    <p className="text-gray-600 leading-relaxed font-light">
                      Dirección del Hotel<br />
                      Ciudad, País
                    </p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0 shadow-lg shadow-amber-900/20 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 mb-1 tracking-wide">Teléfono</h4>
                    <p className="text-gray-600 font-light">+57 123 456 7890</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-14 h-14 bg-gradient-to-br from-lime-400 to-green-500 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0 shadow-lg shadow-lime-900/20 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 mb-1 tracking-wide">Email</h4>
                    <p className="text-gray-600 font-light">info@glampinghotel.com</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0 shadow-lg shadow-teal-900/20 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 mb-1 tracking-wide">Horarios</h4>
                    <p className="text-gray-600 font-light">
                      Check-in: 15:00<br />
                      Check-out: 12:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-900/30 p-8 border border-emerald-100/50">
              <h3 className="text-2xl font-bold text-emerald-950 mb-6 tracking-tight flex items-center">
                <span className="w-1.5 h-8 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full mr-3"></span>
                Ubicación
              </h3>
              <div className="h-64 bg-gradient-to-br from-emerald-100 to-lime-100 rounded-2xl flex items-center justify-center border-2 border-emerald-200/50">
                <div className="text-center">
                  <span className="text-5xl mb-3 block">📍</span>
                  <p className="text-emerald-700 font-semibold tracking-wide">Mapa de ubicación</p>
                  <p className="text-emerald-600 text-sm font-light mt-1">Integración próximamente</p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-900/30 p-8 border border-emerald-100/50">
              <h3 className="text-2xl font-bold text-emerald-950 mb-6 tracking-tight flex items-center">
                <span className="w-1.5 h-8 bg-gradient-to-b from-teal-400 to-cyan-500 rounded-full mr-3"></span>
                Preguntas Frecuentes
              </h3>
              <div className="space-y-5">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-5 border border-emerald-100/50 hover:scale-105 transition-transform duration-300">
                  <h4 className="font-bold text-emerald-900 mb-2 tracking-wide flex items-center">
                    <span className="text-emerald-600 mr-2">❓</span>
                    ¿Cuál es la política de cancelación?
                  </h4>
                  <p className="text-gray-700 font-light leading-relaxed">
                    Puedes cancelar hasta 48 horas antes sin ningún costo adicional.
                  </p>
                </div>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100/50 hover:scale-105 transition-transform duration-300">
                  <h4 className="font-bold text-emerald-900 mb-2 tracking-wide flex items-center">
                    <span className="text-amber-600 mr-2">🐕</span>
                    ¿Aceptan mascotas?
                  </h4>
                  <p className="text-gray-700 font-light leading-relaxed">
                    Sí, aceptamos mascotas con un cargo adicional de $20 por noche.
                  </p>
                </div>
                <div className="bg-gradient-to-r from-lime-50 to-green-50 rounded-2xl p-5 border border-lime-100/50 hover:scale-105 transition-transform duration-300">
                  <h4 className="font-bold text-emerald-900 mb-2 tracking-wide flex items-center">
                    <span className="text-lime-600 mr-2">🚗</span>
                    ¿Hay transporte desde el aeropuerto?
                  </h4>
                  <p className="text-gray-700 font-light leading-relaxed">
                    Sí, ofrecemos servicio de transporte con reserva previa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Add spacing at bottom */}
      <div className="pb-16"></div>
    </div>
  )
}
