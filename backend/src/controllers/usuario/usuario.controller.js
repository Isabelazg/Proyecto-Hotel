import { 
  getUsersService, 
  showUserService, 
  createUserService, 
  updateUserService, 
  deleteUserService 
} from '../../services/usuario.service.js';
import { successResponse, errorResponse, formatJsonApiData } from '../../utils/response.util.js';
import { Rol } from '../../models/index.js';

/**
 * Controlador para obtener usuarios con filtros, orden y paginación.
 */
export const getUsers = async (req, res) => {
  try {
    const { data, meta, links } = await getUsersService(req);

    return successResponse(
      res,
      formatJsonApiData(
        data,
        [
          "id",
          "documento",
          "nombre",
          "apellido",
          "correo",
          "telefono",
          "rol"
        ]
      ),
      200,
      meta,
      links
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener los usuarios", 500, [
      {
        code: "GET_USERS_ERROR",
        detail: error.message,
      },
    ]);
  }
};

/**
 * Muestra un usuario por ID.
 */
export const showUser = async (req, res) => {
  try {
    const user = await showUserService(req.params.id);

    if (!user) {
      return errorResponse(res, "No existe un usuario con ese ID", 404, [
        {
          code: "USER_NOT_FOUND",
          detail: `No existe un usuario con id ${req.params.id}`,
        },
      ]);
    }

    return successResponse(
      res,
      {
        id: user.id,
        documento: user.documento,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        telefono: user.telefono,
        rol: user.rol
          ? {
            id: user.rol.id,
            nombre: user.rol.nombre
          }
          : null
      },
      200
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener el usuario", 500, [
      {
        code: "SHOW_USER_ERROR",
        detail: error.message,
      },
    ]);
  }
};

/**
 * Crea un nuevo usuario.
 */
export const createUser = async (req, res) => {
  try {
    const { documento, nombre, apellido, correo, telefono, contrasena, rol_id } = req.body;

    const newUser = await createUserService({
      documento,
      nombre,
      apellido,
      correo,
      telefono,
      contrasena,
      rol_id
    });

    return successResponse(
      res,
      {
        id: newUser.id,
        documento: newUser.documento,
        nombre: newUser.nombre,
        apellido: newUser.apellido,
        correo: newUser.correo,
        telefono: newUser.telefono,
        rol: newUser.rol
          ? {
            id: newUser.rol.id,
            nombre: newUser.rol.nombre
          }
          : null
      },
      201,
      null,
      null,
      'Usuario creado correctamente'
    );
  } catch (error) {
    return errorResponse(res, "Error al crear el usuario", 500, [
      {
        code: "CREATE_USER_ERROR",
        detail: error.message,
      },
    ]);
  }
};

/**
 * Actualiza un usuario por documento.
 */
export const updateUser = async (req, res) => {
  try {
    const { documento } = req.params;
    const { nombre, apellido, correo, telefono, contrasena, rol_id } = req.body;

    const updatedUser = await updateUserService(documento, {
      nombre,
      apellido,
      correo,
      telefono,
      contrasena,
      rol_id
    });

    if (!updatedUser) {
      return errorResponse(res, "Error al actualizar el usuario", 500, [
        {
          code: "USER_UPDATE_ERROR",
          detail: "No se pudo actualizar el usuario",
        },
      ]);
    }

    return successResponse(
      res,
      {
        id: updatedUser.id,
        documento: updatedUser.documento,
        nombre: updatedUser.nombre,
        apellido: updatedUser.apellido,
        correo: updatedUser.correo,
        telefono: updatedUser.telefono,
        rol: updatedUser.rol
          ? {
            id: updatedUser.rol.id,
            nombre: updatedUser.rol.nombre
          }
          : null
      },
      200,
      null,
      null,
      'Usuario actualizado correctamente'
    );
  } catch (error) {
    return errorResponse(res, "Error al actualizar el usuario", 500, [
      {
        code: "UPDATE_USER_ERROR",
        detail: error.message,
      },
    ]);
  }
};

/**
 * Elimina un usuario por ID.
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserService(id);

    if (!deletedUser) {
      return errorResponse(res, "Usuario no encontrado", 404, [
        {
          code: "USER_NOT_FOUND",
          detail: `No existe un usuario con id ${id}`,
        },
      ]);
    }

    return successResponse(
      res,
      {
        id: deletedUser.id,
        nombre: deletedUser.nombre,
        apellido: deletedUser.apellido
      },
      200,
      null,
      null,
      `Usuario ${deletedUser.nombre} ${deletedUser.apellido} eliminado correctamente`
    );
  } catch (error) {
    return errorResponse(res, "Error al eliminar el usuario", 500, [
      {
        code: "DELETE_USER_ERROR",
        detail: error.message,
      },
    ]);
  }
};
