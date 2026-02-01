# Sitio Público - Glamping Hotel

Este documento describe la implementación del sitio web público del Glamping Hotel.

## 📁 Estructura de Archivos

```
frontend/src/features/public/
├── components/
│   ├── PublicHeader.jsx       # Header del sitio público
│   ├── PublicFooter.jsx       # Footer con enlaces y contacto
│   └── UnitCard.jsx            # Tarjeta de habitación
├── layouts/
│   └── PublicLayout.jsx        # Layout principal del sitio público
├── views/
│   ├── HomePage.jsx            # Landing page principal
│   ├── UnitsView.jsx           # Catálogo de habitaciones
│   ├── UnitDetailView.jsx     # Detalle de habitación
│   ├── AboutPage.jsx           # Página sobre nosotros
│   └── ContactPage.jsx         # Página de contacto
├── hooks/
│   └── usePublicUnits.js       # Hooks para obtener datos
├── services/
│   └── public.api.js           # Servicios API públicos
└── index.js                    # Exports principales
```

## 🎨 Características Principales

### 1. **Landing Page (HomePage)**
- Hero section con llamada a la acción
- Sección de características del hotel
- Tarjetas destacadas de habitaciones
- Servicios e instalaciones
- CTA de reserva

### 2. **Catálogo de Habitaciones (UnitsView)**
- Sistema de filtros (tipo, precio, capacidad)
- Grid responsivo de habitaciones
- Paginación de resultados
- Estados de disponibilidad

### 3. **Detalle de Habitación (UnitDetailView)**
- Galería de imágenes
- Información completa de la unidad
- Lista de comodidades
- Formulario de reserva
- Estado de disponibilidad
- Información de contacto

### 4. **Sobre Nosotros (AboutPage)**
- Historia del hotel
- Valores corporativos
- Equipo de trabajo
- Compromiso con la sostenibilidad

### 5. **Contacto (ContactPage)**
- Formulario de contacto
- Información de ubicación
- Horarios de check-in/check-out
- Preguntas frecuentes
- Mapa de ubicación

## 🔌 API Endpoints Públicos

El sitio público consume los siguientes endpoints del backend (sin autenticación):

```javascript
GET  /api/public/hotel-info           // Información general del hotel
GET  /api/public/hospedajes           // Lista de habitaciones disponibles
GET  /api/public/hospedajes/:id       // Detalle de una habitación
GET  /api/public/tipos-hospedaje      // Tipos de hospedaje
POST /api/public/check-availability   // Verificar disponibilidad
```

## 🎯 Rutas del Sitio Público

```
/                           → HomePage (Landing page)
/habitaciones              → UnitsView (Catálogo)
/habitaciones/:id          → UnitDetailView (Detalle)
/sobre-nosotros            → AboutPage
/contacto                  → ContactPage
```

## 🔐 Rutas Administrativas

Las rutas del panel administrativo ahora están bajo el prefijo `/admin`:

```
/admin/login               → Login de administradores
/admin                     → Dashboard
/admin/reservations        → Gestión de reservas
/admin/units               → Gestión de habitaciones
/admin/clients             → Gestión de clientes
/admin/payments            → Gestión de pagos
/admin/reports             → Reportes
```

## 🎨 Componentes Compartidos

### PublicHeader
- Logo y navegación principal
- Links a secciones públicas
- Botón de acceso al panel administrativo
- Botón CTA de reserva
- Menú responsive para móviles

### PublicFooter
- Información del hotel
- Enlaces rápidos
- Servicios destacados
- Información de contacto
- Redes sociales
- Copyright

### UnitCard
- Imagen de la habitación
- Tipo de hospedaje
- Nombre y descripción
- Capacidad y número
- Precio por noche
- Estado de disponibilidad
- Botón de ver detalles

## 🚀 Cómo Usar

1. **Iniciar el backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Iniciar el frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Acceder al sitio:**
   - Sitio público: `http://localhost:5173/`
   - Panel admin: `http://localhost:5173/admin/login`

## 📝 Próximas Mejoras

- [ ] Sistema de reservas públicas completo
- [ ] Integración con pasarela de pago
- [ ] Galería de imágenes real con carga desde backend
- [ ] Sistema de reviews y calificaciones
- [ ] Chat en vivo
- [ ] Búsqueda avanzada con fechas
- [ ] Ofertas y paquetes especiales
- [ ] Newsletter
- [ ] Blog de contenido
- [ ] Integración con Google Maps para ubicación

## 🎨 Personalización

Para personalizar el sitio:

1. **Colores:** Edita las clases de Tailwind en los componentes
2. **Logo:** Reemplaza el emoji en `PublicHeader.jsx`
3. **Información:** Actualiza el endpoint `/api/public/hotel-info`
4. **Imágenes:** Agrega URLs de imágenes reales en el backend

## 📱 Responsive Design

El sitio está completamente optimizado para:
- 📱 Móviles (< 768px)
- 💻 Tablets (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🔧 Tecnologías Utilizadas

- **React 18** - Framework principal
- **React Router 6** - Navegación
- **Tailwind CSS** - Estilos
- **Axios** - Peticiones HTTP
- **Vite** - Build tool
