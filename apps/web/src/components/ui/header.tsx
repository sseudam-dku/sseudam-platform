"use client";

import { ChevronLeft } from "lucide-react";
import { type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export interface HeaderProps {
  title: string;
  onBack?: () => void;
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}

export function Header({ title, onBack, left, right, className }: HeaderProps) {
  const leftContent =
    left !== undefined ? (
      left
    ) : onBack ? (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="size-11 min-w-11 px-0"
        onClick={onBack}
        aria-label="뒤로 가기">
        <ChevronLeft className="size-5" />
      </Button>
    ) : (
      <div className="size-11 shrink-0" aria-hidden="true" />
    );

  return (
    <header
      className={cn(
        "border-border bg-surface/95 supports-[backdrop-filter]:bg-surface/80 sticky top-0 z-40 flex h-14 items-center gap-2 border-b px-2 backdrop-blur",
        "pt-[env(safe-area-inset-top)]",
        className,
      )}>
      <div className="flex w-11 shrink-0 items-center justify-start">{leftContent}</div>
      <h1 className="text-foreground min-w-0 flex-1 truncate text-center text-base font-semibold">
        {title}
      </h1>
      <div className="flex w-11 shrink-0 items-center justify-end">
        {right ?? <div className="size-11 shrink-0" aria-hidden="true" />}
      </div>
    </header>
  );
}
