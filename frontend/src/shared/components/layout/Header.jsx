import { LogOut, User, Menu, Bell } from 'lucide-react'

export default function Header({ toggleSidebar, sidebarOpen }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title={sidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        <div>
          <h2 className="text-lg font-serif font-bold text-gray-900">
            Panel de Administración
          </h2>
          <p className="text-xs text-gray-500">Sistema de Gestión Hotelera</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-600"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-amber-900 text-white flex items-center justify-center font-medium text-sm">
            AD
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">Administrador</p>
            <p className="text-xs text-gray-500">admin@hotel.com</p>
          </div>
        </div>

        {/* Logout */}
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-50 rounded-lg transition-colors"
          onClick={() => {
            localStorage.removeItem('token')
            window.location.href = '/login'
          }}
        >
          <LogOut size={16} />
          <span className="hidden md:inline">Salir</span>
        </button>
      </div>
    </header>
  )
}
