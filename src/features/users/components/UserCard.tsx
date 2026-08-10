import Image from "next/image";

import { Clock, Mail, Shield } from "lucide-react";

import { Badge } from "@/components/primitives/Badge";
import { Card, CardBody } from "@/components/primitives/Card";
import { formatDate, getInitials } from "@/lib/utils";

import type { User } from "../types";

interface UserCardProps {
  user: User;
}

const roleBadgeVariant: Record<User["role"], "default" | "info" | "secondary"> = {
  admin: "default",
  analyst: "info",
  observer: "secondary",
};

const statusBadgeVariant: Record<User["status"], "success" | "warning" | "destructive"> = {
  active: "success",
  inactive: "warning",
  suspended: "destructive",
};

const roleLabels: Record<User["role"], string> = {
  admin: "Administrador",
  analyst: "Analista",
  observer: "Observador",
};

export function UserCard({ user }: UserCardProps) {
  return (
    <Card variant="elevated" className="transition-colors hover:border-primary/30">
      <CardBody>
        <div className="flex items-start gap-4">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.username}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {getInitials(user.username)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate font-semibold">{user.username}</h3>
              <Badge variant={roleBadgeVariant[user.role]} size="sm">
                {roleLabels[user.role]}
              </Badge>
            </div>

            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate">{user.email}</span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  <Badge variant={statusBadgeVariant[user.status]} size="sm">
                    {user.status}
                  </Badge>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(user.lastActive, { month: "short", day: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
