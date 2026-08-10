import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres").max(50).trim(),
  email: z.string().email("Correo electrónico inválido").toLowerCase().trim(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: z.enum(["observer", "analyst", "admin"]),
});

export const updateUserSchema = z.object({
  username: z.string().min(3).max(50).trim().optional(),
  email: z.string().email().toLowerCase().trim().optional(),
  role: z.enum(["observer", "analyst", "admin"]).optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
});

export const userFiltersSchema = z.object({
  search: z.string().optional(),
  role: z.enum(["observer", "analyst", "admin"]).optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
