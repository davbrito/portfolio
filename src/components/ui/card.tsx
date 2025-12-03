import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { cva } from "class-variance-authority";

const cardClass = cva(
  "bg-card text-card-foreground border-border border-2 shadow-sm",
);

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(cardClass(), className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border-border border-b px-4 py-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border-border border-t px-4 py-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}
