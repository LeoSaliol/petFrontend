import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre es demasiado largo"),

  email: z.string().email("Correo electrónico inválido").max(50),

  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(50),
});

export const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido").max(50),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(50),
});
