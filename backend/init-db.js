import dotenv from 'dotenv';
import { sequelize, Usuario, Rol, TipoHospedaje, Hospedaje } from './src/models/index.js';

dotenv.config();

async function initDatabase() {
  try {
    console.log('🔄 Inicializando base de datos...\n');
    
    // Sincronizar la base de datos (crear tablas)
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas creadas/actualizadas\n');

    // Crear rol Administrador si no existe
    const [adminRole] = await Rol.findOrCreate({
      where: { nombre: 'Administrador' },
      defaults: {
        nombre: 'Administrador',
        descripcion: 'Acceso completo al sistema'
      }
    });
    console.log('✅ Rol Administrador verificado\n');

    // Crear usuario administrador si no existe
    const [admin, createdAdmin] = await Usuario.findOrCreate({
      where: { correo: 'admin@hotel.com' },
      defaults: {
        nombre: 'Admin',
        apellido: 'Sistema',
        correo: 'admin@hotel.com',
        contrasena: 'admin123', // Se hashea automáticamente
        rol_id: adminRole.id
      }
    });

    if (createdAdmin) {
      console.log('✅ Usuario administrador creado:');
      console.log('   📧 Email: admin@hotel.com');
      console.log('   🔑 Password: admin123');
    } else {
      console.log('ℹ️  Usuario administrador ya existe');
    }

    // Crear tipos de hospedaje básicos
    console.log('\n🏨 Creando tipos de hospedaje...');
    const tiposData = [
      { nombre: 'Suite Presidencial', descripcion: 'Habitación de lujo con todas las comodidades' },
      { nombre: 'Suite Deluxe', descripcion: 'Habitación premium con servicios exclusivos' },
      { nombre: 'Habitación Ejecutiva', descripcion: 'Habitación confortable para ejecutivos' },
      { nombre: 'Habitación Estándar', descripcion: 'Habitación básica y cómoda' }
    ];

    const tipos = [];
    for (const tipo of tiposData) {
      const [tipoCreado] = await TipoHospedaje.findOrCreate({
        where: { nombre: tipo.nombre },
        defaults: tipo
      });
      tipos.push(tipoCreado);
    }
    console.log('✅ Tipos de hospedaje verificados');

    // Crear hospedajes de ejemplo
    console.log('\n🛏️  Creando hospedajes de ejemplo...');
    const hospedajesData = [
      { nombre: 'Suite 301', descripcion: 'Suite Presidencial con vista al mar', tipo_hospedaje_id: tipos[0].id, precio: 350.00, capacidad: 4, estado: 'disponible' },
      { nombre: 'Suite 302', descripcion: 'Suite Presidencial con jacuzzi', tipo_hospedaje_id: tipos[0].id, precio: 350.00, capacidad: 4, estado: 'disponible' },
      { nombre: 'Deluxe 201', descripcion: 'Suite Deluxe con balcón', tipo_hospedaje_id: tipos[1].id, precio: 250.00, capacidad: 3, estado: 'disponible' },
      { nombre: 'Deluxe 202', descripcion: 'Suite Deluxe premium', tipo_hospedaje_id: tipos[1].id, precio: 250.00, capacidad: 3, estado: 'disponible' },
      { nombre: 'Ejecutiva 101', descripcion: 'Habitación ejecutiva centro', tipo_hospedaje_id: tipos[2].id, precio: 150.00, capacidad: 2, estado: 'disponible' },
      { nombre: 'Ejecutiva 102', descripcion: 'Habitación ejecutiva tranquila', tipo_hospedaje_id: tipos[2].id, precio: 150.00, capacidad: 2, estado: 'disponible' },
      { nombre: 'Estándar 001', descripcion: 'Habitación estándar primera planta', tipo_hospedaje_id: tipos[3].id, precio: 80.00, capacidad: 2, estado: 'disponible' },
      { nombre: 'Estándar 002', descripcion: 'Habitación estándar económica', tipo_hospedaje_id: tipos[3].id, precio: 80.00, capacidad: 2, estado: 'disponible' }
    ];

    for (const hospedaje of hospedajesData) {
      await Hospedaje.findOrCreate({
        where: { nombre: hospedaje.nombre },
        defaults: hospedaje
      });
    }
    console.log('✅ Hospedajes de ejemplo creados');

    console.log('\n🎉 Base de datos lista para usar!');
    console.log('📝 Ya puedes crear reservas desde la aplicación web\n');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

initDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
