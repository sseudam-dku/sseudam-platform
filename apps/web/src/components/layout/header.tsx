"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";

import { useLocationStore } from "@/lib/store/use-location-store";

const AppHeader = () => {
  const { location } = useLocationStore();

  return (
    <header className="flex h-14 shrink-0 items-center justify-end border-b border-neutral-200 bg-neutral-50/95 px-4 pt-[env(safe-area-inset-top)] backdrop-blur supports-backdrop-filter:bg-neutral-50/80">
      <Link href="/onboarding/location" className="flex items-center gap-1">
        <MapPin className="size-4 text-green-500" strokeWidth={2.5} />
        <span className="body-4 text-neutral-500">{location}</span>
      </Link>
    </header>
  );
};

export { AppHeader };
