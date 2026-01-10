import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  Home,
  Users,
  CreditCard,
  BarChart
} from 'lucide-react'

const menu = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Reservas', path: '/reservations', icon: Calendar },
  { name: 'Unidades', path: '/units', icon: Home },
  { name: 'Clientes', path: '/clients', icon: Users },
  { name: 'Pagos', path: '/payments', icon: CreditCard },
  { name: 'Reportes', path: '/reports', icon: BarChart }
]

export default function Sidebar({ isOpen }) {
  return (
    <aside
      className={`bg-white border-r border-gray-200 h-full transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-0 overflow-hidden'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-serif font-bold text-gray-900 whitespace-nowrap">
          Hotel Elegance
        </h1>
      </div>

      {/* Menu */}
      <nav className="px-3 py-4 space-y-1">
        {menu.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
              ${isActive
                ? 'bg-amber-50 text-amber-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
            }
          >
            <Icon size={18} />
            {name}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
