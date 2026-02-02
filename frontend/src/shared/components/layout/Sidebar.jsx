import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Calendar,
  Home,
  Users,
  CreditCard,
  BarChart,
  LogOut,
  Bell,
  Menu
} from 'lucide-react'

const menu = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Reservas', path: '/admin/reservations', icon: Calendar },
  { name: 'Unidades', path: '/admin/units', icon: Home },
  { name: 'Clientes', path: '/admin/clients', icon: Users },
  { name: 'Pagos', path: '/admin/payments', icon: CreditCard },
  { name: 'Reportes', path: '/admin/reports', icon: BarChart }
]

export default function Sidebar({ isOpen, toggleSidebar }) {
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
    navigate('/admin/login')
  }

  const getUserInitials = () => {
    if (!user) return 'U'
    const nombre = user.nombre || ''
    const apellido = user.apellido || ''
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase() || 'U'
  }

  return (
    <aside
      className={`bg-gradient-to-b from-emerald-900 via-green-900 to-emerald-950 border-r-2 border-emerald-800 h-full transition-all duration-300 shadow-xl shadow-black/20 flex flex-col ${
        isOpen ? 'w-64' : 'w-0 overflow-hidden'
      }`}
    >
      {/* Header con Logo y Menu */}
      <div className="flex-shrink-0 h-16 flex items-center justify-between px-4 border-b-2 border-emerald-800">
        <div className="flex items-center pl-1 mt-1">
          <h1 className="text-xl font-semibold tracking-wide text-white whitespace-nowrap">
            Hotel Elegance
          </h1>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 flex-shrink-0"
        >
          <Menu size={20} className="text-white" />
        </button>
      </div>

      {/* Menu */}
      <nav className="px-3 py-4 space-y-2">
        {menu.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-300 leading-tight
              ${isActive
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-900/50 scale-105'
                : 'text-emerald-100 hover:bg-white/10 hover:text-white hover:scale-105'}`
            }
          >
            <Icon size={20} />
            {name}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="flex-shrink-0 mt-auto border-t-2 border-emerald-800 p-4 space-y-3">
        {/* Notifications */}
        <button className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 relative">
          <Bell size={18} className="text-white" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-lime-400 shadow-lg shadow-lime-400/50"></span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-green-600 text-white flex items-center justify-center font-medium text-sm shadow-lg flex-shrink-0">
            {getUserInitials()}
          </div>
          <div className="flex flex-col justify-center mt-1 flex-1 min-w-0">
            <p className="text-sm font-medium text-white leading-tight mb-0.5 truncate">
              {user ? `${user.nombre || ''} ${user.apellido || ''}`.trim() : 'Usuario'}
            </p>
            <p className="text-xs text-emerald-100/70 font-light leading-tight truncate">
              {user?.correo || 'usuario@hotel.com'}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium bg-white/10 text-white hover:bg-white/20 hover:scale-105 rounded-2xl transition-all duration-300 shadow-lg"
        >
          <LogOut size={18} />
          <span>Salir</span>
        </button>
      </div>
    </aside>
  )
}
