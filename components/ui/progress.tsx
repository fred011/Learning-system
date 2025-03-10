"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Define the progressVariants for styling
const progressVariants = cva("h-full w-full flex-1 transition-all", {
  variants: {
    variant: {
      default: "bg-sky-600",
      success: "bg-emerald-700",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// Define the ProgressProps interface
export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {}

// Combine ProgressProps with the props from ProgressPrimitive.Root
type CombinedProgressProps = ProgressProps &
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>;

function Progress({
  className,
  value = 0, // Ensure value defaults to 0 if undefined
  variant = "default",
  ...props
}: CombinedProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-gray-200",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full rounded-full transition-all",
          progressVariants({ variant })
        )}
        style={{ width: `${value}%` }} // Directly use width instead of transform
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
