import {
  getReservasService,
  showReservaService,
  createReservaService,
  updateReservaService,
  iniciarReservaService,
  finalizarReservaService,
  deleteReservaService
} from '../../services/reserva.service.js';
import { successResponse, errorResponse } from '../../utils/response.util.js';

export const getReservas = async (req, res) => {
  try {
    const { data, meta, links } = await getReservasService(req);
    const formatted = data.map(reserva => ({
      id: reserva.id,
      numero_reserva: reserva.numero_reserva,
      estado: reserva.estado,
      fecha_ingreso_hora: reserva.fecha_ingreso_hora,
      fecha_salida_hora: reserva.fecha_salida_hora,
      numero_huespedes: reserva.numero_huespedes,
      notas: reserva.notas,
      valor: reserva.valor,
      hospedaje: reserva.hospedaje
        ? {
          id: reserva.hospedaje.id,
          nombre: reserva.hospedaje.nombre,
          precio: reserva.hospedaje.precio,
          estado: reserva.hospedaje.estado,
          tipo_hospedaje: reserva.hospedaje.tipo_hospedaje
            ? {
              id: reserva.hospedaje.tipo_hospedaje.id,
              nombre: reserva.hospedaje.tipo_hospedaje.nombre,
            }
            : null,
        }
        : null,
    }));
    return successResponse(res, formatted, 200, meta, links);
  } catch (error) {
    return errorResponse(res, 'Error al obtener las reservas', 500, [
      { code: 'GET_RESERVAS_ERROR', detail: error.message },
    ]);
  }
};

export const showReserva = async (req, res) => {
  try {
    const reserva = await showReservaService(req.params.id);
    if (!reserva) {
      return errorResponse(res, 'Reserva no encontrada', 404, [
        { code: 'RESERVA_NOT_FOUND', detail: `No existe una reserva con id ${req.params.id}` },
      ]);
    }
    return successResponse(res, {
      id: reserva.id,
      numero_reserva: reserva.numero_reserva,
      estado: reserva.estado,
      fecha_ingreso_hora: reserva.fecha_ingreso_hora,
      fecha_salida_hora: reserva.fecha_salida_hora,
      numero_huespedes: reserva.numero_huespedes,
      notas: reserva.notas,
      valor: reserva.valor,
      hospedaje: reserva.hospedaje
        ? {
          id: reserva.hospedaje.id,
          nombre: reserva.hospedaje.nombre,
          precio: reserva.hospedaje.precio,
          estado: reserva.hospedaje.estado,
          tipo_hospedaje: reserva.hospedaje.tipo_hospedaje
            ? {
              id: reserva.hospedaje.tipo_hospedaje.id,
              nombre: reserva.hospedaje.tipo_hospedaje.nombre,
            }
            : null,
        }
        : null,
    }, 200);
  } catch (error) {
    return errorResponse(res, 'Error al obtener la reserva', 500, [
      { code: 'SHOW_RESERVA_ERROR', detail: error.message },
    ]);
  }
};

export const createReserva = async (req, res) => {
  try {
    const {
      numero_reserva,
      estado,
      hospedaje_id,
      fecha_ingreso_hora,
      fecha_salida_hora,
      numero_huespedes,
      notas,
      valor
    } = req.body;

    const reserva = await createReservaService({
      numero_reserva,
      estado,
      hospedaje_id,
      fecha_ingreso_hora,
      fecha_salida_hora,
      numero_huespedes,
      notas,
      valor
    });

    return successResponse(res, {
      id: reserva.id,
      numero_reserva: reserva.numero_reserva,
      estado: reserva.estado,
      fecha_ingreso_hora: reserva.fecha_ingreso_hora,
      fecha_salida_hora: reserva.fecha_salida_hora,
      numero_huespedes: reserva.numero_huespedes,
      notas: reserva.notas,
      valor: reserva.valor,
      hospedaje: reserva.hospedaje
        ? {
          id: reserva.hospedaje.id,
          nombre: reserva.hospedaje.nombre,
          precio: reserva.hospedaje.precio,
          estado: reserva.hospedaje.estado,
        }
        : null,
    }, 201, null, null, 'Reserva creada correctamente');
  } catch (error) {
    return errorResponse(res, 'Error al crear la reserva', 500, [
      { code: 'CREATE_RESERVA_ERROR', detail: error.message },
    ]);
  }
};

