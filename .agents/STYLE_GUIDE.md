# Guía de Estilos y Convenciones

## Componentes

### Naming
- Archivos: PascalCase (Button.tsx, MyComponent.tsx)
- Componentes: PascalCase
- Hooks: camelCase con prefijo use (useAuth, usePosts)

### Estructura de Componente
```tsx
import { useState } from "react";
import { Button, Card } from "@/shared/components";

interface MyComponentProps {
  title: string;
  onSubmit?: () => void;
}

export const MyComponent = ({ title, onSubmit }: MyComponentProps) => {
  const [loading, setLoading] = useState(false);

  return (
    <Card>
      <h1>{title}</h1>
      <Button onClick={onSubmit}>Enviar</Button>
    </Card>
  );
};
```

### Props
- Siempre tipar con interface
- Usar forwardRef cuando sea necesario para refs
- DisplayName para componentes forwardRef

## Tipos

### Organización
- `shared/types/auth.ts` - Autenticación
- `shared/types/pet.ts` - Mascotas
- `shared/types/post.ts` - Posts y comentarios
- `shared/types/chat.ts` - Mensajería
- `shared/types/notification.ts` - Notificaciones
- `shared/types/common.ts` - Tipos comunes (ApiError, PaginatedResponse)

### Naming
- Interfaces: PascalCase (User, Post)
- Types: PascalCase
- Types utilitarios: camelCase (queryKeys)

## Imports

### Orden recommended
1. React/Next imports
2. Router imports
3. External libraries
4. Shared components/hooks/types
5. Local components/hooks
6. Styles

```tsx
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button, Card } from "@shared/components";
import { useAuth } from "@/context/AuthContext";
import type { Post } from "@shared/types";
import { PostCard } from "./PostCard";
import "./styles.css";
```

## CSS/Tailwind

- Usar clases de Tailwind
- Componentes base ya tienen estilos consistentes
- dark: para modo oscuro
- Evitar CSS inline, usar Tailwind o CSS modules