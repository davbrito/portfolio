import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";
import {
  Dialog as AriakitDialog,
  DialogHeading,
  DialogDescription,
  useDialogStore,
} from "@ariakit/react";

export type DialogProps = HTMLAttributes<HTMLDivElement> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
};

export function Dialog({
  className,
  open,
  onOpenChange,
  title,
  description,
  children,
  ...props
}: DialogProps) {
  const store = useDialogStore({ open, setOpen: onOpenChange });
  return (
    <AriakitDialog
      backdrop
      store={store}
      className={cn(
        "border border-border rounded-md bg-popover text-popover-foreground shadow-md p-4",
        className,
      )}
      {...props}
    >
      {title && <DialogHeading className="heading-3">{title}</DialogHeading>}
      {description && (
        <DialogDescription className="body">{description}</DialogDescription>
      )}
      <div className="p-2">{children}</div>
    </AriakitDialog>
  );
}
