"use client";

import { Search, X } from "lucide-react";
import { type FormEvent, type InputHTMLAttributes, forwardRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export interface SearchBarProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "readOnly" | "onSubmit"
> {
  onClear?: () => void;
  onSearch?: (value: string) => void;
  readOnly?: boolean;
  onReadOnlyClick?: () => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      value,
      onChange,
      onClear,
      onSearch,
      readOnly = false,
      onReadOnlyClick,
      placeholder = "검색",
      ...props
    },
    ref,
  ) => {
    const stringValue = typeof value === "string" ? value : "";
    const hasValue = stringValue.length > 0;

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      onSearch?.(stringValue);
    }

    function handleClear() {
      onClear?.();
    }

    if (readOnly) {
      return (
        <button
          type="button"
          onClick={onReadOnlyClick}
          className={cn(
            "border-border bg-surface text-muted flex h-11 w-full items-center gap-2 rounded-lg border px-3 text-left text-sm",
            className,
          )}>
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <span>{placeholder}</span>
        </button>
      );
    }

    return (
      <form
        onSubmit={handleSubmit}
        className={cn(
          "border-border bg-surface flex h-11 items-center gap-2 rounded-lg border px-3",
          className,
        )}
        role="search">
        <Search className="text-muted size-4 shrink-0" aria-hidden="true" />
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="text-foreground placeholder:text-muted min-w-0 flex-1 bg-transparent text-sm outline-none"
          {...props}
        />
        {hasValue ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="size-8 min-h-8 min-w-8 px-0"
            onClick={handleClear}
            aria-label="검색어 지우기">
            <X className="size-4" />
          </Button>
        ) : null}
      </form>
    );
  },
);

SearchBar.displayName = "SearchBar";
