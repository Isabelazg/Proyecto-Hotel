import sequelize from '../config/db.config.js';
import Usuario from './usuario.model.js';
import Rol from './rol.model.js';
import Permiso from './permiso.model.js';
import TipoHospedaje from './tipoHospedaje.model.js';
import Hospedaje from './hospedaje.model.js';

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

// Relación Rol <-> Permiso (many-to-many a través de rol_permiso)
Rol.belongsToMany(Permiso, {
  through: 'rol_permiso',
  foreignKey: 'rol_id',
  otherKey: 'permiso_id',
  as: 'permisos'
});

Permiso.belongsToMany(Rol, {
  through: 'rol_permiso',
  foreignKey: 'permiso_id',
  otherKey: 'rol_id',
  as: 'roles'
});

// Relación Hospedaje -> TipoHospedaje (belongsTo)
Hospedaje.belongsTo(TipoHospedaje, {
  foreignKey: 'tipo_hospedaje_id',
  as: 'tipo_hospedaje',
});

// Relación TipoHospedaje -> Hospedaje (hasMany)
TipoHospedaje.hasMany(Hospedaje, {
  foreignKey: 'tipo_hospedaje_id',
  as: 'hospedajes',
});

export { sequelize, Usuario, Rol, Permiso, TipoHospedaje, Hospedaje };
