import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  countUnreadNotifications,
  deleteNotification,
} from '../../services/notificacion.service.js';
import { successResponse, errorResponse } from '../../utils/response.util.js';

/**
 * Obtiene las notificaciones del usuario autenticado
 */
export const getNotifications = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const { limit = 20, includeRead = false } = req.query;

    const notificaciones = await getUserNotifications(usuario_id, {
      limit,
      includeRead: includeRead === 'true',
    });

    return successResponse(res, notificaciones, 200);
  } catch (error) {
    return errorResponse(res, 'Error al obtener las notificaciones', 500, [
      {
        code: 'GET_NOTIFICATIONS_ERROR',
        detail: error.message,
      },
    ]);
  }
};

/**
 * Obtiene el conteo de notificaciones no leídas
 */
export const getUnreadCount = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const count = await countUnreadNotifications(usuario_id);

    return successResponse(res, { count }, 200);
  } catch (error) {
    return errorResponse(res, 'Error al contar notificaciones no leídas', 500, [
      {
        code: 'COUNT_UNREAD_ERROR',
        detail: error.message,
      },
    ]);
  }
};

/**
 * Marca una notificación como leída
 */
export const markNotificationAsRead = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const { id } = req.params;

    const notificacion = await markAsRead(parseInt(id), usuario_id);

    return successResponse(res, notificacion, 200, null, null, 'Notificación marcada como leída');
  } catch (error) {
    return errorResponse(res, 'Error al marcar notificación como leída', 500, [
      {
        code: 'MARK_AS_READ_ERROR',
        detail: error.message,
      },
    ]);
  }
};

/**
 * Marca todas las notificaciones como leídas
 */
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;

    await markAllAsRead(usuario_id);

    return successResponse(res, { success: true }, 200, null, null, 'Todas las notificaciones marcadas como leídas');
  } catch (error) {
    return errorResponse(res, 'Error al marcar todas las notificaciones como leídas', 500, [
      {
        code: 'MARK_ALL_AS_READ_ERROR',
        detail: error.message,
      },
    ]);
  }
};

/**
 * Elimina una notificación
 */
export const deleteNotificationController = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const { id } = req.params;

    await deleteNotification(parseInt(id), usuario_id);

    return successResponse(res, { success: true }, 200, null, null, 'Notificación eliminada correctamente');
  } catch (error) {
    return errorResponse(res, 'Error al eliminar notificación', 500, [
      {
        code: 'DELETE_NOTIFICATION_ERROR',
        detail: error.message,
      },
    ]);
  }
};
