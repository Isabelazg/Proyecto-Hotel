import dotenv from "dotenv";
import app from "./app.js";


dotenv.config();

const PORT = process.env.APP_PORT || 3000;
const APP_URL = process.env.APP_URL?.replace('${APP_PORT}', PORT) || `http://localhost:${PORT}`;


app.listen(PORT, () => {
  console.log(` Servidor escuchando en el puerto: ${PORT}`);
  console.log(` Servidor corriendo en: ${APP_URL}`);
});