import dotenv from 'dotenv';
import { sequelize, Usuario } from './src/models/index.js';

dotenv.config();

async function updateAdminPassword() {
  try {
    console.log('🔄 Actualizando contraseña del administrador...\n');
    
    const admin = await Usuario.findOne({
      where: { correo: 'admin@hotel.com' }
    });

    if (!admin) {
      console.log('❌ Usuario administrador no encontrado');
      return;
    }

    // Actualizar contraseña (el hook beforeUpdate la hasheará automáticamente)
    await admin.update({ contrasena: 'Admin123.' });

    console.log('✅ Contraseña actualizada correctamente');
    console.log('   📧 Email: admin@hotel.com');
    console.log('   🔑 Password: Admin123.');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

updateAdminPassword()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
