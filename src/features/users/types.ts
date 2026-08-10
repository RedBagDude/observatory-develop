/**
 * Users Feature Types
 */

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  lastActive: Date;
  createdAt: Date;
}

export type UserRole = "observer" | "analyst" | "admin";
export type UserStatus = "active" | "inactive" | "suspended";

export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  page?: number;
  limit?: number;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
}
