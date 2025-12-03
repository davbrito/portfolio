import type { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const labelVariants = cva("inline-block", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
    },
    casing: {
      normal: "",
      uppercase: "tracking-wider uppercase",
    },
  },
  defaultVariants: {
    size: "xs",
    tone: "muted",
    casing: "uppercase",
  },
});

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> &
  VariantProps<typeof labelVariants> & {
    children?: ReactNode;
  };

export function Label({
  className,
  size,
  tone,
  casing,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(labelVariants({ size, tone, casing }), className)}
      {...props}
    >
      {children}
    </label>
  );
}
