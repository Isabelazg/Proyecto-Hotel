import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Reserva = sequelize.define(
  'Reserva',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    numero_reserva: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'en_ejecucion', 'terminada'),
      allowNull: false,
      defaultValue: 'pendiente',
    },
    hospedaje_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hospedajes',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    fecha_ingreso_hora: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fecha_salida_hora: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    numero_huespedes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nombre_huesped: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    apellido_huesped: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    documento_huesped: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    telefono_huesped: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    email_huesped: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    notas: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    valor: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
  },
  {
    tableName: 'reservas',
    timestamps: false,
  }
);

export default Reserva;
