import { useState, useEffect } from 'react'
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification } from '@/api/notifications.api'

export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const data = await getNotifications({ limit: 20, includeRead: false })
      // El backend puede devolver {data: [...]} o directamente [...]
      const notificationsArray = Array.isArray(data) ? data : (data.data || [])
      setNotifications(notificationsArray)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching notifications:', err)
      setNotifications([]) // Asegurar que siempre sea un array
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const data = await getUnreadCount()
      setUnreadCount(data.count || 0)
    } catch (err) {
      console.error('Error fetching unread count:', err)
      setUnreadCount(0)
    }
  }

  const markNotificationAsRead = async (id) => {
    try {
      await markAsRead(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const markAllNotificationsAsRead = async () => {
    try {
      await markAllAsRead()
      setNotifications([])
      setUnreadCount(0)
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }

  const deleteNotificationById = async (id) => {
    try {
      await deleteNotification(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
  }, [])

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotificationById,
  }
}
