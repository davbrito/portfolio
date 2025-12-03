import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md border",
  {
    variants: {
      variant: {
        solid: "bg-accent text-accent-foreground border-border",
        outline: "bg-transparent text-foreground border-border",
      },
    },
    defaultVariants: {
      variant: "solid",
    },
  }
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    children?: ReactNode;
  };

export function Badge({ className, children, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}
