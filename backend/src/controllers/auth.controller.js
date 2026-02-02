import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import { Usuario, Rol } from "../models/index.js";
import { successResponse, errorResponse } from "../utils/response.util.js";
import { createUserService } from "../services/usuario.service.js";
import { sendWelcomeEmail, sendPasswordResetEmail } from "../services/mail.service.js";

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
 * Registro de usuario - Envía correo de bienvenida
 */
export const register = async (req, res) => {
  try {
    const { documento, nombre, apellido, correo, telefono, contrasena, rol_id } = req.body;

    const newUser = await createUserService({
      documento,
      nombre,
      apellido,
      correo,
      telefono,
      contrasena,
      rol_id,
    });

    await sendWelcomeEmail({
      correo: newUser.correo,
      nombre: newUser.nombre,
      apellido: newUser.apellido,
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
      'Usuario registrado correctamente'
    );
  } catch (error) {
    return errorResponse(res, "Error al registrar usuario", 500, [
      {
        code: "REGISTER_ERROR",
        detail: error.message,
      },
    ]);
  }
};

/**
 * Solicitar recuperación de contraseña - Envía correo con enlace
 */
export const forgotPassword = async (req, res) => {
  try {
    const { correo } = req.body;

    const usuario = await Usuario.findOne({ where: { correo } });

    if (usuario) {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000);

      await usuario.update({
        reset_token: token,
        reset_token_expires: expires,
      });

      const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      const resetLink = `${baseUrl}/reset-password?token=${token}`;

      await sendPasswordResetEmail({
        correo: usuario.correo,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        resetLink,
      });
    }

    return successResponse(
      res,
      { correo },
      200,
      null,
      null,
      "Si el correo existe, enviaremos un enlace para restablecer la contraseña"
    );
  } catch (error) {
    return errorResponse(res, "Error al enviar correo de recuperación", 500, [
      {
        code: "FORGOT_PASSWORD_ERROR",
        detail: error.message,
      },
    ]);
  }
};

/**
 * Restablecer contraseña con token
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, contrasena } = req.body;

    const usuario = await Usuario.findOne({
      where: {
        reset_token: token,
      },
    });

    if (!usuario || !usuario.reset_token_expires || usuario.reset_token_expires < new Date()) {
      return errorResponse(res, "Token inválido o expirado", 400, [
        {
          code: "INVALID_TOKEN",
          detail: "El token de recuperación es inválido o ha expirado.",
        },
      ]);
    }

    await usuario.update({
      contrasena,
      reset_token: null,
      reset_token_expires: null,
    });

    return successResponse(
      res,
      { correo: usuario.correo },
      200,
      null,
      null,
      "Contraseña actualizada correctamente"
    );
  } catch (error) {
    return errorResponse(res, "Error al restablecer la contraseña", 500, [
      {
        code: "RESET_PASSWORD_ERROR",
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
