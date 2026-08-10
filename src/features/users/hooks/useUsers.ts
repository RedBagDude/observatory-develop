/**
 * useUsers Hook
 *
 * Application layer hook for user management.
 */

"use client";

import { useMemo } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { userService } from "../lib/userService";
import { applyUserFilters, sortUsers } from "../lib/userUtils";
import type { CreateUserDto, UpdateUserDto,UserFilters } from "../types";

export function useUsers(filters?: UserFilters) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", filters],
    queryFn: () => userService.getUsers(filters),
    staleTime: 5 * 60 * 1000,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    let result = data;
    if (filters) {
      result = applyUserFilters(result, filters);
    }
    return sortUsers(result);
  }, [data, filters]);

  return {
    users: filtered,
    rawUsers: data ?? [],
    isLoading,
    error,
  };
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateUserDto) => userService.createUser(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUserDto }) =>
      userService.updateUser(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
