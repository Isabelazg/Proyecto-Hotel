import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const TipoHospedaje = sequelize.define(
  'TipoHospedaje',
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
      unique: true,
    },
    descripcion: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: 'tipo_hospedajes',
    timestamps: false,
  }
);

export default TipoHospedaje;
