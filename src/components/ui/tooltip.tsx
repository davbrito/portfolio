import * as Ariakit from "@ariakit/react";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

const tooltipVariants = cva(
  "border-border z-50 rounded-md border px-2 py-1 text-xs shadow-md",
  {
    variants: {
      variant: {
        default: "bg-popover text-popover-foreground",
        subtle: "bg-background text-foreground/90",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

export interface TooltipProps extends VariantProps<typeof tooltipVariants> {
  content: ReactNode;
  placement?: Ariakit.TooltipStoreProps["placement"];
  /** Control opcional de apertura */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  anchorProps?: Ariakit.TooltipAnchorProps;
  tooltipProps?: Ariakit.TooltipProps;
}

export function Tooltip({
  content,
  children,
  placement,
  open,
  onOpenChange,
  variant,
  size,
  tooltipProps,
  anchorProps,
}: TooltipProps) {
  const store = Ariakit.useTooltipStore({
    placement: placement,
    open,
    setOpen: onOpenChange,
  });

  return (
    <>
      <Ariakit.TooltipAnchor store={store} {...anchorProps}>
        {children}
      </Ariakit.TooltipAnchor>
      <Ariakit.Tooltip
        store={store}
        {...tooltipProps}
        className={cn(
          tooltipVariants({ variant, size }),
          tooltipProps?.className,
        )}
      >
        {content}
      </Ariakit.Tooltip>
    </>
  );
}

export default Tooltip;
