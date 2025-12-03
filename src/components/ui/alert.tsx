import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const alertVariants = cva("flex items-start gap-3 border-2 p-3", {
  variants: {
    variant: {
      default: "bg-muted text-foreground border-border",
      destructive: "bg-destructive/10 text-destructive border-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type AlertProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    title?: ReactNode;
    description?: ReactNode;
  };

export function Alert({
  className,
  variant,
  title,
  description,
  ...props
}: AlertProps) {
  return (
    <div className={cn(alertVariants({ variant }), className)} {...props}>
      <div>
        {title && <div className="heading-4">{title}</div>}
        {description && <div className="body">{description}</div>}
      </div>
    </div>
  );
}
