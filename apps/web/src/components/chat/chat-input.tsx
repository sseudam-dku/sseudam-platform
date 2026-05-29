"use client";

import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";

import { IconArrowUp } from "@/components/icons/arrow-up";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "메시지를 입력하세요",
  className,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [value, resizeTextarea]);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div
      className={cn(
        "border-t border-neutral-200 bg-neutral-50 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
        className,
      )}>
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={event => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="rounded-12 body-2 max-h-[120px] min-h-12 flex-1 resize-none bg-neutral-100 px-4 py-3 text-neutral-900 outline-none placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-50"
        />
        <Button
          type="button"
          size="md"
          className="size-12 min-w-12 shrink-0 rounded-full px-0"
          disabled={!canSend}
          onClick={handleSend}
          aria-label="메시지 보내기">
          <IconArrowUp className="size-5" />
        </Button>
      </div>
    </div>
  );
}
