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
      {items.some(item => item.content) ? (
        <div className="flex flex-1 flex-col overflow-hidden">
          {items.map(item =>
            item.content ? (
              <Tabs.Content
                key={item.id}
                value={item.id}
                className="flex flex-1 flex-col overflow-hidden outline-none">
                {item.content}
              </Tabs.Content>
            ) : null,
          )}
        </div>
      ) : null}

      <Tabs.List
        className={cn(
          variant === "bottom" &&
            "z-40 flex shrink-0 border-t border-neutral-200 bg-neutral-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur",
          variant === "top" && "rounded-12 inline-flex gap-1 bg-neutral-100 p-1",
        )}
        aria-label="탭 목록">
        {items.map(item => (
          <Tabs.Trigger
            key={item.id}
            value={item.id}
            className={cn(
              "flex min-h-11 flex-1 flex-col items-center justify-center gap-1 text-neutral-400 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none",
              variant === "bottom" &&
                "body-5 py-2 data-[state=active]:font-semibold data-[state=active]:text-green-500",
              variant === "top" &&
                "rounded-8 body-4 px-4 py-2 data-[state=active]:bg-neutral-50 data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm",
            )}>
            {item.icon ? <span className="size-6 [&>svg]:size-6">{item.icon}</span> : null}
            <span className="w-full truncate text-center">{item.label}</span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
