import {
  getTiposHospedajeService,
  showTipoHospedajeService,
  createTipoHospedajeService,
  updateTipoHospedajeService,
  deleteTipoHospedajeService
} from '../../services/tipoHospedaje.service.js';
import { successResponse, errorResponse, formatJsonApiData } from '../../utils/response.util.js';

export const getTiposHospedaje = async (req, res) => {
  try {
    const { data, meta, links } = await getTiposHospedajeService(req);
    return successResponse(
      res,
      formatJsonApiData(data, ['id', 'nombre', 'descripcion']),
      200,
      meta,
      links
    );
  } catch (error) {
    return errorResponse(res, 'Error al obtener los tipos de hospedaje', 500, [
      { code: 'GET_TIPOS_HOSPEDAJE_ERROR', detail: error.message },
    ]);
  }
};

export const showTipoHospedaje = async (req, res) => {
  try {
    const tipoHospedaje = await showTipoHospedajeService(req.params.id);
    if (!tipoHospedaje) {
      return errorResponse(res, 'Tipo de hospedaje no encontrado', 404, [
        { code: 'TIPO_HOSPEDAJE_NOT_FOUND', detail: `No existe un tipo de hospedaje con id ${req.params.id}` },
      ]);
    }
    return successResponse(res, {
      id: tipoHospedaje.id,
      nombre: tipoHospedaje.nombre,
      descripcion: tipoHospedaje.descripcion
    }, 200);
  } catch (error) {
    return errorResponse(res, 'Error al obtener el tipo de hospedaje', 500, [
      { code: 'SHOW_TIPO_HOSPEDAJE_ERROR', detail: error.message },
    ]);
  }
};

export const createTipoHospedaje = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const tipoHospedaje = await createTipoHospedajeService({ nombre, descripcion });
    return successResponse(res, {
      id: tipoHospedaje.id,
      nombre: tipoHospedaje.nombre,
      descripcion: tipoHospedaje.descripcion
    }, 201, null, null, 'Tipo de hospedaje creado correctamente');
  } catch (error) {
    return errorResponse(res, 'Error al crear el tipo de hospedaje', 500, [
      { code: 'CREATE_TIPO_HOSPEDAJE_ERROR', detail: error.message },
    ]);
  }
};

export const updateTipoHospedaje = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const tipoHospedaje = await updateTipoHospedajeService(req.params.id, { nombre, descripcion });
    return successResponse(res, {
      id: tipoHospedaje.id,
      nombre: tipoHospedaje.nombre,
      descripcion: tipoHospedaje.descripcion
    }, 200, null, null, 'Tipo de hospedaje actualizado correctamente');
  } catch (error) {
    return errorResponse(res, 'Error al actualizar el tipo de hospedaje', 500, [
      { code: 'UPDATE_TIPO_HOSPEDAJE_ERROR', detail: error.message },
    ]);
  }
};

export const deleteTipoHospedaje = async (req, res) => {
  try {
    const tipoHospedaje = await deleteTipoHospedajeService(req.params.id);
    return successResponse(res, {
      id: tipoHospedaje.id,
      nombre: tipoHospedaje.nombre
    }, 200, null, null, `Tipo de hospedaje ${tipoHospedaje.nombre} eliminado correctamente`);
  } catch (error) {
    return errorResponse(res, 'Error al eliminar el tipo de hospedaje', 500, [
      { code: 'DELETE_TIPO_HOSPEDAJE_ERROR', detail: error.message },
    ]);
  }
};
