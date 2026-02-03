import {
  getPagosService,
  showPagoService,
  createPagoService,
  updatePagoService,
  deletePagoService,
  getEstadoPagosReservaService
} from '../../services/pago.service.js';
import { successResponse, errorResponse } from '../../utils/response.util.js';

export const getPagos = async (req, res) => {
  try {
    const { data, meta, links } = await getPagosService(req);
    const formatted = data.map(pago => ({
      id: pago.id,
      valor: pago.valor,
      reserva: pago.reserva
        ? {
          id: pago.reserva.id,
          numero_reserva: pago.reserva.numero_reserva,
          valor: pago.reserva.valor,
          estado: pago.reserva.estado,
        }
        : null,
      usuario: pago.usuario
        ? {
          id: pago.usuario.id,
          nombre: pago.usuario.nombre,
          apellido: pago.usuario.apellido,
          correo: pago.usuario.correo,
        }
        : null,
    }));
    return successResponse(res, formatted, 200, meta, links);
  } catch (error) {
    return errorResponse(res, 'Error al obtener los pagos', 500, [
      { code: 'GET_PAGOS_ERROR', detail: error.message },
    ]);
  }
};

export const showPago = async (req, res) => {
  try {
    const pago = await showPagoService(req.params.id);
    if (!pago) {
      return errorResponse(res, 'Pago no encontrado', 404, [
        { code: 'PAGO_NOT_FOUND', detail: `No existe un pago con id ${req.params.id}` },
      ]);
    }
    return successResponse(res, {
      id: pago.id,
      valor: pago.valor,
      reserva_id: pago.reserva_id,
      usuario_id: pago.usuario_id,
      reserva_id: pago.reserva_id,
      usuario_id: pago.usuario_id,
      reserva: pago.reserva
        ? {
          id: pago.reserva.id,
          numero_reserva: pago.reserva.numero_reserva,
          valor: pago.reserva.valor,
          estado: pago.reserva.estado,
        }
        : null,
      usuario: pago.usuario
        ? {
          id: pago.usuario.id,
          nombre: pago.usuario.nombre,
          apellido: pago.usuario.apellido,
          correo: pago.usuario.correo,
        }
        : null,
    }, 200);
  } catch (error) {
    return errorResponse(res, 'Error al obtener el pago', 500, [
      { code: 'SHOW_PAGO_ERROR', detail: error.message },
    ]);
  }
};

export const createPago = async (req, res) => {
  try {
    const { reserva_id, usuario_id, valor } = req.body;
    const { pago, infoValidacion } = await createPagoService({ reserva_id, usuario_id, valor });

    return successResponse(res, {
      id: pago.id,
      valor: pago.valor,
      reserva: pago.reserva
        ? {
          id: pago.reserva.id,
          numero_reserva: pago.reserva.numero_reserva,
          valor: pago.reserva.valor,
          estado: pago.reserva.estado,
        }
        : null,
      usuario: pago.usuario
        ? {
          id: pago.usuario.id,
          nombre: pago.usuario.nombre,
          apellido: pago.usuario.apellido,
        }
        : null,
      estado_pagos: {
        valor_reserva: infoValidacion.valorReserva,
        total_pagado: infoValidacion.nuevoTotal,
        pendiente: infoValidacion.pendiente,
      },
    }, 201, null, null, `Pago registrado correctamente. Pendiente: $${infoValidacion.pendiente.toFixed(2)}`);
  } catch (error) {
    return errorResponse(res, 'Error al crear el pago', 500, [
      { code: 'CREATE_PAGO_ERROR', detail: error.message },
    ]);
  }
};

export const updatePago = async (req, res) => {
  try {
    const { reserva_id, usuario_id, valor } = req.body;
    const { pago, infoValidacion } = await updatePagoService(req.params.id, { reserva_id, usuario_id, valor });

    return successResponse(res, {
      id: pago.id,
      valor: pago.valor,
      reserva_id: pago.reserva_id,
      usuario_id: pago.usuario_id,
      reserva_id: pago.reserva_id,
      usuario_id: pago.usuario_id,
      reserva: pago.reserva
        ? {
          id: pago.reserva.id,
          numero_reserva: pago.reserva.numero_reserva,
          valor: pago.reserva.valor,
        }
        : null,
      usuario: pago.usuario
        ? {
          id: pago.usuario.id,
          nombre: pago.usuario.nombre,
          apellido: pago.usuario.apellido,
        }
        : null,
      estado_pagos: {
        valor_reserva: infoValidacion.valorReserva,
        total_pagado: infoValidacion.nuevoTotal,
        pendiente: infoValidacion.pendiente,
      },
    }, 200, null, null, `Pago actualizado correctamente. Pendiente: $${infoValidacion.pendiente.toFixed(2)}`);
  } catch (error) {
    return errorResponse(res, 'Error al actualizar el pago', 500, [
      { code: 'UPDATE_PAGO_ERROR', detail: error.message },
    ]);
  }
};

export const deletePago = async (req, res) => {
  try {
    const pago = await deletePagoService(req.params.id);
    return successResponse(res, {
      id: pago.id,
      valor: pago.valor
    }, 200, null, null, 'Pago eliminado correctamente');
  } catch (error) {
    return errorResponse(res, 'Error al eliminar el pago', 500, [
      { code: 'DELETE_PAGO_ERROR', detail: error.message },
    ]);
  }
};

export const getEstadoPagosReserva = async (req, res) => {
  try {
    const estado = await getEstadoPagosReservaService(req.params.reserva_id);
    return successResponse(res, estado, 200);
  } catch (error) {
    return errorResponse(res, 'Error al obtener estado de pagos', 500, [
      { code: 'GET_ESTADO_PAGOS_ERROR', detail: error.message },
    ]);
  }
};
