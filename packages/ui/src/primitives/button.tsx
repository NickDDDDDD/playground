import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { buttonVariants } from "./button-variants";

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  onPointerMove,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const handlePointerMove: React.PointerEventHandler<HTMLButtonElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    event.currentTarget.style.setProperty("--button-spotlight-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--button-spotlight-y", `${event.clientY - rect.top}px`);
    onPointerMove?.(event);
  };

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      onPointerMove={handlePointerMove}
      {...props}
    />
  );
}
