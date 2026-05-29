"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { IconCamera } from "@/components/icons/camera";
import { IconCategory } from "@/components/icons/category";
import { IconChatbot } from "@/components/icons/chatbot";
import { IconHome } from "@/components/icons/home";
import { IconUser } from "@/components/icons/user";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { href: "/", label: "홈", icon: <IconHome /> },
  { href: "/category", label: "카테고리", icon: <IconCategory /> },
  { href: "/camera", label: "카메라", icon: <IconCamera /> },
  { href: "/chatbot", label: "챗봇", icon: <IconChatbot /> },
  { href: "/mypage", label: "마이페이지", icon: <IconUser /> },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="z-40 flex shrink-0 border-t border-neutral-200 bg-neutral-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      {NAV_ITEMS.map(item => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "body-5 flex min-h-11 flex-1 flex-col items-center justify-center gap-1 py-2",
              isActive ? "font-semibold text-green-500" : "text-neutral-400",
            )}>
            <span className="size-6 [&>svg]:size-6">{item.icon}</span>
            <span className="body-5 w-full truncate text-center">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
