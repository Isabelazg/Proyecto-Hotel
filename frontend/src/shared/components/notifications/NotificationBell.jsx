import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, Calendar, Info } from 'lucide-react';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '@/api/notifications.api';

const NOTIFICATION_ICONS = {
  reserva_creada: Calendar,
  reserva_iniciada: CheckCircle,
  reserva_terminada: CheckCircle,
  pago_recibido: CheckCircle,
  general: Info,
};

const NOTIFICATION_COLORS = {
  reserva_creada: 'bg-blue-50 border-blue-200 text-blue-900',
  reserva_iniciada: 'bg-green-50 border-green-200 text-green-900',
  reserva_terminada: 'bg-gray-50 border-gray-200 text-gray-900',
  pago_recibido: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  general: 'bg-amber-50 border-amber-200 text-amber-900',
};

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await getNotifications({ limit: 20, includeRead: false });
      setNotifications(data.data || data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data.data?.count || data.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, leida: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      fetchUnreadCount();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 relative"
      >
        <Bell size={22} className="text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-lime-400 shadow-lg shadow-lime-400/50"></span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Notification Panel */}
          <div className="absolute right-0 mt-3 w-96 max-h-[600px] bg-white rounded-3xl shadow-2xl border-2 border-emerald-200 z-50 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 bg-gradient-to-r from-emerald-900 via-green-900 to-emerald-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-white" />
                <h3 className="text-lg font-semibold text-white tracking-wide">
                  Notificaciones
                </h3>
                {unreadCount > 0 && (
                  <span className="bg-lime-400 text-emerald-900 text-xs font-bold px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-all duration-300"
              >
                <X size={18} className="text-white" />
              </button>
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="flex-shrink-0 px-6 py-3 bg-emerald-50 border-b border-emerald-100">
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-emerald-700 hover:text-emerald-900 font-medium transition-colors"
                >
                  Marcar todas como leídas
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <Bell size={48} className="text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium mb-1">
                    No hay notificaciones
                  </p>
                  <p className="text-sm text-gray-400">
                    Cuando tengas nuevas notificaciones aparecerán aquí
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => {
                    const Icon =
                      NOTIFICATION_ICONS[notification.tipo] || Info;
                    const colorClass =
                      NOTIFICATION_COLORS[notification.tipo] ||
                      NOTIFICATION_COLORS.general;

                    return (
                      <div
                        key={notification.id}
                        className={`px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notification.leida ? 'bg-blue-50/30' : ''
                        }`}
                        onClick={() => {
                          if (!notification.leida) {
                            handleMarkAsRead(notification.id);
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-full ${colorClass} flex items-center justify-center border-2`}
                          >
                            <Icon size={18} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                                {notification.titulo}
                              </h4>
                              {!notification.leida && (
                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                              {notification.mensaje}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400 font-medium">
                                {formatDate(notification.fecha_creacion)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(notification.id);
                                }}
                                className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
