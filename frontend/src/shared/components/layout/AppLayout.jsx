import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="flex h-screen bg-stone-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main area */}
      <div className="flex flex-col flex-1 relative">
        {/* Botón flotante cuando sidebar está cerrado */}
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="absolute top-4 left-4 z-50 p-3 bg-gradient-to-r from-emerald-900 to-green-900 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
            title="Mostrar menú"
          >
            <Menu size={22} />
          </button>
        )}

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
