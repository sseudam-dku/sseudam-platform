"use client";

import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

import { AppHeader } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";

export function TabsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isChatbot = pathname.startsWith("/chatbot");

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {!isChatbot && <AppHeader />}
      <div
        key={pathname}
        className="animate-page-enter flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
      {!isChatbot && <BottomNav />}
    </div>
  );
}
