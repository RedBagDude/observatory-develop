import { forwardRef, type HTMLAttributes } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-xl border bg-card text-card-foreground", {
  variants: {
    variant: {
      default: "",
      elevated: "shadow-lg",
      outline: "border-2",
      outlined: "border shadow-none",
      ghost: "border-0 bg-transparent shadow-none",
      interactive: "cursor-pointer shadow-sm transition-all hover:shadow-md hover:border-primary/30",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  padding?: "none" | "sm" | "md" | "lg";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant }),
        padding === "none" && "[&>div]:p-0",
        padding === "sm" && "[&>div]:p-3",
        padding === "md" && "[&>div]:p-6",
        padding === "lg" && "[&>div]:p-8",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 border-b border-border p-6", className)}
      {...props}
    />
  );
}
CardHeader.displayName = "CardHeader";

function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}
CardTitle.displayName = "CardTitle";

function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
CardDescription.displayName = "CardDescription";

function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}
CardBody.displayName = "CardBody";

function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center border-t border-border p-6", className)}
      {...props}
    />
  );
}
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
