import express from 'express';
import db from '../models/index.js';

const router = express.Router();

/**
 * Rutas públicas para la web del hotel
 * Estas rutas NO requieren autenticación
 */

// Obtener información general del hotel
router.get('/hotel-info', (req, res) => {
  res.json({
    success: true,
    data: {
      nombre: 'Glamping Hotel',
      descripcion: 'Experimenta la naturaleza con el confort de un hotel de lujo',
      direccion: 'Dirección del Hotel, Ciudad, País',
      telefono: '+57 123 456 7890',
      email: 'info@glampinghotel.com',
      horarioCheckin: '15:00',
      horarioCheckout: '12:00',
    }
  });
});

// Obtener hospedajes disponibles (públicos) - SIN AUTENTICACIÓN
router.get('/hospedajes', async (req, res) => {
  try {
    const { tipoHospedajeId, precioMin, precioMax, capacidad, page = 1, limit = 9 } = req.query;
    
    const where = { estado: 'disponible' }; // Solo mostrar disponibles
    
    if (tipoHospedajeId) where.tipo_hospedaje_id = tipoHospedajeId;
    if (precioMin) where.precio = { ...where.precio, [db.Sequelize.Op.gte]: precioMin };
    if (precioMax) where.precio = { ...where.precio, [db.Sequelize.Op.lte]: precioMax };
    if (capacidad) where.capacidad = { [db.Sequelize.Op.gte]: capacidad };
    
    const offset = (page - 1) * limit;
    
    const { count, rows } = await db.Hospedaje.findAndCountAll({
      where,
      include: [{
        model: db.TipoHospedaje,
        as: 'TipoHospedaje',
        attributes: ['id', 'nombre', 'descripcion']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['precio', 'ASC']]
    });
    
    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los hospedajes',
      error: error.message
    });
  }
});

// Obtener detalle de un hospedaje específico (público) - SIN AUTENTICACIÓN
router.get('/hospedajes/:id', async (req, res) => {
  try {
    const hospedaje = await db.Hospedaje.findByPk(req.params.id, {
      include: [{
        model: db.TipoHospedaje,
        as: 'TipoHospedaje',
        attributes: ['id', 'nombre', 'descripcion']
      }]
    });
    
    if (!hospedaje) {
      return res.status(404).json({
        success: false,
        message: 'Hospedaje no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: hospedaje
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el hospedaje',
      error: error.message
    });
  }
});

// Obtener tipos de hospedaje disponibles - SIN AUTENTICACIÓN
router.get('/tipos-hospedaje', async (req, res) => {
  try {
    const tipos = await db.TipoHospedaje.findAll({
      attributes: ['id', 'nombre', 'descripcion']
    });
    
    res.json({
      success: true,
      data: tipos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los tipos de hospedaje',
      error: error.message
    });
  }
});

// Verificar disponibilidad de un hospedaje
router.post('/check-availability', async (req, res) => {
  try {
    const { hospedajeId, fechaInicio, fechaFin } = req.body;
    
    // Aquí puedes implementar la lógica de verificación de disponibilidad
    // Por ahora, retornamos un ejemplo básico
    
    res.json({
      success: true,
      data: {
        disponible: true,
        hospedajeId,
        fechaInicio,
        fechaFin,
        precioTotal: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al verificar disponibilidad',
      error: error.message
    });
  }
});

export default router;
