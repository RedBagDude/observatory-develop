"use client";

import { Lock, LogIn, Mail } from "lucide-react";

import { Button } from "@/components/primitives/Button";
import { AuthSwitchLink } from "@/features/auth/components/AuthSwitchLink";
import { ErrorText } from "@/features/auth/components/ErrorText";
import { InputField } from "@/features/auth/components/InputField";
import { RigthAddon } from "@/features/auth/components/RigthAddon";
import { RoleSelector } from "@/features/auth/components/RoleSelector";
import { ROLES } from "@/features/auth/const/roles";
import { useLoginUser } from "@/features/auth/hooks/useLoginUser";
import { usePasswordToggle } from "@/features/auth/hooks/usePasswordToggle";

export function LoginForm() {
  const { register, errors, handleSubmit, isSubmitting, errorMessage } = useLoginUser();
  const { showPassword, togglePasswordVisibility, inputType } = usePasswordToggle();

  return (
    <div className="w-full max-w-md">
      <h1 className="mb-8 text-center font-display text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-white">
        Iniciar Sesión
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <InputField
          name="email"
          label="Correo electrónico"
          field={register("email")}
          error={errors.email}
          placeholder="usuario@ejemplo.com"
          type="email"
          required
          icon={<Mail size={18} aria-hidden="true" />}
        />

        {/* Password */}
        <InputField
          name="password"
          label="Contraseña"
          field={register("password")}
          error={errors.password}
          placeholder="••••••••"
          type={inputType}
          required
          icon={<Lock size={18} aria-hidden="true" />}
          rightAddon={<RigthAddon showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} />}
        />

        {/* Role selector */}
        <RoleSelector
          name="role"
          label="Rol de acceso"
          options={ROLES.map((r) => ({ id: r.value, label: r.label }))}
          field={register("role")}
          error={errors.role}
          required
        />

        {/* Submit button */}
        <Button type="submit" className="h-12 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            "Iniciando sesión..."
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Iniciar Sesión
            </>
          )}
        </Button>

        {/* Error message */}
        {errorMessage && <ErrorText message={errorMessage} />}

        {/* Switch to register */}
        <AuthSwitchLink
          disabled={isSubmitting}
          question="¿No tienes una cuenta?"
          text_action="Regístrate aquí"
          url="/register"
        />
      </form>
    </div>
  );
}
