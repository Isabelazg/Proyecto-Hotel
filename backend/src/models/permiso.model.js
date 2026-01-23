import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Permiso = sequelize.define(
  'Permiso',
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
    tableName: 'permisos',
    timestamps: false,
  }
);

export default Permiso;
