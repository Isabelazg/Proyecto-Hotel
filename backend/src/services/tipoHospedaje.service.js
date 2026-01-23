import { TipoHospedaje } from '../models/index.js';
import { Op } from 'sequelize';
import { buildPagination } from '../utils/buildPagination.util.js';

export const getTiposHospedajeService = async (req) => {
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

  const { rows, count } = await TipoHospedaje.findAndCountAll(queryOptions);

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

export const showTipoHospedajeService = async (id) => {
  return await TipoHospedaje.findByPk(id);
};

export const createTipoHospedajeService = async (data) => {
  try {
    const tipoHospedaje = await TipoHospedaje.create({ nombre: data.nombre, descripcion: data.descripcion || null });
    return tipoHospedaje;
  } catch (error) {
    throw new Error(`Error al crear tipo de hospedaje: ${error.message}`);
  }
};

export const updateTipoHospedajeService = async (id, data) => {
  try {
    const tipoHospedaje = await TipoHospedaje.findByPk(id);
    if (!tipoHospedaje) {
      throw new Error('Tipo de hospedaje no encontrado');
    }
    await tipoHospedaje.update({
      nombre: data.nombre !== undefined ? data.nombre : tipoHospedaje.nombre,
      descripcion: data.descripcion !== undefined ? data.descripcion : tipoHospedaje.descripcion,
    });
    return tipoHospedaje;
  } catch (error) {
    throw new Error(`Error al actualizar tipo de hospedaje: ${error.message}`);
  }
};

export const deleteTipoHospedajeService = async (id) => {
  try {
    const tipoHospedaje = await TipoHospedaje.findByPk(id);
    if (!tipoHospedaje) {
      throw new Error('Tipo de hospedaje no encontrado');
    }
    await tipoHospedaje.destroy();
    return tipoHospedaje;
  } catch (error) {
    throw new Error(`Error al eliminar tipo de hospedaje: ${error.message}`);
  }
};
