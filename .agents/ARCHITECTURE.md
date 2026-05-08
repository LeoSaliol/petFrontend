# Arquitectura del Proyecto

## Estructura de Carpetas

```
src/
├── app/                    # Configuración global de la app
│   ├── providers/         # Providers (QueryClient, etc.)
│   ├── routes/            # Configuración de rutas
│   └── layouts/           # Layouts principales
│
├── features/              # Código por dominio/funcionalidad
│   ├── auth/             # Autenticación
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── posts/            # Posts
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── chat/             # Chat/mensajería
│   ├── notifications/    # Notificaciones
│   └── pets/             # Mascotas
│
├── shared/               # Código compartido
│   ├── api/              # Servicios API
│   ├── components/      # Componentes UI base
│   ├── config/           # Configuración global
│   ├── hooks/            # Hooks reutilizables
│   ├── types/            # Tipos TypeScript
│   └── utils/            # Utilidades
│
├── components/           # Componentes globales (legacy, migrar gradualmente)
├── hooks/               # Hooks globales (legacy)
├── pages/               # Páginas (legacy, migrar a features)
└── api/                # API legacy (migrar a shared/api)
```

## Principios de Arquitectura

### 1. Feature-based Organization
- Cada dominio tiene su propia carpeta en `features/`
- Contiene: components, hooks, services específicos del dominio
- Código compartido va a `shared/`

### 2. Componentes UI Base (shared/components)
- Button, Input, Textarea, Modal, Card, Avatar, Skeleton, Loading
- Props tipadas con TypeScript
- Soporte para variants y sizes
- Estilos con Tailwind

### 3. Servicios API (shared/api)
- Un archivo por recurso (posts.ts, pets.ts, etc.)
- Métodos claros y tipados
- Manejo centralizado de errores

### 4. Lazy Loading
- Rutas con React.lazy() para code splitting
- Suspense con fallback de loading

### 5. Tipos TypeScript
- Organizados por dominio en `shared/types/`
- Tipos separados: auth.ts, pet.ts, post.ts, chat.ts, notification.ts, common.ts