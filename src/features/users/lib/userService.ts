/**
 * User Service
 *
 * Data layer for user operations.
 */

import { apiClient, ApiError } from "@/lib/api/api-client";

import type { CreateUserDto, UpdateUserDto,User, UserFilters } from "../types";

interface ApiUser {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  last_active: string;
  created_at: string;
}

function transformUserFromAPI(data: ApiUser): User {
  return {
    id: data.id,
    username: data.username,
    email: data.email,
    role: data.role as User["role"],
    status: data.status as User["status"],
    avatar: data.avatar,
    lastActive: new Date(data.last_active),
    createdAt: new Date(data.created_at),
  };
}

export const userService = {
  async getUsers(filters?: UserFilters): Promise<User[]> {
    try {
      const isServer = typeof window === "undefined";
      const data = await apiClient.get<ApiUser[]>("/users", {
        params: filters as Record<string, string | number | boolean | undefined>,
        ...(isServer && {
          next: { tags: ["users"], revalidate: 300 },
        }),
      });
      return data.map(transformUserFromAPI);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error("Error fetching users:", {
          type: error.type,
          status: error.status,
          message: error.message,
        });
      }
      throw error;
    }
  },

  async getUserById(id: string): Promise<User> {
    try {
      const isServer = typeof window === "undefined";
      const data = await apiClient.get<ApiUser>(`/users/${id}`, {
        ...(isServer && {
          next: { tags: ["users", `user-${id}`], revalidate: 300 },
        }),
      });
      return transformUserFromAPI(data);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        throw new Error("User not found");
      }
      throw error;
    }
  },

  async createUser(dto: CreateUserDto): Promise<User> {
    try {
      const data = await apiClient.post<ApiUser>("/users", dto);
      return transformUserFromAPI(data);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    try {
      const data = await apiClient.patch<ApiUser>(`/users/${id}`, dto);
      return transformUserFromAPI(data);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
};
