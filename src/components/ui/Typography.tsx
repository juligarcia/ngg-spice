import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { match } from "ts-pattern";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "text-4xl font-extrabold tracking-tight",
      h2: "text-3xl font-semibold tracking-tight",
      h3: "text-2xl font-semibold tracking-tight",
      h4: "text-xl font-semibold tracking-tight",
      default: "",
      large: "text-lg font-semibold",
      small: "text-sm font-medium",
      xsmall: "text-xs font-medium"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

type HTMLTextElement = "h1" | "h2" | "h3" | "h4" | "p";

export interface TypographyProps
  extends React.AllHTMLAttributes<HTMLHeadingElement & HTMLParagraphElement>,
    VariantProps<typeof typographyVariants> {}

const Typography = React.forwardRef<
  HTMLHeadingElement | HTMLParagraphElement,
  TypographyProps
>(({ className, variant, size, ...props }, ref) => {
  const Element = match<typeof variant, HTMLTextElement>(variant)
    .with("h1", () => "h1")
    .with("h2", () => "h2")
    .with("h3", () => "h3")
    .with("h4", () => "h4")
    .otherwise(() => "p");

  return (
    <Element
      className={cn(typographyVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  );
});

Typography.displayName = "Typography";

export { Typography, typographyVariants };
