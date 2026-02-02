import { Reserva, Hospedaje, TipoHospedaje, Usuario } from '../models/index.js';
import { Op } from 'sequelize';
import { buildPagination } from '../utils/buildPagination.util.js';
import { createNotificationsForUsers } from './notificacion.service.js';

/**
 * Genera un número de reserva único
 */
const generarNumeroReserva = async () => {
  const prefix = 'RES';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const numeroReserva = `${prefix}${timestamp}${random}`;
  
  // Verificar que no exista
  const existe = await Reserva.findOne({ where: { numero_reserva: numeroReserva } });
  if (existe) {
    return generarNumeroReserva(); // Reintentar recursivamente
  }
  
  return numeroReserva;
};

/**
 * Valida que no existan reservas con solapamiento de fechas para el mismo hospedaje
 */
const validarSolapamientoFechas = async (hospedaje_id, fecha_ingreso, fecha_salida, reservaIdActual = null) => {
  if (!fecha_ingreso || !fecha_salida) {
    return; // Si no hay fechas, no validar
  }

  const fechaIngresoDate = new Date(fecha_ingreso);
  const fechaSalidaDate = new Date(fecha_salida);

  // Buscar reservas activas (pendiente o en_ejecucion) del mismo hospedaje
  const whereClause = {
    hospedaje_id,
    estado: { [Op.in]: ['pendiente', 'en_ejecucion'] },
    [Op.or]: [
      // Caso 1: La nueva fecha de ingreso cae dentro de una reserva existente
      {
        fecha_ingreso_hora: { [Op.lte]: fechaIngresoDate },
        fecha_salida_hora: { [Op.gt]: fechaIngresoDate },
      },
      // Caso 2: La nueva fecha de salida cae dentro de una reserva existente
      {
        fecha_ingreso_hora: { [Op.lt]: fechaSalidaDate },
        fecha_salida_hora: { [Op.gte]: fechaSalidaDate },
      },
      // Caso 3: La nueva reserva abarca completamente una reserva existente
      {
        fecha_ingreso_hora: { [Op.gte]: fechaIngresoDate },
        fecha_salida_hora: { [Op.lte]: fechaSalidaDate },
      },
    ],
  };

  // Si es una actualización, excluir la reserva actual
  if (reservaIdActual) {
    whereClause.id = { [Op.ne]: reservaIdActual };
  }

  const reservasSuperpuestas = await Reserva.findAll({
    where: whereClause,
    attributes: ['id', 'numero_reserva', 'fecha_ingreso_hora', 'fecha_salida_hora', 'estado'],
  });

  if (reservasSuperpuestas.length > 0) {
    const detalles = reservasSuperpuestas.map(r => 
      `Reserva ${r.numero_reserva} del ${new Date(r.fecha_ingreso_hora).toLocaleDateString()} al ${new Date(r.fecha_salida_hora).toLocaleDateString()}`
    ).join(', ');
    throw new Error(`El hospedaje ya está reservado en las fechas seleccionadas. Conflictos: ${detalles}`);
  }
};

