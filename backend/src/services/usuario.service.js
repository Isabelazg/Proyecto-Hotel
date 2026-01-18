import { Usuario, Rol } from '../models/index.js';
import { Op } from 'sequelize';
import { buildPagination } from '../utils/buildPagination.util.js';

/**
 * Obtiene usuarios con filtros y paginación (sin usar repository).
 */
export const getUsersService = async (req) => {
  const {
    id,
    documento,
    nombre,
    apellido,
    correo,
    telefono,
    rol_nombre,
    search,
    sortBy = "id",
    order = "ASC",
    page = 1,
    limit = 10
  } = req.query;

  // Construir cláusula where
  const where = {};
  if (id) where.id = id;
  if (documento) where.documento = { [Op.like]: `%${documento}%` };
  if (nombre) where.nombre = { [Op.like]: `%${nombre}%` };
  if (apellido) where.apellido = { [Op.like]: `%${apellido}%` };
  if (correo) where.correo = { [Op.like]: `%${correo}%` };
  if (telefono) where.telefono = { [Op.like]: `%${telefono}%` };

  // Búsqueda general
  if (search) {
    where[Op.or] = [
      { documento: { [Op.like]: `%${search}%` } },
      { nombre: { [Op.like]: `%${search}%` } },
      { apellido: { [Op.like]: `%${search}%` } },
      { correo: { [Op.like]: `%${search}%` } },
      { telefono: { [Op.like]: `%${search}%` } }
    ];
  }

  // Validar campo de ordenamiento
  const allowedSort = [
    "id", "documento", "nombre", "apellido", "correo", "telefono"
  ];
  const orderBy = allowedSort.includes(sortBy) ? sortBy : "id";
  const orderDirection = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  // Construir include para el rol
  let include = [
    {
      model: Rol,
      as: 'rol',
      attributes: ['id', 'nombre'],
      where: rol_nombre
        ? { nombre: { [Op.like]: `%${rol_nombre}%` } }
        : undefined
    }
  ];

  // Configurar opciones de consulta
  const queryOptions = {
    where,
    order: [[orderBy, orderDirection]],
    include
  };

  // Configurar paginación
  const offset = (parseInt(page) - 1) * parseInt(limit);
  queryOptions.limit = parseInt(limit);
  queryOptions.offset = offset;

  // Ejecutar consulta
  const { rows, count } = await Usuario.findAndCountAll(queryOptions);

  // Construir URL base para los enlaces de paginación
  const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;

  // Construir query string sin el parámetro page para enlaces de paginación
  const queryWithoutPage = Object.entries({ ...req.query, page: undefined })
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  // Generar metadatos y enlaces de paginación
  const { meta, links } = buildPagination({
    total: count,
    page: parseInt(page),
    limit: parseInt(limit),
    baseUrl,
    queryWithoutPage,
  });

  return {
    data: rows,
    count,
    meta,
    links
  };
};

/**
 * Busca y retorna un usuario por su ID.
 */
export const showUserService = async (id) => {
  return await Usuario.findByPk(id, {
    include: [
      {
        model: Rol,
        as: 'rol',
        attributes: ['id', 'nombre']
      }
    ]
  });
};

/**
 * Crea un nuevo usuario.
 */
export const createUserService = async (userData) => {
  try {
    // Crear el usuario
    const user = await Usuario.create({
      documento: userData.documento,
      nombre: userData.nombre,
      apellido: userData.apellido,
      correo: userData.correo,
      telefono: userData.telefono,
      contrasena: userData.contrasena || null,
      rol_id: userData.rol_id || null
    });

    // Recargar el usuario con su rol
    await user.reload({
      include: [{
        model: Rol,
        as: 'rol',
        attributes: ['id', 'nombre']
      }]
    });

    return user;
  } catch (error) {
    throw new Error(`Error al crear usuario: ${error.message}`);
  }
};

/**
 * Actualiza los datos de un usuario buscando por documento.
 */
export const updateUserService = async (documento, userData) => {
  try {
    // Buscar el usuario por documento
    const user = await Usuario.findOne({
      where: { documento }
    });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Actualizar los datos del usuario
    await user.update({
      documento: userData.documento !== undefined ? userData.documento : user.documento,
      nombre: userData.nombre !== undefined ? userData.nombre : user.nombre,
      apellido: userData.apellido !== undefined ? userData.apellido : user.apellido,
      correo: userData.correo !== undefined ? userData.correo : user.correo,
      telefono: userData.telefono !== undefined ? userData.telefono : user.telefono,
      contrasena: userData.contrasena !== undefined ? userData.contrasena : user.contrasena,
      rol_id: userData.rol_id !== undefined ? userData.rol_id : user.rol_id
    });

    // Recargar el usuario con todas sus relaciones para devolver datos completos
    await user.reload({
      include: [
        { model: Rol, as: 'rol', attributes: ['id', 'nombre'] }
      ]
    });

    return user;
  } catch (error) {
    throw new Error(`Error al actualizar usuario: ${error.message}`);
  }
};

/**
 * Elimina un usuario por su ID.
 */
export const deleteUserService = async (id) => {
  try {
    // Buscar el usuario por ID
    const user = await Usuario.findByPk(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Eliminar el usuario
    await user.destroy();

    return user;
  } catch (error) {
    throw new Error(`Error al eliminar usuario: ${error.message}`);
  }
};
