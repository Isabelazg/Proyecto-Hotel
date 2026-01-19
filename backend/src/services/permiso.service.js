import { Permiso } from '../models/index.js';
import { Op } from 'sequelize';
import { buildPagination } from '../utils/buildPagination.util.js';

export const getPermisosService = async (req) => {
  const { id, nombre, descripcion, search, sortBy = 'id', order = 'ASC', page = 1, limit = 10 } = req.query;

  const where = {};
  if (id) where.id = id;
  if (nombre) where.nombre = { [Op.like]: `%${nombre}%` };
  if (descripcion) where.descripcion = { [Op.like]: `%${descripcion}%` };

  if (search) {
    where[Op.or] = [
      { nombre: { [Op.like]: `%${search}%` } },
      { descripcion: { [Op.like]: `%${search}%` } },
    ];
  }

  const allowedSort = ['id', 'nombre'];
  const orderBy = allowedSort.includes(sortBy) ? sortBy : 'id';
  const orderDirection = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const queryOptions = {
    where,
    order: [[orderBy, orderDirection]],
  };

  const offset = (parseInt(page) - 1) * parseInt(limit);
  queryOptions.limit = parseInt(limit);
  queryOptions.offset = offset;

  const { rows, count } = await Permiso.findAndCountAll(queryOptions);

  const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
  const queryWithoutPage = Object.entries({ ...req.query, page: undefined })
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${v}`)
    .join('&');

  const { meta, links } = buildPagination({
    total: count,
    page: parseInt(page),
    limit: parseInt(limit),
    baseUrl,
    queryWithoutPage,
  });

  return { data: rows, count, meta, links };
};

export const showPermisoService = async (id) => {
  return await Permiso.findByPk(id);
};

export const createPermisoService = async (data) => {
  try {
    const permiso = await Permiso.create({ nombre: data.nombre, descripcion: data.descripcion || null });
    return permiso;
  } catch (error) {
    throw new Error(`Error al crear permiso: ${error.message}`);
  }
};

export const updatePermisoService = async (id, data) => {
  try {
    const permiso = await Permiso.findByPk(id);
    if (!permiso) {
      throw new Error('Permiso no encontrado');
    }
    await permiso.update({
      nombre: data.nombre !== undefined ? data.nombre : permiso.nombre,
      descripcion: data.descripcion !== undefined ? data.descripcion : permiso.descripcion,
    });
    return permiso;
  } catch (error) {
    throw new Error(`Error al actualizar permiso: ${error.message}`);
  }
};

export const deletePermisoService = async (id) => {
  try {
    const permiso = await Permiso.findByPk(id);
    if (!permiso) {
      throw new Error('Permiso no encontrado');
    }
    await permiso.destroy();
    return permiso;
  } catch (error) {
    throw new Error(`Error al eliminar permiso: ${error.message}`);
  }
};
