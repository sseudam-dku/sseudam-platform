"use client";

import { Search, X } from "lucide-react";
import { type FormEvent, type InputHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/cn";

export interface SearchBarProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "readOnly" | "onSubmit"
> {
  onClear?: () => void;
  onSearch?: (value: string) => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, value, onChange, onClear, onSearch, placeholder = "검색", ...props }, ref) => {
    const stringValue = typeof value === "string" ? value : "";
    const hasValue = stringValue.length > 0;

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      onSearch?.(stringValue);
    }

    return (
      <form
        onSubmit={handleSubmit}
        className={cn(
          "rounded-12 flex h-12 items-center gap-2 border border-neutral-300 bg-white px-4 focus-within:ring-1 focus-within:ring-green-500",
          className,
        )}
        role="search">
        <Search className="size-4 shrink-0 text-green-500" aria-hidden="true" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="body-2 min-w-0 flex-1 bg-transparent text-neutral-900 outline-none placeholder:text-neutral-400"
          {...props}
        />
        {hasValue ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="삭제"
            className="rounded-8 flex cursor-pointer items-center justify-center text-neutral-400 hover:text-neutral-500 active:text-neutral-500">
            <X className="size-4" />
          </button>
        ) : null}
      </form>
    );
  },
);

SearchBar.displayName = "SearchBar";
