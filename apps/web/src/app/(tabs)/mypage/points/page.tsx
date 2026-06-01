"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/cn";

const POINT_HISTORY = [
  { date: "2025.05.23", label: "플라스틱", points: 100 },
  { date: "2025.04.22", label: "종이박스", points: 100 },
  { date: "2025.04.09", label: "캔·고철", points: 50 },
];

function BackIcon() {
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
}

export default function PointsPage() {
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
          <span className="head-5 text-neutral-900">나의 포인트</span>
        </div>

        <div className="rounded-16 bg-white p-4 shadow-sm">
          <p className="body-5 text-neutral-400">총 포인트</p>
          <p className="head-3 mt-1 text-neutral-900">250 P</p>
        </div>

        <div className="rounded-16 bg-white shadow-sm">
          {POINT_HISTORY.map((item, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center justify-between px-4 py-3",
                i < POINT_HISTORY.length - 1 && "border-b border-neutral-100",
              )}>
              <div>
                <p className="body-3 text-neutral-900">{item.label}</p>
                <p className="body-5 text-neutral-400">{item.date}</p>
              </div>
              <span className="body-3 font-semibold text-green-500">+{item.points}P</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
