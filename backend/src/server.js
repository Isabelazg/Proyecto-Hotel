import dotenv from "dotenv";
import app from "./app.js";
import { sequelize } from "./models/index.js";

dotenv.config();

const PORT = process.env.APP_PORT || 3000;
const APP_URL = process.env.APP_URL?.replace('${APP_PORT}', PORT) || `http://localhost:${PORT}`;

// Sincronizar base de datos y luego iniciar el servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Base de datos sincronizada');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en el puerto: ${PORT}`);
      console.log(`🌐 Servidor corriendo en: ${APP_URL}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al sincronizar la base de datos:', error);
  });