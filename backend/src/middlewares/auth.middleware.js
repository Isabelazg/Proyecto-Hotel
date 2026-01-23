import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { successResponse, errorResponse } from "../utils/response.util.js";

dotenv.config();

/**
 * Middleware para verificar el token JWT
 */
export const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return errorResponse(res, "No se proporcionó un token", 401);
  }

  // Soporta formato "Bearer <token>" o solo "<token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return errorResponse(res, "Token inválido o expirado", 403);
    }
    req.usuario = decoded;
    next();
  });
};

/**
 * Middleware para verificar si el usuario tiene un rol específico
 */
export const verificarRol = (rolesPermitidos = []) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return errorResponse(res, "Usuario no autenticado", 401);
    }

    const tieneRol = rolesPermitidos.length === 0 || rolesPermitidos.includes(req.usuario.rol);
    
    if (!tieneRol) {
      return errorResponse(res, "Acceso denegado. No tienes permisos suficientes", 403);
    }

    next();
  };
};
