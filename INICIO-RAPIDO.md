# Sistema de Gestión Hotelera - Inicio Rápido

## 🚀 Pasos para iniciar

### 1️⃣ Preparar Base de Datos
```bash
# Asegúrate de tener MySQL corriendo
# La base de datos 'hotel' debe existir
```

### 2️⃣ Inicializar Backend
```bash
cd backend

# Instalar dependencias (solo primera vez)
npm install

# Inicializar base de datos y crear usuario admin (solo primera vez)
npm run init-db

# Iniciar servidor backend
npm run dev
```

El backend estará en: `http://localhost:3000`

### 3️⃣ Iniciar Frontend
```bash
# En otra terminal
cd frontend

# Instalar dependencias (solo primera vez)
npm install

# Iniciar aplicación frontend
npm run dev
```

El frontend estará en: `http://localhost:5173`

## 🔐 Credenciales de Acceso

**Usuario Administrador:**
- Email: `admin@hotel.com`
- Contraseña: `admin123`

## 📝 Flujo de Uso

1. Abre el navegador en `http://localhost:5173`
2. Serás redirigido automáticamente al login
3. Ingresa las credenciales de administrador
4. Una vez autenticado, accederás al dashboard
5. Desde ahí podrás:
   - Gestionar reservas
   - Administrar hospedajes
   - Ver reportes
   - Registrar pagos

## ⚙️ Variables de Entorno

### Backend (.env)
Ya configurado en `backend/.env`:
```
APP_PORT=3000
FRONTEND_URL=http://localhost:5173
SECRET_KEY=eecc2146f955ca491b78b6afb2c0bac5666762b27d47bf3e8fec8f9314f69ef5
DB_HOST=localhost
DB_USER=root  
DB_PASSWORD=1234
DB_NAME=hotel
```

### Frontend (.env)
Ya configurado en `frontend/.env`:
```
VITE_API_URL=http://localhost:3000/api/v1
```

## ✅ Sistema Completamente Conectado

- ✅ CORS configurado
- ✅ Autenticación JWT funcionando
- ✅ Login con redirección automática
- ✅ Rutas protegidas
- ✅ Módulo de reservas conectado con BD
- ✅ Logout funcional

¡Todo listo para usar! 🎉
