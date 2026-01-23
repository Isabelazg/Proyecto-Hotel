import { getPermisosService, showPermisoService, createPermisoService, updatePermisoService, deletePermisoService } from '../../services/permiso.service.js';
import { successResponse, errorResponse, formatJsonApiData } from '../../utils/response.util.js';

export const getPermisos = async (req, res) => {
  try {
    const { data, meta, links } = await getPermisosService(req);
    return successResponse(
      res,
      formatJsonApiData(data, ['id', 'nombre', 'descripcion']),
      200,
      meta,
      links
    );
  } catch (error) {
    return errorResponse(res, 'Error al obtener los permisos', 500, [
      { code: 'GET_PERMISOS_ERROR', detail: error.message },
    ]);
  }
};

export const showPermiso = async (req, res) => {
  try {
    const permiso = await showPermisoService(req.params.id);
    if (!permiso) {
      return errorResponse(res, 'Permiso no encontrado', 404, [
        { code: 'PERMISO_NOT_FOUND', detail: `No existe un permiso con id ${req.params.id}` },
      ]);
    }
    return successResponse(res, { id: permiso.id, nombre: permiso.nombre, descripcion: permiso.descripcion }, 200);
  } catch (error) {
    return errorResponse(res, 'Error al obtener el permiso', 500, [
      { code: 'SHOW_PERMISO_ERROR', detail: error.message },
    ]);
  }
};

export const createPermiso = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const permiso = await createPermisoService({ nombre, descripcion });
    return successResponse(res, { id: permiso.id, nombre: permiso.nombre, descripcion: permiso.descripcion }, 201, null, null, 'Permiso creado correctamente');
  } catch (error) {
    return errorResponse(res, 'Error al crear el permiso', 500, [
      { code: 'CREATE_PERMISO_ERROR', detail: error.message },
    ]);
  }
};

export const updatePermiso = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const permiso = await updatePermisoService(req.params.id, { nombre, descripcion });
    return successResponse(res, { id: permiso.id, nombre: permiso.nombre, descripcion: permiso.descripcion }, 200, null, null, 'Permiso actualizado correctamente');
  } catch (error) {
    return errorResponse(res, 'Error al actualizar el permiso', 500, [
      { code: 'UPDATE_PERMISO_ERROR', detail: error.message },
    ]);
  }
};

export const deletePermiso = async (req, res) => {
  try {
    const permiso = await deletePermisoService(req.params.id);
    return successResponse(res, { id: permiso.id, nombre: permiso.nombre }, 200, null, null, `Permiso ${permiso.nombre} eliminado correctamente`);
  } catch (error) {
    return errorResponse(res, 'Error al eliminar el permiso', 500, [
      { code: 'DELETE_PERMISO_ERROR', detail: error.message },
    ]);
  }
};
