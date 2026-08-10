"use client";

import { Lock, Mail, User, UserPlus } from "lucide-react";

import { Button } from "@/components/primitives/Button";
import { AuthSwitchLink } from "@/features/auth/components/AuthSwitchLink";
import { ErrorText } from "@/features/auth/components/ErrorText";
import { InputField } from "@/features/auth/components/InputField";
import { RigthAddon } from "@/features/auth/components/RigthAddon";
import { RoleSelector } from "@/features/auth/components/RoleSelector";
import { ROLES } from "@/features/auth/const/roles";
import { usePasswordToggle } from "@/features/auth/hooks/usePasswordToggle";
import { useRegitsterUser } from "@/features/auth/hooks/useRegitsterUser";

export function RegisterForm() {
  const { register, errors, handleSubmit, isSubmitting, errorMessage } = useRegitsterUser();
  const { showPassword, togglePasswordVisibility, inputType } = usePasswordToggle();

  return (
    <div className="w-full max-w-md">
      <h1 className="mb-8 text-center font-display text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-white">
        Crear Cuenta
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Username */}
        <InputField
          name="username"
          label="Nombre de usuario"
          field={register("username")}
          error={errors.username}
          placeholder="usuario123"
          type="text"
          required
          icon={<User size={18} aria-hidden="true" />}
        />

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
          placeholder="Mínimo 8 caracteres"
          type={inputType}
          required
          icon={<Lock size={18} aria-hidden="true" />}
          rightAddon={<RigthAddon showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} />}
        />

        {/* Confirm password */}
        <InputField
          name="confirmPassword"
          label="Confirmar contraseña"
          field={register("confirmPassword")}
          error={errors.confirmPassword}
          placeholder="Repite tu contraseña"
          type={inputType}
          required
          icon={<Lock size={18} aria-hidden="true" />}
        />

        {/* Role selector */}
        <RoleSelector
          name="role"
          label="Rol de usuario"
          options={ROLES.map((r) => ({ id: r.value, label: r.label }))}
          field={register("role")}
          error={errors.role}
          required
          description="Selecciona el tipo de cuenta que necesitas"
        />

        {/* Submit button */}
        <Button type="submit" className="h-12 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            "Creando cuenta..."
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Crear Cuenta
            </>
          )}
        </Button>

        {/* Error message */}
        {errorMessage && <ErrorText message={errorMessage} />}

        {/* Switch to login */}
        <AuthSwitchLink
          disabled={isSubmitting}
          question="¿Ya tienes una cuenta?"
          text_action="Inicia sesión"
          url="/login"
        />
      </form>
    </div>
  );
}
