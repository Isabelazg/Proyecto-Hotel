import sequelize from '../config/db.config.js';
import Usuario from './usuario.model.js';
import Rol from './rol.model.js';

// Relación Usuario -> Rol (belongsTo)
Usuario.belongsTo(Rol, {
  foreignKey: 'rol_id',
  as: 'rol',
});

// Relación Rol -> Usuario (hasMany)
Rol.hasMany(Usuario, {
  foreignKey: 'rol_id',
  as: 'usuarios',
});

export { sequelize, Usuario, Rol };
