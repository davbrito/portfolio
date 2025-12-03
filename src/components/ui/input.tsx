import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva([
  "border-input bg-background text-foreground focus:ring-ring w-full border-2 px-3 py-2 text-sm shadow-sm outline-none focus:ring-2",
  "aria-invalid:border-destructive aria-invalid:focus:ring-destructive",
]);

export interface InputProps
  extends
    InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

export function Input({ className, ...props }: InputProps) {
  return <input className={cn(inputVariants(), className)} {...props} />;
}
