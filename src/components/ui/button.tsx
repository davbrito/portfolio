import {
  Button as BaseButton,
  ButtonProps as BaseButtonProps,
} from "@ariakit/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "focus-visible:ring-ring inline-flex items-center justify-center gap-2 border-2 px-4 py-2 text-sm font-medium transition-colors select-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-secondary text-secondary-foreground border-border enabled:hover:brightness-120",
        primary:
          "bg-primary text-primary-foreground border-transparent enabled:hover:brightness-120",
        outline: "text-foreground border-border hover:bg-muted bg-transparent",
        ghost:
          "text-foreground hover:bg-primary hover:text-primary-foreground border-0 bg-transparent",
        destructive:
          "text-destructive border-destructive hover:bg-destructive/10 bg-transparent font-medium",
        link: "text-primary border-0 bg-transparent underline-offset-4 hover:underline",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "",
        lg: "px-5 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends BaseButtonProps, VariantProps<typeof buttonVariants> {}

export function Button({
  variant = "default",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      type="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
