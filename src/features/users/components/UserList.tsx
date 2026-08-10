import type { User } from "../types";

import { UserCard } from "./UserCard";

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-4xl">👥</div>
        <h3 className="mt-4 text-lg font-semibold">No se encontraron usuarios</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Intente ajustar su búsqueda o filtros.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
