import { LogOut, User, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { NotificationBell } from '@/shared/components/common/NotificationBell'

export default function Header({ toggleSidebar, sidebarOpen }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const getUserInitials = () => {
    if (!user) return 'U'
    const nombre = user.nombre || ''
    const apellido = user.apellido || ''
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase() || 'U'
  }

  return (
    <header className="h-16 bg-gradient-to-r from-emerald-900 via-green-900 to-emerald-800 border-b-2 border-emerald-700 flex items-center justify-between px-6 shadow-lg shadow-black/20">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2.5 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110"
          title={sidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}
        >
          <Menu size={22} className="text-white" />
        </button>
        <div className="flex flex-col justify-center mt-1">
          <h2 className="text-lg font-semibold tracking-wide text-white leading-tight mb-0.5">
            Panel de Administración
          </h2>
          <p className="text-sm text-emerald-100/70 font-light leading-tight">Sistema de Gestión Hotelera</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <NotificationBell />

        {/* User Menu */}
        <div className="flex items-center gap-3 pl-4 border-l-2 border-emerald-700">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-green-600 text-white flex items-center justify-center font-medium text-sm shadow-lg">
            {getUserInitials()}
          </div>
          <div className="hidden md:flex flex-col justify-center mt-1">
            <p className="text-sm font-medium text-white leading-tight mb-0.5">
              {user ? `${user.nombre || ''} ${user.apellido || ''}`.trim() : 'Usuario'}
            </p>
            <p className="text-xs text-emerald-100/70 font-light leading-tight">
              {user?.correo || 'usuario@hotel.com'}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-white/10 text-white hover:bg-white/20 hover:scale-105 rounded-full transition-all duration-300 shadow-lg"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span className="hidden md:inline">Salir</span>
        </button>
      </div>
    </header>
  )
}
