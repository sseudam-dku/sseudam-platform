"use client";

import { Camera, FileText, Home, MessageSquareText, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const LEFT_NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "홈",
    icon: <Home />,
  },
  {
    href: "/chatbot",
    label: "챗봇",
    icon: <MessageSquareText />,
  },
];

const RIGHT_NAV_ITEMS: NavItem[] = [
  {
    href: "/records",
    label: "최근기록",
    icon: <FileText />,
  },
  {
    href: "/mypage",
    label: "마이페이지",
    icon: <User />,
  },
];

function NavItemLink({ item, active }: { item: NavItem; active: boolean }) {
  const colorClass = active ? "text-neutral-600" : "text-neutral-400";

  return (
    <Link
      href={item.href}
      prefetch={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "body-5 flex min-h-13 flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors",
        colorClass,
        active ? "" : "",
      )}>
      <span className={cn("size-8 [&>svg]:size-8", colorClass)}>{item.icon}</span>
      <span className={cn("body-5 w-full truncate text-center", colorClass, active && "")}>
        {item.label}
      </span>
    </Link>
  );
}

function isNavActive(pathname: string, href: string) {
  const current = pathname.replace(/\/$/, "") || "/";
  const target = href.replace(/\/$/, "") || "/";

  if (target === "/") {
    return current === "/";
  }

  return current === target || current.startsWith(`${target}/`);
}

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => isNavActive(pathname, href);

  const isCameraActive = isActive("/camera");

  return (
    <nav className="rounded-t-20 relative z-40 shrink-0 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px] shadow-neutral-900/10">
      <div className="flex items-end">
        {LEFT_NAV_ITEMS.map(item => (
          <NavItemLink key={item.href} item={item} active={isActive(item.href)} />
        ))}

        <div aria-hidden="true" className="w-22 shrink-0" />

        {RIGHT_NAV_ITEMS.map(item => (
          <NavItemLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </div>

      <Link
        href="/camera"
        prefetch={false}
        aria-label="카메라"
        onClick={e => {
          if (isCameraActive) {
            e.preventDefault();
            window.location.href = "/camera";
          }
        }}
        className={cn(
          "absolute top-3 left-1/2 flex size-18 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-green-500 text-white shadow-md",
          isCameraActive && "ring-2 ring-green-500/40 ring-offset-2",
        )}>
        <Camera className="size-8" />
      </Link>
    </nav>
  );
}
