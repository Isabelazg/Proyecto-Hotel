import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Usuario, Rol } from "../models/index.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

dotenv.config();

/**
 * Login de usuario - Retorna JWT token
 */
export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Buscar usuario por correo
    const usuario = await Usuario.findOne({
      where: { correo },
      include: [
        {
          model: Rol,
          as: 'rol',
          attributes: ['id', 'nombre']
        }
      ]
    });

    if (!usuario) {
      return errorResponse(res, "Credenciales inválidas", 401, [
        {
          code: "INVALID_CREDENTIALS",
          detail: "El correo o la contraseña son incorrectos.",
        },
      ]);
    }

    // Comparar contraseña
    const esValida = await Usuario.comparePassword(contrasena, usuario.contrasena);

    if (!esValida) {
      return errorResponse(res, "Credenciales inválidas", 401, [
        {
          code: "INVALID_CREDENTIALS",
          detail: "El correo o la contraseña son incorrectos.",
        },
      ]);
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        correo: usuario.correo,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol?.nombre || null,
        rol_id: usuario.rol_id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    return successResponse(
      res,
      {
        token,
        usuario: {
          id: usuario.id,
          documento: usuario.documento,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          correo: usuario.correo,
          telefono: usuario.telefono,
          rol: usuario.rol
            ? {
              id: usuario.rol.id,
              nombre: usuario.rol.nombre
            }
            : null
        }
      },
      200,
      null,
      null,
      'Bienvenido'
    );
  } catch (error) {
    return errorResponse(res, "Error al iniciar sesión", 500, [
      {
        code: "LOGIN_ERROR",
        detail: error.message,
      },
    ]);
  }
};

/**
 * Obtiene el perfil del usuario autenticado
 */
export const perfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      include: [
        {
          model: Rol,
          as: 'rol',
          attributes: ['id', 'nombre']
        }
      ]
    });

    if (!usuario) {
      return errorResponse(res, "Usuario no encontrado", 404);
    }

    return successResponse(
      res,
      {
        id: usuario.id,
        documento: usuario.documento,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        telefono: usuario.telefono,
        rol: usuario.rol
          ? {
            id: usuario.rol.id,
            nombre: usuario.rol.nombre
          }
          : null
      },
      200
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener perfil", 500, [
      {
        code: "PERFIL_ERROR",
        detail: error.message,
      },
    ]);
  }
};
