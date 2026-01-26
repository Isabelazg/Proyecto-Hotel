import {
  getHospedajesService,
  showHospedajeService,
  createHospedajeService,
  updateHospedajeService,
  updateHospedajeEstadoService,
  deleteHospedajeService
} from '../../services/hospedaje.service.js';
import { successResponse, errorResponse, formatJsonApiData } from '../../utils/response.util.js';

export const getHospedajes = async (req, res) => {
  try {
    const { data, meta, links } = await getHospedajesService(req);
    const formatted = data.map(hospedaje => ({
      id: hospedaje.id,
      nombre: hospedaje.nombre,
      precio: hospedaje.precio,
      estado: hospedaje.estado,
      descripcion: hospedaje.descripcion,
      capacidad: hospedaje.capacidad,
      tipo_hospedaje: hospedaje.tipo_hospedaje
        ? {
          id: hospedaje.tipo_hospedaje.id,
          nombre: hospedaje.tipo_hospedaje.nombre,
          descripcion: hospedaje.tipo_hospedaje.descripcion
        }
        : null,
    }));
    return successResponse(res, formatted, 200, meta, links);
  } catch (error) {
    return errorResponse(res, 'Error al obtener los hospedajes', 500, [
      { code: 'GET_HOSPEDAJES_ERROR', detail: error.message },
    ]);
  }
};

export const showHospedaje = async (req, res) => {
  try {
    const hospedaje = await showHospedajeService(req.params.id);
    if (!hospedaje) {
      return errorResponse(res, 'Hospedaje no encontrado', 404, [
        { code: 'HOSPEDAJE_NOT_FOUND', detail: `No existe un hospedaje con id ${req.params.id}` },
      ]);
    }
    return successResponse(res, {
      id: hospedaje.id,
      nombre: hospedaje.nombre,
      precio: hospedaje.precio,
      estado: hospedaje.estado,
      descripcion: hospedaje.descripcion,
      capacidad: hospedaje.capacidad,
      tipo_hospedaje: hospedaje.tipo_hospedaje
        ? {
          id: hospedaje.tipo_hospedaje.id,
          nombre: hospedaje.tipo_hospedaje.nombre,
          descripcion: hospedaje.tipo_hospedaje.descripcion
        }
        : null,
    }, 200);
  } catch (error) {
    return errorResponse(res, 'Error al obtener el hospedaje', 500, [
      { code: 'SHOW_HOSPEDAJE_ERROR', detail: error.message },
    ]);
  }
};

export const createHospedaje = async (req, res) => {
  try {
    const { nombre, tipo_hospedaje_id, precio, estado, descripcion, capacidad } = req.body;
    const hospedaje = await createHospedajeService({ nombre, tipo_hospedaje_id, precio, estado, descripcion, capacidad });
    return successResponse(res, {
      id: hospedaje.id,
      nombre: hospedaje.nombre,
      precio: hospedaje.precio,
      estado: hospedaje.estado,
      descripcion: hospedaje.descripcion,
      capacidad: hospedaje.capacidad,
      tipo_hospedaje: hospedaje.tipo_hospedaje
        ? {
          id: hospedaje.tipo_hospedaje.id,
          nombre: hospedaje.tipo_hospedaje.nombre,
          descripcion: hospedaje.tipo_hospedaje.descripcion
        }
        : null,
    }, 201, null, null, 'Hospedaje creado correctamente');
  } catch (error) {
    return errorResponse(res, 'Error al crear el hospedaje', 500, [
      { code: 'CREATE_HOSPEDAJE_ERROR', detail: error.message },
    ]);
  }
};

export const updateHospedaje = async (req, res) => {
  try {
    const { nombre, tipo_hospedaje_id, precio, estado, descripcion, capacidad } = req.body;
    const hospedaje = await updateHospedajeService(req.params.id, { nombre, tipo_hospedaje_id, precio, estado, descripcion, capacidad });
    return successResponse(res, {
      id: hospedaje.id,
      nombre: hospedaje.nombre,
      precio: hospedaje.precio,
      estado: hospedaje.estado,
      descripcion: hospedaje.descripcion,
      capacidad: hospedaje.capacidad,
      tipo_hospedaje: hospedaje.tipo_hospedaje
        ? {
          id: hospedaje.tipo_hospedaje.id,
          nombre: hospedaje.tipo_hospedaje.nombre,
          descripcion: hospedaje.tipo_hospedaje.descripcion
        }
        : null,
    }, 200, null, null, 'Hospedaje actualizado correctamente');
  } catch (error) {
    return errorResponse(res, 'Error al actualizar el hospedaje', 500, [
      { code: 'UPDATE_HOSPEDAJE_ERROR', detail: error.message },
    ]);
  }
};

export const updateHospedajeEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const hospedaje = await updateHospedajeEstadoService(req.params.id, estado);
    return successResponse(res, {
      id: hospedaje.id,
      nombre: hospedaje.nombre,
      estado: hospedaje.estado,
    }, 200, null, null, `Estado del hospedaje actualizado a ${estado ? 'disponible' : 'no disponible'}`);
  } catch (error) {
    return errorResponse(res, 'Error al actualizar el estado del hospedaje', 500, [
      { code: 'UPDATE_HOSPEDAJE_ESTADO_ERROR', detail: error.message },
    ]);
  }
};

export const deleteHospedaje = async (req, res) => {
  try {
    const hospedaje = await deleteHospedajeService(req.params.id);
    return successResponse(res, {
      id: hospedaje.id,
      nombre: hospedaje.nombre
    }, 200, null, null, `Hospedaje ${hospedaje.nombre} eliminado correctamente`);
  } catch (error) {
    return errorResponse(res, 'Error al eliminar el hospedaje', 500, [
      { code: 'DELETE_HOSPEDAJE_ERROR', detail: error.message },
    ]);
  }
};
