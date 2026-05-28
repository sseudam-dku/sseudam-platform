import { cva, type VariantProps } from "class-variance-authority";
import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

const ctaVariants = cva("rounded-xl", {
  variants: {
    variant: {
      inline: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
      stacked: "flex flex-col gap-4",
      banner: "flex flex-col gap-4 border border-border bg-surface p-6 sm:p-8",
    },
  },
  defaultVariants: {
    variant: "stacked",
  },
});

export interface CTAProps extends VariantProps<typeof ctaVariants> {
  title: string;
  description?: string;
  action: ReactNode;
  className?: string;
}

export function CTA({ title, description, action, variant, className }: CTAProps) {
  return (
    <div className={cn(ctaVariants({ variant }), className)}>
      <div className="space-y-2">
        <h2 className="text-foreground text-lg font-semibold sm:text-xl">{title}</h2>
        {description ? (
          <p className="text-muted text-sm leading-6 sm:text-base">{description}</p>
        ) : null}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}
