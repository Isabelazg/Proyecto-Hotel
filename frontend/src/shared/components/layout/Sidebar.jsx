import { Link } from 'react-router-dom'

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Hotel Admin</h1>
      </div>
      <nav className="space-y-2">
        <Link
          to="/dashboard"
          className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          to="/reservations"
          className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Reservaciones
        </Link>
      </nav>
    </aside>
  )
}
