import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Notificacion = sequelize.define(
  'Notificacion',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    tipo: {
      type: DataTypes.ENUM('reserva_creada', 'reserva_iniciada', 'reserva_terminada', 'pago_recibido', 'general'),
      allowNull: false,
      defaultValue: 'general',
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    leida: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    relacionado_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID de la entidad relacionada (reserva, pago, etc.)',
    },
    relacionado_tipo: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Tipo de entidad relacionada (reserva, pago, etc.)',
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'notificaciones',
    timestamps: false,
  }
);

export default Notificacion;
