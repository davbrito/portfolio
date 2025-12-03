import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";
import {
  Popover as AriakitPopover,
  PopoverHeading,
  usePopoverStore,
} from "@ariakit/react";

export type PopoverProps = HTMLAttributes<HTMLDivElement> & {
  heading?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function Popover({
  className,
  heading,
  open,
  onOpenChange,
  children,
  ...props
}: PopoverProps) {
  const store = usePopoverStore({ open, setOpen: onOpenChange });
  return (
    <AriakitPopover
      store={store}
      className={cn(
        "border border-border rounded-md bg-popover text-popover-foreground shadow-md p-4",
        className,
      )}
      {...props}
    >
      {heading && (
        <PopoverHeading className="heading-4">{heading}</PopoverHeading>
      )}
      <div className="p-2">{children}</div>
    </AriakitPopover>
  );
}