export const getReservasService = async (req) => {
  const {
    id,
    numero_reserva,
    estado,
    hospedaje_id,
    hospedaje_nombre,
    fecha_ingreso_desde,
    fecha_ingreso_hasta,
    fecha_salida_desde,
    fecha_salida_hasta,
    search,
    sortBy = 'id',
    order = 'ASC',
    page = 1,
    limit = 10
  } = req.query;

  const where = {};
  if (id) where.id = id;
  if (numero_reserva) where.numero_reserva = { [Op.like]: `%${numero_reserva}%` };
  if (estado !== undefined) where.estado = estado;
  if (hospedaje_id) where.hospedaje_id = hospedaje_id;
  if (fecha_ingreso_desde) where.fecha_ingreso_hora = { [Op.gte]: new Date(fecha_ingreso_desde) };
  if (fecha_ingreso_hasta) where.fecha_ingreso_hora = { ...where.fecha_ingreso_hora, [Op.lte]: new Date(fecha_ingreso_hasta) };
  if (fecha_salida_desde) where.fecha_salida_hora = { [Op.gte]: new Date(fecha_salida_desde) };
  if (fecha_salida_hasta) where.fecha_salida_hora = { ...where.fecha_salida_hora, [Op.lte]: new Date(fecha_salida_hasta) };

  if (search) {
    where[Op.or] = [
      { numero_reserva: { [Op.like]: `%${search}%` } },
      { notas: { [Op.like]: `%${search}%` } },
    ];
  }

  const allowedSort = ['id', 'numero_reserva', 'fecha_ingreso_hora', 'fecha_salida_hora', 'valor', 'estado'];
  const orderBy = allowedSort.includes(sortBy) ? sortBy : 'id';
  const orderDirection = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const include = [
    {
      model: Hospedaje,
      as: 'hospedaje',
      attributes: ['id', 'nombre', 'precio', 'estado'],
      include: [
        {
          model: TipoHospedaje,
          as: 'tipo_hospedaje',
          attributes: ['id', 'nombre'],
        }
      ],
      where: hospedaje_nombre ? { nombre: { [Op.like]: `%${hospedaje_nombre}%` } } : undefined,
      required: !!hospedaje_nombre,
    },
  ];

  const queryOptions = { where, order: [[orderBy, orderDirection]], include };

  const offset = (parseInt(page) - 1) * parseInt(limit);
  queryOptions.limit = parseInt(limit);
  queryOptions.offset = offset;

  const { rows, count } = await Reserva.findAndCountAll(queryOptions);

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

export const showReservaService = async (id) => {
  return await Reserva.findByPk(id, {
    include: [
      {
        model: Hospedaje,
        as: 'hospedaje',
        attributes: ['id', 'nombre', 'precio', 'estado'],
        include: [
          {
            model: TipoHospedaje,
            as: 'tipo_hospedaje',
            attributes: ['id', 'nombre'],
          }
        ],
      }
    ],
  });
};

export const createReservaService = async (data) => {
  try {
    // Validar datos requeridos
    if (!data.hospedaje_id) {
      throw new Error('El hospedaje_id es requerido');
    }

    // Generar número de reserva si no se proporciona
    const numeroReserva = data.numero_reserva || await generarNumeroReserva();

    // Verificar que el hospedaje existe
    const hospedaje = await Hospedaje.findByPk(data.hospedaje_id);
    if (!hospedaje) {
      throw new Error('El hospedaje especificado no existe');
    }

    // Validar solapamiento de fechas
    await validarSolapamientoFechas(data.hospedaje_id, data.fecha_ingreso_hora, data.fecha_salida_hora);

    // Determinar estado inicial (por defecto 'pendiente')
    const estadoInicial = data.estado || 'pendiente';

    // Crear la reserva
    const reserva = await Reserva.create({
      numero_reserva: numeroReserva,
      estado: estadoInicial,
      hospedaje_id: data.hospedaje_id,
      fecha_ingreso_hora: data.fecha_ingreso_hora || null,
      fecha_salida_hora: data.fecha_salida_hora || null,
      numero_huespedes: data.numero_huespedes || null,
      nombre_huesped: data.nombre_huesped || null,
      apellido_huesped: data.apellido_huesped || null,
      documento_huesped: data.documento_huesped || null,
      telefono_huesped: data.telefono_huesped || null,
      email_huesped: data.email_huesped || null,
      notas: data.notas || null,
      valor: data.valor || null,
    });

    // Solo marcar hospedaje como NO DISPONIBLE si la reserva está 'en_ejecucion'
    if (estadoInicial === 'en_ejecucion') {
      await hospedaje.update({ estado: false });
    }

    // Recargar la reserva con relaciones
    await reserva.reload({
      include: [
        {
          model: Hospedaje,
          as: 'hospedaje',
          attributes: ['id', 'nombre', 'precio', 'estado'],
          include: [
            {
              model: TipoHospedaje,
              as: 'tipo_hospedaje',
              attributes: ['id', 'nombre'],
            }
          ],
        }
      ],
    });

    // Crear notificación para todos los usuarios (admins)
    try {
      const usuarios = await Usuario.findAll({
        attributes: ['id'],
      });
      
      const usuariosIds = usuarios.map(u => u.id);
      
      if (usuariosIds.length > 0) {
        await createNotificationsForUsers(usuariosIds, {
          tipo: 'reserva_creada',
          titulo: `Nueva Reserva: ${reserva.numero_reserva}`,
          mensaje: `Se ha creado una nueva reserva para ${reserva.nombre_huesped} ${reserva.apellido_huesped} en ${reserva.hospedaje?.nombre || 'hospedaje'}`,
          relacionado_id: reserva.id,
          relacionado_tipo: 'reserva',
        });
      }
    } catch (notifError) {
      console.error('Error al crear notificaciones:', notifError);
      // No lanzar error para no afectar la creación de la reserva
    }

    return reserva;
  } catch (error) {
    throw new Error(`Error al crear reserva: ${error.message}`);
  }
};

export const updateReservaService = async (id, data) => {
  try {
    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    const hospedajeIdAnterior = reserva.hospedaje_id;
    const estadoAnterior = reserva.estado;

    // Si se cambian fechas o hospedaje, validar solapamiento
    const nuevaFechaIngreso = data.fecha_ingreso_hora !== undefined ? data.fecha_ingreso_hora : reserva.fecha_ingreso_hora;
    const nuevaFechaSalida = data.fecha_salida_hora !== undefined ? data.fecha_salida_hora : reserva.fecha_salida_hora;
    const nuevoHospedajeId = data.hospedaje_id !== undefined ? data.hospedaje_id : hospedajeIdAnterior;

    // Validar solapamiento (excluyendo la reserva actual)
    if (nuevaFechaIngreso && nuevaFechaSalida) {
      await validarSolapamientoFechas(nuevoHospedajeId, nuevaFechaIngreso, nuevaFechaSalida, id);
    }

    // Si se cambia el hospedaje, validar que el nuevo existe
    if (data.hospedaje_id && data.hospedaje_id !== hospedajeIdAnterior) {
      const nuevoHospedaje = await Hospedaje.findByPk(data.hospedaje_id);
      if (!nuevoHospedaje) {
        throw new Error('El nuevo hospedaje especificado no existe');
      }

      // Liberar el hospedaje anterior solo si la reserva estaba 'en_ejecucion'
      if (hospedajeIdAnterior && estadoAnterior === 'en_ejecucion') {
        const hospedajeAnterior = await Hospedaje.findByPk(hospedajeIdAnterior);
        if (hospedajeAnterior) {
          await hospedajeAnterior.update({ estado: true });
        }
      }

      // Ocupar el nuevo hospedaje solo si el estado nuevo es 'en_ejecucion'
      const estadoNuevo = data.estado !== undefined ? data.estado : estadoAnterior;
      if (estadoNuevo === 'en_ejecucion') {
        await nuevoHospedaje.update({ estado: false });
      }
    }

    // Si cambia el estado (sin cambiar hospedaje)
    if (data.estado !== undefined && data.estado !== estadoAnterior && (!data.hospedaje_id || data.hospedaje_id === hospedajeIdAnterior)) {
      const hospedaje = await Hospedaje.findByPk(hospedajeIdAnterior);
      if (hospedaje) {
        if (data.estado === 'en_ejecucion') {
          // Pasar a en_ejecucion: bloquear hospedaje
          await hospedaje.update({ estado: false });
          
          // Crear notificación cuando la reserva inicia
          try {
            const usuarios = await Usuario.findAll({
              attributes: ['id'],
            });
            
            const usuariosIds = usuarios.map(u => u.id);
            
            if (usuariosIds.length > 0) {
              await createNotificationsForUsers(usuariosIds, {
                tipo: 'reserva_iniciada',
                titulo: `Reserva Iniciada: ${reserva.numero_reserva}`,
                mensaje: `La reserva de ${reserva.nombre_huesped} ${reserva.apellido_huesped} ha iniciado en ${hospedaje.nombre}`,
                relacionado_id: reserva.id,
                relacionado_tipo: 'reserva',
              });
            }
          } catch (notifError) {
            console.error('Error al crear notificaciones:', notifError);
          }
        } else if (estadoAnterior === 'en_ejecucion' && (data.estado === 'terminada' || data.estado === 'pendiente')) {
          // Salir de en_ejecucion: liberar hospedaje
          await hospedaje.update({ estado: true });
        }
      }
    }

    // Actualizar la reserva
    await reserva.update({
      numero_reserva: data.numero_reserva !== undefined ? data.numero_reserva : reserva.numero_reserva,
      estado: data.estado !== undefined ? data.estado : reserva.estado,
      hospedaje_id: data.hospedaje_id !== undefined ? data.hospedaje_id : reserva.hospedaje_id,
      fecha_ingreso_hora: data.fecha_ingreso_hora !== undefined ? data.fecha_ingreso_hora : reserva.fecha_ingreso_hora,
      fecha_salida_hora: data.fecha_salida_hora !== undefined ? data.fecha_salida_hora : reserva.fecha_salida_hora,
      numero_huespedes: data.numero_huespedes !== undefined ? data.numero_huespedes : reserva.numero_huespedes,
      nombre_huesped: data.nombre_huesped !== undefined ? data.nombre_huesped : reserva.nombre_huesped,
      apellido_huesped: data.apellido_huesped !== undefined ? data.apellido_huesped : reserva.apellido_huesped,
      documento_huesped: data.documento_huesped !== undefined ? data.documento_huesped : reserva.documento_huesped,
      telefono_huesped: data.telefono_huesped !== undefined ? data.telefono_huesped : reserva.telefono_huesped,
      email_huesped: data.email_huesped !== undefined ? data.email_huesped : reserva.email_huesped,
      notas: data.notas !== undefined ? data.notas : reserva.notas,
      valor: data.valor !== undefined ? data.valor : reserva.valor,
    });

    // Recargar con relaciones
    await reserva.reload({
      include: [
        {
          model: Hospedaje,
          as: 'hospedaje',
          attributes: ['id', 'nombre', 'precio', 'estado'],
          include: [
            {
              model: TipoHospedaje,
              as: 'tipo_hospedaje',
              attributes: ['id', 'nombre'],
            }
          ],
        }
      ],
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error al actualizar reserva: ${error.message}`);
  }
};

export const finalizarReservaService = async (id) => {
  try {
    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    // Marcar reserva como terminada
    await reserva.update({ estado: 'terminada' });

    // Liberar el hospedaje (marcarlo como disponible) solo si estaba en_ejecucion
    if (reserva.hospedaje_id) {
      const hospedaje = await Hospedaje.findByPk(reserva.hospedaje_id);
      if (hospedaje) {
        await hospedaje.update({ estado: true });
      }
    }

    // Recargar con relaciones
    await reserva.reload({
      include: [
        {
          model: Hospedaje,
          as: 'hospedaje',
          attributes: ['id', 'nombre', 'precio', 'estado'],
          include: [
            {
              model: TipoHospedaje,
              as: 'tipo_hospedaje',
              attributes: ['id', 'nombre'],
            }
          ],
        }
      ],
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error al finalizar reserva: ${error.message}`);
  }
};

export const iniciarReservaService = async (id) => {
  try {
    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    if (reserva.estado === 'en_ejecucion') {
      throw new Error('La reserva ya está en ejecución');
    }

    if (reserva.estado === 'terminada') {
      throw new Error('No se puede iniciar una reserva terminada');
    }

    // Marcar reserva como en_ejecucion
    await reserva.update({ estado: 'en_ejecucion' });

    // Bloquear el hospedaje (marcarlo como no disponible)
    if (reserva.hospedaje_id) {
      const hospedaje = await Hospedaje.findByPk(reserva.hospedaje_id);
      if (hospedaje) {
        await hospedaje.update({ estado: false });
      }
    }

    // Recargar con relaciones
    await reserva.reload({
      include: [
        {
          model: Hospedaje,
          as: 'hospedaje',
          attributes: ['id', 'nombre', 'precio', 'estado'],
          include: [
            {
              model: TipoHospedaje,
              as: 'tipo_hospedaje',
              attributes: ['id', 'nombre'],
            }
          ],
        }
      ],
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error al iniciar reserva: ${error.message}`);
  }
};

export const deleteReservaService = async (id) => {
  try {
    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    // Liberar el hospedaje asociado (marcarlo como disponible) si estaba en_ejecucion
    if (reserva.hospedaje_id && reserva.estado === 'en_ejecucion') {
      const hospedaje = await Hospedaje.findByPk(reserva.hospedaje_id);
      if (hospedaje) {
        await hospedaje.update({ estado: true });
      }
    }

    await reserva.destroy();
    return reserva;
  } catch (error) {
    throw new Error(`Error al eliminar reserva: ${error.message}`);
  }
};
