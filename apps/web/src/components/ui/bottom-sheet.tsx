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
        <Drawer.Overlay className="fixed inset-0 z-50 bg-neutral-900/40" />
        <Drawer.Content
          className={cn(
            "rounded-t-20 fixed inset-x-0 bottom-0 z-50 mt-24 flex max-h-[85dvh] flex-col bg-neutral-50 outline-none",
            className,
          )}>
          <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-neutral-300" />
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            {(title || description) && (
              <div className="mb-4 space-y-1">
                {title ? (
                  <Drawer.Title className="head-4 text-neutral-900">{title}</Drawer.Title>
                ) : null}
                {description ? (
                  <Drawer.Description className="body-4 text-neutral-400">
                    {description}
                  </Drawer.Description>
                ) : null}
              </div>
            )}
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
            {footer ? (
              <div className="mt-4 shrink-0 border-t border-neutral-200 pt-4">{footer}</div>
            ) : null}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
