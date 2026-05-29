"use client";

import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface HeaderProps {
  title?: ReactNode;
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
      <button
        type="button"
        onClick={onBack}
        aria-label="뒤로 가기"
        className="flex size-11 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
    ) : (
      <div className="size-11 shrink-0" aria-hidden="true" />
    );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-neutral-200 bg-neutral-50/95 px-1.5 backdrop-blur supports-backdrop-filter:bg-neutral-50/80",
        "pt-[env(safe-area-inset-top)]",
        className,
      )}>
      <div className="flex w-11 shrink-0 items-center justify-start">{leftContent}</div>
      <div className="head-5 min-w-0 flex-1 truncate text-center text-neutral-900">{title}</div>
      <div className="flex w-11 shrink-0 items-center justify-end">
        {right ?? <div className="size-11 shrink-0" aria-hidden="true" />}
      </div>
    </header>
  );
}
