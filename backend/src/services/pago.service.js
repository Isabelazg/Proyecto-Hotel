import { Pago, Reserva, Usuario } from '../models/index.js';
import { Op } from 'sequelize';
import { buildPagination } from '../utils/buildPagination.util.js';

/**
 * Calcula el total pagado de una reserva
 */
const calcularTotalPagado = async (reserva_id, pagoIdExcluir = null) => {
  const whereClause = { reserva_id };
  if (pagoIdExcluir) {
    whereClause.id = { [Op.ne]: pagoIdExcluir };
  }

  const pagos = await Pago.findAll({
    where: whereClause,
    attributes: ['valor'],
  });

  const totalPagado = pagos.reduce((sum, pago) => {
    return sum + parseFloat(pago.valor || 0);
  }, 0);

  return totalPagado;
};

/**
 * Valida que el pago no exceda el valor pendiente de la reserva
 */
const validarPagoNoExcedaTotal = async (reserva_id, valorPago, pagoIdActual = null) => {
  // Obtener la reserva
  const reserva = await Reserva.findByPk(reserva_id, {
    attributes: ['id', 'numero_reserva', 'valor'],
  });

  if (!reserva) {
    throw new Error('La reserva especificada no existe');
  }

  if (!reserva.valor || reserva.valor <= 0) {
    throw new Error('La reserva no tiene un valor definido o es inválido');
  }

  // Calcular total ya pagado (excluyendo el pago actual si es actualización)
  const totalPagado = await calcularTotalPagado(reserva_id, pagoIdActual);

  // Calcular nuevo total con el pago propuesto
  const nuevoTotal = totalPagado + parseFloat(valorPago);

  // Validar que no exceda el valor de la reserva
  if (nuevoTotal > parseFloat(reserva.valor)) {
    const pendiente = parseFloat(reserva.valor) - totalPagado;
    throw new Error(
      `El pago excede el valor de la reserva. Valor reserva: $${reserva.valor}, Ya pagado: $${totalPagado.toFixed(2)}, Pendiente: $${pendiente.toFixed(2)}, Intento de pago: $${valorPago}`
    );
  }

  return {
    valorReserva: parseFloat(reserva.valor),
    totalPagado,
    pendiente: parseFloat(reserva.valor) - nuevoTotal,
    nuevoTotal,
  };
};

export const getPagosService = async (req) => {
  const {
    id,
    reserva_id,
    usuario_id,
    valor_min,
    valor_max,
    search,
    sortBy = 'id',
    order = 'DESC',
    page = 1,
    limit = 10
  } = req.query;

  const where = {};
  if (id) where.id = id;
  if (reserva_id) where.reserva_id = reserva_id;
  if (usuario_id) where.usuario_id = usuario_id;
  if (valor_min) where.valor = { [Op.gte]: valor_min };
  if (valor_max) where.valor = { ...where.valor, [Op.lte]: valor_max };

  const allowedSort = ['id', 'valor'];
  const orderBy = allowedSort.includes(sortBy) ? sortBy : 'id';
  const orderDirection = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const include = [
    {
      model: Reserva,
      as: 'reserva',
      attributes: ['id', 'numero_reserva', 'valor', 'estado'],
    },
    {
      model: Usuario,
      as: 'usuario',
      attributes: ['id', 'nombre', 'apellido', 'correo'],
    },
  ];

  const queryOptions = { where, order: [[orderBy, orderDirection]], include };

  const offset = (parseInt(page) - 1) * parseInt(limit);
  queryOptions.limit = parseInt(limit);
  queryOptions.offset = offset;

  const { rows, count } = await Pago.findAndCountAll(queryOptions);

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

export const showPagoService = async (id) => {
  return await Pago.findByPk(id, {
    include: [
      {
        model: Reserva,
        as: 'reserva',
        attributes: ['id', 'numero_reserva', 'valor', 'estado'],
      },
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombre', 'apellido', 'correo'],
      },
    ],
  });
};

export const createPagoService = async (data) => {
  try {
    // Validar que el pago no exceda el valor de la reserva
    const infoValidacion = await validarPagoNoExcedaTotal(data.reserva_id, data.valor);

    // Crear el pago
    const pago = await Pago.create({
      reserva_id: data.reserva_id,
      usuario_id: data.usuario_id || null,
      valor: data.valor,
    });

    // Recargar con relaciones
    await pago.reload({
      include: [
        {
          model: Reserva,
          as: 'reserva',
          attributes: ['id', 'numero_reserva', 'valor', 'estado'],
        },
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido', 'correo'],
        },
      ],
    });

    return { pago, infoValidacion };
  } catch (error) {
    throw new Error(`Error al crear pago: ${error.message}`);
  }
};

export const updatePagoService = async (id, data) => {
  try {
    const pago = await Pago.findByPk(id);
    if (!pago) {
      throw new Error('Pago no encontrado');
    }

    const nuevoValor = data.valor !== undefined ? data.valor : pago.valor;
    const nuevaReservaId = data.reserva_id !== undefined ? data.reserva_id : pago.reserva_id;

    // Validar que el nuevo valor no exceda el total (excluyendo este pago)
    const infoValidacion = await validarPagoNoExcedaTotal(nuevaReservaId, nuevoValor, id);

    // Actualizar el pago
    await pago.update({
      reserva_id: data.reserva_id !== undefined ? data.reserva_id : pago.reserva_id,
      usuario_id: data.usuario_id !== undefined ? data.usuario_id : pago.usuario_id,
      valor: data.valor !== undefined ? data.valor : pago.valor,
    });

    // Recargar con relaciones
    await pago.reload({
      include: [
        {
          model: Reserva,
          as: 'reserva',
          attributes: ['id', 'numero_reserva', 'valor', 'estado'],
        },
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido', 'correo'],
        },
      ],
    });

    return { pago, infoValidacion };
  } catch (error) {
    throw new Error(`Error al actualizar pago: ${error.message}`);
  }
};

export const deletePagoService = async (id) => {
  try {
    const pago = await Pago.findByPk(id);
    if (!pago) {
      throw new Error('Pago no encontrado');
    }
    await pago.destroy();
    return pago;
  } catch (error) {
    throw new Error(`Error al eliminar pago: ${error.message}`);
  }
};

export const getEstadoPagosReservaService = async (reserva_id) => {
  try {
    const reserva = await Reserva.findByPk(reserva_id, {
      attributes: ['id', 'numero_reserva', 'valor'],
    });

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    const totalPagado = await calcularTotalPagado(reserva_id);
    const valorReserva = parseFloat(reserva.valor || 0);
    const pendiente = valorReserva - totalPagado;
    const porcentajePagado = valorReserva > 0 ? (totalPagado / valorReserva) * 100 : 0;

    return {
      reserva_id: reserva.id,
      numero_reserva: reserva.numero_reserva,
      valor_total: valorReserva,
      total_pagado: totalPagado,
      pendiente,
      porcentaje_pagado: porcentajePagado.toFixed(2),
      completamente_pagado: pendiente <= 0,
    };
  } catch (error) {
    throw new Error(`Error al obtener estado de pagos: ${error.message}`);
  }
};
