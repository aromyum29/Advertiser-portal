// @ts-nocheck
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "./utils";

const getBadgeClasses = (variant: string): string => {
  switch (variant) {
    case 'successful':
    case 'green':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'pending':
    case 'yellow':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
    case 'cancelled':
      return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400'
    case 'refunded':
    case 'blue':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'failed':
    case 'destructive':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    case 'purple':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    default:
      return 'bg-primary/10 text-primary dark:bg-primary/20'
  }
}

function Badge({
  className,
  variant = "default",
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: string
  style?: string
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="badge"
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors",
        getBadgeClasses(variant),
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

// Stub for backward compatibility with any import of badgeVariants
const badgeVariants = (_props?: unknown) => "";

export { Badge, badgeVariants };
