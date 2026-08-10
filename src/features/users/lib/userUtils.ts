/**
 * User Utilities
 */

import type { User, UserFilters } from "../types";

export function applyUserFilters(users: User[], filters: UserFilters): User[] {
  let filtered = [...users];

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.username.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
    );
  }

  if (filters.role) {
    filtered = filtered.filter((u) => u.role === filters.role);
  }

  if (filters.status) {
    filtered = filtered.filter((u) => u.status === filters.status);
  }

  return filtered;
}

export function sortUsers(
  users: User[],
  key: keyof User = "username",
  direction: "asc" | "desc" = "asc"
): User[] {
  return [...users].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal instanceof Date && bVal instanceof Date) {
      return direction === "asc"
        ? aVal.getTime() - bVal.getTime()
        : bVal.getTime() - aVal.getTime();
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    return direction === "asc"
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });
}

export function getUserRoleDisplayName(role: User["role"]): string {
  const displayNames: Record<User["role"], string> = {
    admin: "Administrador",
    analyst: "Analista de Datos",
    observer: "Observador",
  };
  return displayNames[role];
}
