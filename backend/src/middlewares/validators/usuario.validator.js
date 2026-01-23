import { body } from 'express-validator';
import { Usuario, Rol } from '../../models/index.js';
import { Op } from 'sequelize';

// Expresiones regulares
const onlyNumbers = /^[0-9]+$/;
const onlyLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

export const registerUserValidator = [
  body("documento")
    .trim()
    .notEmpty().withMessage("El documento es requerido.")
    .isLength({ min: 5, max: 20 }).withMessage("El documento debe tener entre 5 y 20 caracteres.")
    .matches(onlyNumbers).withMessage("El documento solo debe contener números.")
    .custom(async (documento) => {
      const existingUser = await Usuario.findOne({
        where: { documento },
        attributes: ['id', 'documento']
      });
      if (existingUser) {
        throw new Error("El documento ya está registrado.");
      }
      return true;
    }),
  body("nombre")
    .trim()
    .notEmpty().withMessage("El nombre es requerido.")
    .isLength({ max: 50 }).withMessage("El nombre debe tener máximo 50 caracteres.")
    .matches(onlyLetters).withMessage("El nombre solo debe contener letras."),
  body("apellido")
    .trim()
    .notEmpty().withMessage("El apellido es requerido.")
    .isLength({ max: 50 }).withMessage("El apellido debe tener máximo 50 caracteres.")
    .matches(onlyLetters).withMessage("El apellido solo debe contener letras."),
  body("correo")
    .trim()
    .notEmpty().withMessage("El correo es requerido.")
    .isEmail().withMessage("El correo no es válido.")
    .isLength({ max: 100 }).withMessage("El correo debe tener máximo 100 caracteres.")
    .custom(async (correo) => {
      const existingUser = await Usuario.findOne({
        where: { correo },
        attributes: ['id', 'correo']
      });
      if (existingUser) {
        throw new Error("El correo ya está registrado.");
      }
      return true;
    }),
  body("telefono")
    .optional()
    .trim()
    .isLength({ max: 15 }).withMessage("El teléfono debe tener máximo 15 caracteres.")
    .matches(onlyNumbers).withMessage("El teléfono solo debe contener números."),
  body("rol_id")
    .optional()
    .isInt().withMessage("El rol_id debe ser un número entero.")
    .custom(async (rol_id) => {
      if (rol_id) {
        const rol = await Rol.findByPk(rol_id);
        if (!rol) {
          throw new Error(`El rol con ID "${rol_id}" no existe.`);
        }
      }
      return true;
    }),
];

export const updateUserValidator = [
  body("documento")
    .optional()
    .trim()
    .isLength({ min: 5, max: 20 }).withMessage("El documento debe tener entre 5 y 20 caracteres.")
    .matches(onlyNumbers).withMessage("El documento solo debe contener números.")
    .custom(async (documento, { req }) => {
      const documentoParam = req.params.documento;
      
      // Si es el mismo documento, no validar
      if (documento === documentoParam) {
        return true;
      }
      
      const existingUser = await Usuario.findOne({
        where: { documento },
        attributes: ['id', 'documento']
      });
      if (existingUser) {
        throw new Error("El documento ya está registrado por otro usuario.");
      }
      return true;
    }),
  body("nombre")
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage("El nombre debe tener máximo 50 caracteres.")
    .matches(onlyLetters).withMessage("El nombre solo debe contener letras."),
  body("apellido")
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage("El apellido debe tener máximo 50 caracteres.")
    .matches(onlyLetters).withMessage("El apellido solo debe contener letras."),
  body("correo")
    .optional()
    .trim()
    .isEmail().withMessage("El correo no es válido.")
    .isLength({ max: 100 }).withMessage("El correo debe tener máximo 100 caracteres.")
    .custom(async (correo, { req }) => {
      const documentoParam = req.params.documento;
      const usuario = await Usuario.findOne({
        where: { documento: documentoParam }
      });
      
      // Si es el mismo correo, no validar
      if (usuario && correo === usuario.correo) {
        return true;
      }
      
      const existingUser = await Usuario.findOne({
        where: { 
          correo,
          documento: { [Op.ne]: documentoParam }
        },
        attributes: ['id', 'correo']
      });
      if (existingUser) {
        throw new Error("El correo ya está registrado por otro usuario.");
      }
      return true;
    }),
  body("telefono")
    .optional()
    .trim()
    .isLength({ max: 15 }).withMessage("El teléfono debe tener máximo 15 caracteres.")
    .matches(onlyNumbers).withMessage("El teléfono solo debe contener números."),
  body("rol_id")
    .optional()
    .isInt().withMessage("El rol_id debe ser un número entero.")
    .custom(async (rol_id) => {
      if (rol_id) {
        const rol = await Rol.findByPk(rol_id);
        if (!rol) {
          throw new Error(`El rol con ID "${rol_id}" no existe.`);
        }
      }
      return true;
    }),
];
