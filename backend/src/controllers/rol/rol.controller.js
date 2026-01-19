import { getRolesService, showRolService, createRolService, updateRolService, deleteRolService } from '../../services/rol.service.js';
import { successResponse, errorResponse, formatJsonApiData } from '../../utils/response.util.js';

export const getRoles = async (req, res) => {
  try {
    const { data, meta, links } = await getRolesService(req);
    const formatted = data.map(rol => ({
      id: rol.id,
      nombre: rol.nombre,
      descripcion: rol.descripcion,
      permisos: Array.isArray(rol.permisos)
        ? rol.permisos.map(p => ({ id: p.id, nombre: p.nombre, descripcion: p.descripcion }))
        : [],
    }));
    return successResponse(res, formatted, 200, meta, links);
  } catch (error) {
    return errorResponse(res, 'Error al obtener los roles', 500, [
      { code: 'GET_ROLES_ERROR', detail: error.message },
    ]);
  }
};

export const showRol = async (req, res) => {
  try {
    const rol = await showRolService(req.params.id);
    if (!rol) {
      return errorResponse(res, 'Rol no encontrado', 404, [
        { code: 'ROL_NOT_FOUND', detail: `No existe un rol con id ${req.params.id}` },
      ]);
    }
    return successResponse(res, {
      id: rol.id,
      nombre: rol.nombre,
      descripcion: rol.descripcion,
      permisos: Array.isArray(rol.permisos)
        ? rol.permisos.map(p => ({ id: p.id, nombre: p.nombre, descripcion: p.descripcion }))
        : [],
    }, 200);
  } catch (error) {
    return errorResponse(res, 'Error al obtener el rol', 500, [
      { code: 'SHOW_ROL_ERROR', detail: error.message },
    ]);
  }
};

export const createRol = async (req, res) => {
  try {
    const { nombre, descripcion, permisos } = req.body;
    const rol = await createRolService({ nombre, descripcion, permisos });
    return successResponse(res, {
      id: rol.id,
      nombre: rol.nombre,
      descripcion: rol.descripcion,
      permisos: Array.isArray(rol.permisos)
        ? rol.permisos.map(p => ({ id: p.id, nombre: p.nombre, descripcion: p.descripcion }))
        : [],
    }, 201, null, null, 'Rol creado correctamente');
  } catch (error) {
    return errorResponse(res, 'Error al crear el rol', 500, [
      { code: 'CREATE_ROL_ERROR', detail: error.message },
    ]);
  }
};

export const updateRol = async (req, res) => {
  try {
    const { nombre, descripcion, permisos } = req.body;
    const rol = await updateRolService(req.params.id, { nombre, descripcion, permisos });
    return successResponse(res, {
      id: rol.id,
      nombre: rol.nombre,
      descripcion: rol.descripcion,
      permisos: Array.isArray(rol.permisos)
        ? rol.permisos.map(p => ({ id: p.id, nombre: p.nombre, descripcion: p.descripcion }))
        : [],
    }, 200, null, null, 'Rol actualizado correctamente');
  } catch (error) {
    return errorResponse(res, 'Error al actualizar el rol', 500, [
      { code: 'UPDATE_ROL_ERROR', detail: error.message },
    ]);
  }
};

export const deleteRol = async (req, res) => {
  try {
    const rol = await deleteRolService(req.params.id);
    return successResponse(res, { id: rol.id, nombre: rol.nombre }, 200, null, null, `Rol ${rol.nombre} eliminado correctamente`);
  } catch (error) {
    return errorResponse(res, 'Error al eliminar el rol', 500, [
      { code: 'DELETE_ROL_ERROR', detail: error.message },
    ]);
  }
};
