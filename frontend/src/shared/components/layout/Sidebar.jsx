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
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Reservas', path: '/admin/reservations', icon: Calendar },
  { name: 'Unidades', path: '/admin/units', icon: Home },
  { name: 'Clientes', path: '/admin/clients', icon: Users },
  { name: 'Pagos', path: '/admin/payments', icon: CreditCard },
  { name: 'Reportes', path: '/admin/reports', icon: BarChart }
]

export default function Sidebar({ isOpen }) {
  return (
    <aside
      className={`bg-gradient-to-b from-emerald-900 via-green-900 to-emerald-950 border-r-2 border-emerald-800 h-full transition-all duration-300 shadow-xl shadow-black/20 ${
        isOpen ? 'w-64' : 'w-0 overflow-hidden'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b-2 border-emerald-800">
        <h1 className="text-xl font-light tracking-wide text-white whitespace-nowrap">
          Hotel Elegance
        </h1>
      </div>

      {/* Menu */}
      <nav className="px-3 py-4 space-y-2">
        {menu.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-300
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
    </aside>
  )
}
