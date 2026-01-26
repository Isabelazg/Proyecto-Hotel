import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Hospedaje = sequelize.define(
  'Hospedaje',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tipo_hospedaje_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tipo_hospedajes',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    precio: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 2,
    },
    estado: {
      type: DataTypes.ENUM('disponible', 'ocupado', 'mantenimiento'),
      allowNull: true,
      defaultValue: 'disponible',
    },
  },
  {
    tableName: 'hospedajes',
    timestamps: false,
  }
);

export default Hospedaje;