export const updateReserva = async (req, res) => {
  try {
    const {
      numero_reserva,
      estado,
      hospedaje_id,
      fecha_ingreso_hora,
      fecha_salida_hora,
      numero_huespedes,
      notas,
      valor
    } = req.body;

    const reserva = await updateReservaService(req.params.id, {
      numero_reserva,
      estado,
      hospedaje_id,
      fecha_ingreso_hora,
      fecha_salida_hora,
      numero_huespedes,
      notas,
      valor
    });

    return successResponse(res, {
      id: reserva.id,
      numero_reserva: reserva.numero_reserva,
      estado: reserva.estado,
      fecha_ingreso_hora: reserva.fecha_ingreso_hora,
      fecha_salida_hora: reserva.fecha_salida_hora,
      numero_huespedes: reserva.numero_huespedes,
      notas: reserva.notas,
      valor: reserva.valor,
      hospedaje: reserva.hospedaje
        ? {
          id: reserva.hospedaje.id,
          nombre: reserva.hospedaje.nombre,
          precio: reserva.hospedaje.precio,
          estado: reserva.hospedaje.estado,
        }
        : null,
    }, 200, null, null, 'Reserva actualizada correctamente');
  } catch (error) {
    return errorResponse(res, 'Error al actualizar la reserva', 500, [
      { code: 'UPDATE_RESERVA_ERROR', detail: error.message },
    ]);
  }
};

export const finalizarReserva = async (req, res) => {
  try {
    const reserva = await finalizarReservaService(req.params.id);
    return successResponse(res, {
      id: reserva.id,
      numero_reserva: reserva.numero_reserva,
      estado: reserva.estado,
      hospedaje: reserva.hospedaje
        ? {
          id: reserva.hospedaje.id,
          nombre: reserva.hospedaje.nombre,
          estado: reserva.hospedaje.estado,
        }
        : null,
    }, 200, null, null, 'Reserva finalizada y hospedaje marcado como disponible');
  } catch (error) {
    return errorResponse(res, 'Error al finalizar la reserva', 500, [
      { code: 'FINALIZAR_RESERVA_ERROR', detail: error.message },
    ]);
  }
};

export const iniciarReserva = async (req, res) => {
  try {
    const reserva = await iniciarReservaService(req.params.id);
    return successResponse(res, {
      id: reserva.id,
      numero_reserva: reserva.numero_reserva,
      estado: reserva.estado,
      hospedaje: reserva.hospedaje
        ? {
          id: reserva.hospedaje.id,
          nombre: reserva.hospedaje.nombre,
          estado: reserva.hospedaje.estado,
        }
        : null,
    }, 200, null, null, 'Reserva iniciada y hospedaje marcado como no disponible');
  } catch (error) {
    return errorResponse(res, 'Error al iniciar la reserva', 500, [
      { code: 'INICIAR_RESERVA_ERROR', detail: error.message },
    ]);
  }
};

export const deleteReserva = async (req, res) => {
  try {
    const reserva = await deleteReservaService(req.params.id);
    return successResponse(res, {
      id: reserva.id,
      numero_reserva: reserva.numero_reserva
    }, 200, null, null, `Reserva ${reserva.numero_reserva} eliminada y hospedaje liberado`);
  } catch (error) {
    return errorResponse(res, 'Error al eliminar la reserva', 500, [
      { code: 'DELETE_RESERVA_ERROR', detail: error.message },
    ]);
  }
};
