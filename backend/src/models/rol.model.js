import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Rol = sequelize.define(
  'Rol',
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
  },
  {
    tableName: 'roles',
    timestamps: false,
  }
);

export default Rol;
