# PetSocial

Plataforma social para amantes de las mascotas. Comparte fotos, interactúa con otros usuarios, y gestiona el perfil de tus compañeros peludos.

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build:** Vite 7
- **Styling:** Tailwind CSS 4
- **Forms:** React Hook Form + Zod
- **Data Fetching:** TanStack Query
- **Real-time:** Socket.io
- **Animations:** Framer Motion
- **PWA:** Vite PWA Plugin

## Features

- Autenticación (login/registro)
- Feed social con publicaciones
- Sistema de likes y comentarios
- Chat en tiempo real
- Notificaciones en tiempo real
- Gestión de mascotas (añadir/editar)
- Perfiles de usuario
- Tema claro/oscuro
- Diseño responsive
- PWA (instalable)

## Getting Started

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Vista previa de producción
npm run preview
```

## Project Structure

```
src/
├── api/           # Endpoints de la API
├── components/    # Componentes reutilizables
├── context/       # Contextos de React (Auth)
├── hooks/         # Hooks personalizados
├── icons/         # Componentes SVG
├── layouts/       # Layouts principales
├── pages/         # Páginas de la app
├── routes/        # Configuración de rutas
├── socket/        # Servicio de WebSocket
├── types/         # Definiciones de TypeScript
└── utils/         # Funciones utilitarias
```

## Scripts

| Comando        | Descripción                    |
|----------------|--------------------------------|
| `npm run dev`  | Iniciar servidor de desarrollo |
| `npm run build`| Compilar para producción       |
| `npm run lint` | Verificar código con ESLint    |
| `npm run preview` | Vista previa del build     |