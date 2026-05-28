"use client";

import { Drawer } from "vaul";
import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface BottomSheetProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function BottomSheet({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  className,
}: BottomSheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="bg-foreground/40 fixed inset-0 z-50" />
        <Drawer.Content
          className={cn(
            "border-border bg-surface fixed inset-x-0 bottom-0 z-50 mt-24 flex max-h-[85dvh] flex-col rounded-t-2xl border outline-none",
            className,
          )}>
          <div className="bg-border mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full" />
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            {(title || description) && (
              <div className="mb-4 space-y-1">
                {title ? (
                  <Drawer.Title className="text-foreground text-lg font-semibold">
                    {title}
                  </Drawer.Title>
                ) : null}
                {description ? (
                  <Drawer.Description className="text-muted text-sm">
                    {description}
                  </Drawer.Description>
                ) : null}
              </div>
            )}
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
            {footer ? (
              <div className="border-border mt-4 shrink-0 border-t pt-4">{footer}</div>
            ) : null}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
