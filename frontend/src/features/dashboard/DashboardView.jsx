import { Calendar, DollarSign, Home, TrendingUp, Clock } from 'lucide-react'

export function DashboardView() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Vista general de las operaciones del hotel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Reservas de Hoy */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reservas de Hoy</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
              <p className="text-xs text-gray-500 mt-2">+3 desde ayer</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Ingresos del Día */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos del Día</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">$8,450</p>
              <p className="text-xs text-gray-500 mt-2">+12% vs. promedio</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Unidades Disponibles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unidades Disponibles</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
              <p className="text-xs text-gray-500 mt-2">de 24 habitaciones</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <Home className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Tasa de Ocupación */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasa de Ocupación</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">67%</p>
              <p className="text-xs text-gray-500 mt-2">+5% esta semana</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Reservas Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reservas de Hoy */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900">Reservas de Hoy</h2>
            <p className="text-sm text-gray-600 mt-1">4 check-ins programados</p>
          </div>

          <div className="space-y-4">
            {/* Reserva 1 */}
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-900 text-white flex items-center justify-center font-medium">
                  MG
                </div>
                <div>
                  <p className="font-medium text-gray-900">María González</p>
                  <p className="text-sm text-gray-500">Suite 201</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">14:00</span>
                </div>
                <span className="px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded-full">
                  confirmada
                </span>
              </div>
            </div>

            {/* Reserva 2 */}
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-800 text-white flex items-center justify-center font-medium">
                  CR
                </div>
                <div>
                  <p className="font-medium text-gray-900">Carlos Rodríguez</p>
                  <p className="text-sm text-gray-500">Habitación 105</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">15:30</span>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                  pendiente
                </span>
              </div>
            </div>

            {/* Reserva 3 */}
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-700 text-white flex items-center justify-center font-medium">
                  AM
                </div>
                <div>
                  <p className="font-medium text-gray-900">Ana Martínez</p>
                  <p className="text-sm text-gray-500">Suite 305</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">16:00</span>
                </div>
                <span className="px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded-full">
                  confirmada
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Próximos Check-in */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900">Próximos Check-in</h2>
            <p className="text-sm text-gray-600 mt-1">Reservas confirmadas para los próximos días</p>
          </div>

          <div className="space-y-4">
            {/* Check-in 1 */}
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-900 text-white flex items-center justify-center font-medium">
                  LF
                </div>
                <div>
                  <p className="font-medium text-gray-900">Laura Fernández</p>
                  <p className="text-sm text-gray-500">Suite 102</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Mañana</span>
                </div>
                <span className="text-sm text-gray-600">3 noches</span>
              </div>
            </div>

            {/* Check-in 2 */}
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-800 text-white flex items-center justify-center font-medium">
                  RS
                </div>
                <div>
                  <p className="font-medium text-gray-900">Roberto Silva</p>
                  <p className="text-sm text-gray-500">Habitación 304</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">15 Ene</span>
                </div>
                <span className="text-sm text-gray-600">2 noches</span>
              </div>
            </div>

            {/* Check-in 3 */}
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-700 text-white flex items-center justify-center font-medium">
                  PT
                </div>
                <div>
                  <p className="font-medium text-gray-900">Patricia Torres</p>
                  <p className="text-sm text-gray-500">Suite 201</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">18 Ene</span>
                </div>
                <span className="text-sm text-gray-600">5 noches</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
