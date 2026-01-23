import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Pago = sequelize.define(
  'Pago',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    reserva_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'reservas',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    valor: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
  },
  {
    tableName: 'pagos',
    timestamps: false,
  }
);

export default Pago;
