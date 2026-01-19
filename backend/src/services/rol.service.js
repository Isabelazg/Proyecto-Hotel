import { Rol, Permiso } from '../models/index.js';
import { Op } from 'sequelize';
import { buildPagination } from '../utils/buildPagination.util.js';

export const getRolesService = async (req) => {
  const { id, nombre, descripcion, search, permiso_nombre, sortBy = 'id', order = 'ASC', page = 1, limit = 10 } = req.query;

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

  const include = [
    {
      model: Permiso,
      as: 'permisos',
      attributes: ['id', 'nombre', 'descripcion'],
      through: { attributes: [] },
      where: permiso_nombre ? { nombre: { [Op.like]: `%${permiso_nombre}%` } } : undefined,
      required: !!permiso_nombre,
    },
  ];

  const queryOptions = { where, order: [[orderBy, orderDirection]], include };

  const offset = (parseInt(page) - 1) * parseInt(limit);
  queryOptions.limit = parseInt(limit);
  queryOptions.offset = offset;

  const { rows, count } = await Rol.findAndCountAll(queryOptions);

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

export const showRolService = async (id) => {
  return await Rol.findByPk(id, {
    include: [{ model: Permiso, as: 'permisos', attributes: ['id', 'nombre', 'descripcion'], through: { attributes: [] } }],
  });
};

export const createRolService = async (data) => {
  try {
    const rol = await Rol.create({ nombre: data.nombre, descripcion: data.descripcion || null });

    if (Array.isArray(data.permisos) && data.permisos.length) {
      const permisos = await Permiso.findAll({ where: { id: { [Op.in]: data.permisos } } });
      await rol.setPermisos(permisos);
    }

    await rol.reload({ include: [{ model: Permiso, as: 'permisos', attributes: ['id', 'nombre', 'descripcion'], through: { attributes: [] } }] });
    return rol;
  } catch (error) {
    throw new Error(`Error al crear rol: ${error.message}`);
  }
};

export const updateRolService = async (id, data) => {
  try {
    const rol = await Rol.findByPk(id);
    if (!rol) {
      throw new Error('Rol no encontrado');
    }

    await rol.update({
      nombre: data.nombre !== undefined ? data.nombre : rol.nombre,
      descripcion: data.descripcion !== undefined ? data.descripcion : rol.descripcion,
    });

    if (Array.isArray(data.permisos)) {
      const permisos = await Permiso.findAll({ where: { id: { [Op.in]: data.permisos } } });
      await rol.setPermisos(permisos);
    }

    await rol.reload({ include: [{ model: Permiso, as: 'permisos', attributes: ['id', 'nombre', 'descripcion'], through: { attributes: [] } }] });
    return rol;
  } catch (error) {
    throw new Error(`Error al actualizar rol: ${error.message}`);
  }
};

export const deleteRolService = async (id) => {
  try {
    const rol = await Rol.findByPk(id);
    if (!rol) {
      throw new Error('Rol no encontrado');
    }
    await rol.destroy();
    return rol;
  } catch (error) {
    throw new Error(`Error al eliminar rol: ${error.message}`);
  }
};
