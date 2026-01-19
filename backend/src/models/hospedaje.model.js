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
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  },
  {
    tableName: 'hospedajes',
    timestamps: false,
  }
);

export default Hospedaje;
