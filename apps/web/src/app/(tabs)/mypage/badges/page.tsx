"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/cn";

const BADGES = [
  { id: "1", name: "첫 분리배출", emoji: "♻️", earned: true },
  { id: "2", name: "플라스틱 마스터", emoji: "🧴", earned: true },
  { id: "3", name: "종이 달인", emoji: "📦", earned: false },
  { id: "4", name: "유리 전문가", emoji: "🍶", earned: false },
  { id: "5", name: "캔 헌터", emoji: "🥫", earned: false },
  { id: "6", name: "환경 지킴이", emoji: "🌱", earned: false },
  { id: "7", name: "챗봇 친구", emoji: "🤖", earned: true },
  { id: "8", name: "카메라 탐정", emoji: "📷", earned: false },
  { id: "9", name: "동네 영웅", emoji: "🦸", earned: false },
];

const BackIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
};

const Page = () => {
  const router = useRouter();

  return (
    <div className="scrollbar-hide flex-1 overflow-y-auto bg-neutral-100">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => router.back()}
            className="flex size-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-200">
            <BackIcon />
          </button>
          <span className="head-5 text-neutral-900">나의 뱃지</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {BADGES.map(badge => (
            <div
              key={badge.id}
              className={cn(
                "rounded-12 flex flex-col items-center gap-2 p-4",
                badge.earned ? "bg-white shadow-sm" : "bg-neutral-50 opacity-50 grayscale",
              )}>
              <span className="head-1">{badge.emoji}</span>
              <span
                className={cn(
                  "body-5 text-center",
                  badge.earned ? "text-neutral-800" : "text-neutral-400",
                )}>
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
