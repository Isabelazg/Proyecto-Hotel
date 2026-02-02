import express from 'express';
import * as NotificacionController from '../controllers/notificacion/notificacion.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación

// Obtener notificaciones del usuario autenticado
router.get(
  '/',
  verificarToken,
  NotificacionController.getNotifications
);

// Obtener conteo de notificaciones no leídas
router.get(
  '/unread-count',
  verificarToken,
  NotificacionController.getUnreadCount
);

// Marcar una notificación como leída
router.patch(
  '/:id/read',
  verificarToken,
  NotificacionController.markNotificationAsRead
);

// Marcar todas las notificaciones como leídas
router.patch(
  '/mark-all-read',
  verificarToken,
  NotificacionController.markAllNotificationsAsRead
);

// Eliminar una notificación
router.delete(
  '/:id',
  verificarToken,
  NotificacionController.deleteNotificationController
);

export default router;
