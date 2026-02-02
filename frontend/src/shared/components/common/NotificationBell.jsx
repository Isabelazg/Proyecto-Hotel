import { useState, useEffect, useRef } from 'react'
import { Bell, X, Check, Trash2 } from 'lucide-react'
import { useNotifications } from '@/shared/hooks/useNotifications'

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotificationById,
  } = useNotifications()

  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      fetchNotifications()
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleMarkAsRead = (id, e) => {
    e.stopPropagation()
    markNotificationAsRead(id)
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    deleteNotificationById(id)
  }

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead()
  }

  const getNotificationIcon = (tipo) => {
    switch (tipo) {
      case 'reserva_creada':
        return '📅'
      case 'reserva_iniciada':
        return '🏁'
      case 'reserva_terminada':
        return '✅'
      case 'pago_recibido':
        return '💰'
      default:
        return '🔔'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Hace un momento'
    if (minutes < 60) return `Hace ${minutes} min`
    if (hours < 24) return `Hace ${hours} h`
    if (days < 7) return `Hace ${days} días`
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 relative"
      >
        <Bell size={22} className="text-white" />
        {unreadCount > 0 && (
          <>
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-lime-400 shadow-lg shadow-lime-400/50"></span>
            <span className="absolute -top-1 -right-1 bg-gradient-to-br from-lime-400 to-green-500 text-emerald-950 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-full ml-2 -top-80 w-96 h-[70vh] max-h-[560px] bg-white rounded-2xl shadow-2xl border-2 border-emerald-200 overflow-hidden z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-green-900 to-emerald-800 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={20} className="text-white" />
              <h3 className="text-lg font-semibold text-white tracking-wide">Notificaciones</h3>
              {unreadCount > 0 && (
                <span className="bg-lime-400 text-emerald-950 text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-all"
            >
              <X size={18} className="text-white" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="mt-2 text-sm">Cargando...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-700">No hay notificaciones</p>
                <p className="text-sm mt-1">Te avisaremos cuando haya novedades</p>
              </div>
            ) : (
              <div className="divide-y divide-emerald-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-emerald-50/50 transition-colors group"
                  >
                    <div className="flex gap-3">
                      <div className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification.tipo)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-emerald-950 leading-tight">
                            {notification.titulo}
                          </h4>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => handleMarkAsRead(notification.id, e)}
                              className="p-1 hover:bg-emerald-100 rounded-lg transition-all"
                              title="Marcar como leída"
                            >
                              <Check size={14} className="text-emerald-600" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(notification.id, e)}
                              className="p-1 hover:bg-red-100 rounded-lg transition-all"
                              title="Eliminar"
                            >
                              <Trash2 size={14} className="text-red-600" />
                            </button>
                          </div>
                        </div>
                        {notification.mensaje && (
                          <p className="text-sm text-gray-600 mt-1 leading-snug">
                            {notification.mensaje}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(notification.fecha_creacion)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-t-2 border-emerald-200 px-5 py-3 flex justify-center">
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm font-medium text-emerald-700 hover:text-emerald-900 transition-colors flex items-center gap-2"
              >
                <Check size={16} />
                Marcar todas como leídas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
