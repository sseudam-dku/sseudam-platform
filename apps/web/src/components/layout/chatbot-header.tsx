"use client";

import { ChevronLeft } from "lucide-react";

type ChatbotHeaderProps = {
  onBack: () => void;
};

export function ChatbotHeader({ onBack }: ChatbotHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center border-b border-neutral-200 bg-white px-2 pt-[env(safe-area-inset-top)]">
      <button
        type="button"
        onClick={onBack}
        aria-label="뒤로 가기"
        className="flex size-10 cursor-pointer items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700">
        <ChevronLeft className="size-6 cursor-pointer" strokeWidth={2} />
      </button>
    </header>
  );
}
