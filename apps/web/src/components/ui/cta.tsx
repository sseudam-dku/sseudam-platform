import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface CTAProps {
  children: ReactNode;
  className?: string;
}

export function CTA({ children, className }: CTAProps) {
  return (
    <div
      className={cn(
        "rounded-16 body-3 flex w-full cursor-pointer flex-col items-center justify-center gap-4 bg-green-500 p-4 text-black hover:bg-green-600 active:bg-green-600",
        className,
      )}>
      {children}
    </div>
  );
}
