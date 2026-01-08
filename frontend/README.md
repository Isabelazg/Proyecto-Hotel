# Hotel Management System - Frontend

## Estructura del Proyecto

Este proyecto sigue una arquitectura basada en features con las siguientes reglas:

### 📁 Estructura de Carpetas

```
src/
├── app/                    # Configuración de la aplicación
├── pages/                  # Solo rutas (sin lógica)
├── features/               # Dominios completos (UI + lógica + API)
├── shared/                 # Componentes y utilidades reutilizables
├── api/                    # Configuración de Axios
├── styles/                 # Estilos globales con Tailwind
└── assets/                 # Recursos estáticos
```

### 🟢 Reglas de Oro

**pages/**: Solo renderizan, no fetch, no lógica
**features/**: Dominio completo (UI + lógica + API)
**shared/**: Todo lo reutilizable, nunca lógica de negocio

## 🚀 Instalación

```bash
npm install
```

## 💻 Desarrollo

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 🎨 Tecnologías

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
