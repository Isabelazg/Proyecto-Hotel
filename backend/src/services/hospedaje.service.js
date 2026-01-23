import { Hospedaje, TipoHospedaje } from '../models/index.js';
import { Op } from 'sequelize';
import { buildPagination } from '../utils/buildPagination.util.js';

export const getHospedajesService = async (req) => {
  const {
    id,
    nombre,
    tipo_hospedaje_id,
    tipo_nombre,
    precio_min,
    precio_max,
    estado,
    search,
    sortBy = 'id',
    order = 'ASC',
    page = 1,
    limit = 10
  } = req.query;

  const where = {};
  if (id) where.id = id;
  if (nombre) where.nombre = { [Op.like]: `%${nombre}%` };
  if (tipo_hospedaje_id) where.tipo_hospedaje_id = tipo_hospedaje_id;
  if (precio_min) where.precio = { [Op.gte]: precio_min };
  if (precio_max) where.precio = { ...where.precio, [Op.lte]: precio_max };
  if (estado !== undefined) where.estado = estado === 'true' || estado === true;

  if (search) {
    where[Op.or] = [
      { nombre: { [Op.like]: `%${search}%` } },
    ];
  }

  const allowedSort = ['id', 'nombre', 'precio', 'estado'];
  const orderBy = allowedSort.includes(sortBy) ? sortBy : 'id';
  const orderDirection = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const include = [
    {
      model: TipoHospedaje,
      as: 'tipo_hospedaje',
      attributes: ['id', 'nombre', 'descripcion'],
      where: tipo_nombre ? { nombre: { [Op.like]: `%${tipo_nombre}%` } } : undefined,
      required: !!tipo_nombre,
    },
  ];

  const queryOptions = { where, order: [[orderBy, orderDirection]], include };

  const offset = (parseInt(page) - 1) * parseInt(limit);
  queryOptions.limit = parseInt(limit);
  queryOptions.offset = offset;

  const { rows, count } = await Hospedaje.findAndCountAll(queryOptions);

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

export const showHospedajeService = async (id) => {
  return await Hospedaje.findByPk(id, {
    include: [{ model: TipoHospedaje, as: 'tipo_hospedaje', attributes: ['id', 'nombre', 'descripcion'] }],
  });
};

export const createHospedajeService = async (data) => {
  try {
    const hospedaje = await Hospedaje.create({
      nombre: data.nombre,
      tipo_hospedaje_id: data.tipo_hospedaje_id || null,
      precio: data.precio || null,
      estado: data.estado !== undefined ? data.estado : true,
    });

    await hospedaje.reload({
      include: [{ model: TipoHospedaje, as: 'tipo_hospedaje', attributes: ['id', 'nombre', 'descripcion'] }],
    });

    return hospedaje;
  } catch (error) {
    throw new Error(`Error al crear hospedaje: ${error.message}`);
  }
};

export const updateHospedajeService = async (id, data) => {
  try {
    const hospedaje = await Hospedaje.findByPk(id);
    if (!hospedaje) {
      throw new Error('Hospedaje no encontrado');
    }

    await hospedaje.update({
      nombre: data.nombre !== undefined ? data.nombre : hospedaje.nombre,
      tipo_hospedaje_id: data.tipo_hospedaje_id !== undefined ? data.tipo_hospedaje_id : hospedaje.tipo_hospedaje_id,
      precio: data.precio !== undefined ? data.precio : hospedaje.precio,
      estado: data.estado !== undefined ? data.estado : hospedaje.estado,
    });

    await hospedaje.reload({
      include: [{ model: TipoHospedaje, as: 'tipo_hospedaje', attributes: ['id', 'nombre', 'descripcion'] }],
    });

    return hospedaje;
  } catch (error) {
    throw new Error(`Error al actualizar hospedaje: ${error.message}`);
  }
};

export const updateHospedajeEstadoService = async (id, estado) => {
  try {
    const hospedaje = await Hospedaje.findByPk(id);
    if (!hospedaje) {
      throw new Error('Hospedaje no encontrado');
    }

    await hospedaje.update({ estado });

    await hospedaje.reload({
      include: [{ model: TipoHospedaje, as: 'tipo_hospedaje', attributes: ['id', 'nombre', 'descripcion'] }],
    });

    return hospedaje;
  } catch (error) {
    throw new Error(`Error al actualizar estado del hospedaje: ${error.message}`);
  }
};

export const deleteHospedajeService = async (id) => {
  try {
    const hospedaje = await Hospedaje.findByPk(id);
    if (!hospedaje) {
      throw new Error('Hospedaje no encontrado');
    }
    await hospedaje.destroy();
    return hospedaje;
  } catch (error) {
    throw new Error(`Error al eliminar hospedaje: ${error.message}`);
  }
};
