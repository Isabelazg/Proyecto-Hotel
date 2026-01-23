import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';
import bcrypt from 'bcryptjs';

const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    documento: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    telefono: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: 'usuarios',
    timestamps: false,
  }
);

// Métodos estáticos para manejo de contraseñas (utilidad)
Usuario.comparePassword = async function (plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

Usuario.generatePassword = async function (plainPassword) {
  const saltRounds = 10;
  return await bcrypt.hash(plainPassword, saltRounds);
};

export default Usuario;
