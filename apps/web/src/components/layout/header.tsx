import { MapPin } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-end border-b border-neutral-200 bg-neutral-50/95 px-4 pt-[env(safe-area-inset-top)] backdrop-blur supports-backdrop-filter:bg-neutral-50/80">
      <div className="flex items-center gap-1">
        <MapPin className="size-4 text-green-500" strokeWidth={2.5} />
        <span className="body-4 text-neutral-500">서울 마포구</span>
      </div>
    </header>
  );
}
