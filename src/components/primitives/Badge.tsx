import type { HTMLAttributes } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        success:
          "border-transparent bg-success text-success-foreground",
        warning:
          "border-transparent bg-warning text-warning-foreground",
        info:
          "border-transparent bg-info text-info-foreground",
        outline: "text-foreground",
      },
      size: {
        xs: "px-1.5 py-0 text-[10px]",
        sm: "px-2 py-0 text-[10px]",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  if (dot) {
    return (
      <span className="relative flex h-2.5 w-2.5" {...props}>
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
            variant === "destructive" && "bg-destructive",
            variant === "success" && "bg-success",
            variant === "warning" && "bg-warning",
            !variant && "bg-primary"
          )}
        />
        <span
          className={cn(
            "relative inline-flex h-2.5 w-2.5 rounded-full",
            variant === "destructive" && "bg-destructive",
            variant === "success" && "bg-success",
            variant === "warning" && "bg-warning",
            variant === "secondary" && "bg-secondary",
            !variant && "bg-primary"
          )}
        />
      </span>
    );
  }

  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </div>
  );
}
Badge.displayName = "Badge";

export { Badge, badgeVariants };
