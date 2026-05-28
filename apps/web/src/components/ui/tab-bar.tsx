"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface TabBarItem {
  id: string;
  label: string;
  icon?: ReactNode;
  content?: ReactNode;
}

export interface TabBarProps {
  items: TabBarItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: "bottom" | "top";
  className?: string;
}

export function TabBar({
  items,
  defaultValue,
  value,
  onValueChange,
  variant = "bottom",
  className,
}: TabBarProps) {
  const defaultTab = defaultValue ?? items[0]?.id;

  return (
    <Tabs.Root
      defaultValue={defaultTab}
      value={value}
      onValueChange={onValueChange}
      className={cn(variant === "bottom" && "flex min-h-0 flex-1 flex-col", className)}>
      <Tabs.List
        className={cn(
          variant === "bottom" &&
            "border-border bg-surface fixed inset-x-0 bottom-0 z-40 flex border-t pb-[env(safe-area-inset-bottom)]",
          variant === "top" &&
            "border-border bg-surface-muted inline-flex gap-1 rounded-lg border p-1",
        )}
        aria-label="탭 목록">
        {items.map(item => (
          <Tabs.Trigger
            key={item.id}
            value={item.id}
            className={cn(
              "text-muted focus-visible:ring-ring flex min-h-11 flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
              variant === "bottom" &&
                "data-[state=active]:text-primary data-[state=active]:after:bg-primary relative py-2 data-[state=active]:after:absolute data-[state=active]:after:top-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-10 data-[state=active]:after:rounded-full",
              variant === "top" &&
                "data-[state=active]:bg-surface data-[state=active]:text-foreground rounded-md px-4 py-2 data-[state=active]:shadow-sm",
            )}>
            {item.icon ? <span className="size-5 [&>svg]:size-5">{item.icon}</span> : null}
            <span>{item.label}</span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {items.some(item => item.content) ? (
        <div
          className={cn(
            variant === "bottom" && "flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))]",
          )}>
          {items.map(item =>
            item.content ? (
              <Tabs.Content key={item.id} value={item.id} className="outline-none">
                {item.content}
              </Tabs.Content>
            ) : null,
          )}
        </div>
      ) : null}
    </Tabs.Root>
  );
}
