/**
 * UserForm Component
 *
 * Client Component for creating/editing users.
 */

"use client";

import { useState } from "react";

import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";

import { createUserSchema, updateUserSchema } from "../schemas";
import { CreateUserDto, UpdateUserDto, User } from "../types";

interface UserFormProps {
  onSubmit: (data: CreateUserDto | UpdateUserDto) => Promise<void>;
  initialData?: User;
  mode?: "create" | "edit";
}

export function UserForm({ onSubmit, initialData, mode = "create" }: UserFormProps) {
  const [formData, setFormData] = useState({
    email: initialData?.email || "",
    username: initialData?.username || "",
    password: "",
    role: initialData?.role || "observer",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const schema = mode === "create" ? createUserSchema : updateUserSchema;
      const validated = schema.parse(formData);
      await onSubmit(validated);
    } catch (error) {
      if (error instanceof Error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any).name === "ZodError") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const zodError = error as any;
          const fieldErrors: Record<string, string> = {};
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          zodError.errors?.forEach((err: any) => {
            if (err.path && Array.isArray(err.path) && err.path.length > 0) {
              fieldErrors[err.path[0] as string] = err.message as string;
            }
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ submit: error.message });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label htmlFor="username" className="mb-2 block text-sm font-medium">
            Nombre de usuario
          </label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
            aria-invalid={errors.username ? "true" : "false"}
            aria-describedby={errors.username ? "username-error" : undefined}
          />
          {errors.username && (
            <p id="username-error" className="text-destructive mt-1 text-sm" role="alert">
              {errors.username}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-destructive mt-1 text-sm" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password (solo en modo crear) */}
        {mode === "create" && (
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-destructive mt-1 text-sm" role="alert">
                {errors.password}
              </p>
            )}
          </div>
        )}

        {/* Role */}
        <div>
          <label htmlFor="role" className="mb-2 block text-sm font-medium">
            Rol
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="observer">Observador</option>
            <option value="analyst">Analista de Datos</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {/* Error de submit */}
        {errors.submit && (
          <p className="text-destructive text-sm" role="alert">
            {errors.submit}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} fullWidth>
          {isSubmitting
            ? "Enviando..."
            : mode === "create"
              ? "Crear Usuario"
              : "Actualizar Usuario"}
        </Button>
      </form>
    </Card>
  );
}
