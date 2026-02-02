import { Notificacion, Usuario } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Crear una notificación para un usuario
 */
export const createNotification = async ({ usuario_id, tipo, titulo, mensaje, relacionado_id = null, relacionado_tipo = null }) => {
  try {
    const notificacion = await Notificacion.create({
      usuario_id,
      tipo,
      titulo,
      mensaje,
      relacionado_id,
      relacionado_tipo,
      leida: false,
    });

    return notificacion;
  } catch (error) {
    throw new Error(`Error al crear notificación: ${error.message}`);
  }
};

/**
 * Crear notificaciones para múltiples usuarios
 */
export const createNotificationsForUsers = async (usuarios_ids, { tipo, titulo, mensaje, relacionado_id = null, relacionado_tipo = null }) => {
  try {
    const notificaciones = usuarios_ids.map(usuario_id => ({
      usuario_id,
      tipo,
      titulo,
      mensaje,
      relacionado_id,
      relacionado_tipo,
      leida: false,
    }));

    await Notificacion.bulkCreate(notificaciones);
    return notificaciones;
  } catch (error) {
    throw new Error(`Error al crear notificaciones: ${error.message}`);
  }
};

/**
 * Obtener notificaciones de un usuario
 */
export const getUserNotifications = async (usuario_id, { limit = 20, includeRead = false } = {}) => {
  try {
    const where = { usuario_id };
    
    if (!includeRead) {
      where.leida = false;
    }

    const notificaciones = await Notificacion.findAll({
      where,
      order: [['fecha_creacion', 'DESC']],
      limit: parseInt(limit),
    });

    return notificaciones;
  } catch (error) {
    throw new Error(`Error al obtener notificaciones: ${error.message}`);
  }
};

/**
 * Marcar una notificación como leída
 */
export const markAsRead = async (notificacion_id, usuario_id) => {
  try {
    const notificacion = await Notificacion.findOne({
      where: {
        id: notificacion_id,
        usuario_id,
      },
    });

    if (!notificacion) {
      throw new Error('Notificación no encontrada');
    }

    await notificacion.update({ leida: true });
    return notificacion;
  } catch (error) {
    throw new Error(`Error al marcar notificación como leída: ${error.message}`);
  }
};

/**
 * Marcar todas las notificaciones como leídas
 */
export const markAllAsRead = async (usuario_id) => {
  try {
    await Notificacion.update(
      { leida: true },
      {
        where: {
          usuario_id,
          leida: false,
        },
      }
    );

    return { success: true };
  } catch (error) {
    throw new Error(`Error al marcar todas las notificaciones como leídas: ${error.message}`);
  }
};

/**
 * Contar notificaciones no leídas
 */
export const countUnreadNotifications = async (usuario_id) => {
  try {
    const count = await Notificacion.count({
      where: {
        usuario_id,
        leida: false,
      },
    });

    return count;
  } catch (error) {
    throw new Error(`Error al contar notificaciones no leídas: ${error.message}`);
  }
};

/**
 * Eliminar una notificación
 */
export const deleteNotification = async (notificacion_id, usuario_id) => {
  try {
    const notificacion = await Notificacion.findOne({
      where: {
        id: notificacion_id,
        usuario_id,
      },
    });

    if (!notificacion) {
      throw new Error('Notificación no encontrada');
    }

    await notificacion.destroy();
    return { success: true };
  } catch (error) {
    throw new Error(`Error al eliminar notificación: ${error.message}`);
  }
};
