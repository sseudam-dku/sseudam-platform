import { type ReactNode } from "react";

import { AppHeader } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AppHeader />
      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      <BottomNav />
    </div>
  );
}
