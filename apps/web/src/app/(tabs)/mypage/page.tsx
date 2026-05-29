"use client";

import { useState } from "react";

import { IconUser } from "@/components/icons/user";
import { Button } from "@/components/ui/button";
import { GoogleLoginButton } from "@/components/ui/social-login-button";
import { cn } from "@/lib/cn";

type Tab = "stats" | "badges" | "activity";

const STATS = [
  { label: "분리배출", value: "24회", color: "text-green-500" },
  { label: "획득 포인트", value: "250P", color: "text-amber-500" },
  { label: "이번 달", value: "8회", color: "text-blue-500" },
  { label: "연속 달성", value: "3일", color: "text-rose-500" },
];

const CATEGORIES = [
  { name: "플라스틱", percent: 45, color: "bg-orange-400" },
  { name: "종이·박스", percent: 30, color: "bg-blue-400" },
  { name: "캔·금속", percent: 15, color: "bg-yellow-400" },
  { name: "유리", percent: 10, color: "bg-teal-400" },
];

const BADGES = [
  { id: "1", name: "첫 분리배출", emoji: "♻️", earned: true },
  { id: "2", name: "플라스틱 마스터", emoji: "🧴", earned: true },
  { id: "3", name: "챗봇 친구", emoji: "🤖", earned: true },
  { id: "4", name: "연속 7일", emoji: "🔥", earned: false },
  { id: "5", name: "종이 마스터", emoji: "📦", earned: false },
  { id: "6", name: "캔 마스터", emoji: "🥫", earned: false },
];

const ACTIVITY = [
  { date: "2024.05.28", category: "플라스틱 분리배출", points: 10 },
  { date: "2024.05.27", category: "종이·박스 분리배출", points: 10 },
  { date: "2024.05.26", category: "캔·금속 분리배출", points: 15 },
  { date: "2024.05.25", category: "유리 분리배출", points: 20 },
  { date: "2024.05.24", category: "플라스틱 분리배출", points: 10 },
];

const isLoggedIn = false;

function StatsContent() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {STATS.map(stat => (
          <div key={stat.label} className="rounded-16 flex flex-col gap-1 bg-white p-4 shadow-sm">
            <span className={cn("head-4", stat.color)}>{stat.value}</span>
            <span className="body-5 text-neutral-400">{stat.label}</span>
          </div>
        ))}
      </div>
      <div className="rounded-16 bg-white p-4 shadow-sm">
        <p className="body-5 mb-3 font-semibold tracking-widest text-neutral-400 uppercase">
          카테고리별 분리배출
        </p>
        <div className="flex flex-col gap-3">
          {CATEGORIES.map(cat => (
            <div key={cat.name} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="body-4 text-neutral-700">{cat.name}</span>
                <span className="body-5 text-neutral-400">{cat.percent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                <div
                  className={cn("h-full rounded-full", cat.color)}
                  style={{ width: `${cat.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BadgesContent() {
  const earned = BADGES.filter(b => b.earned);
  const locked = BADGES.filter(b => !b.earned);
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-16 bg-white p-4 shadow-sm">
        <p className="body-5 mb-3 font-semibold tracking-widest text-neutral-400 uppercase">
          획득한 뱃지 {earned.length}
        </p>
        <div className="grid grid-cols-3 gap-3">
          {earned.map(badge => (
            <div
              key={badge.id}
              className="rounded-12 flex flex-col items-center gap-2 bg-neutral-50 py-4">
              <span className="text-3xl">{badge.emoji}</span>
              <span className="body-5 text-center text-neutral-600">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-16 bg-white p-4 shadow-sm">
        <p className="body-5 mb-3 font-semibold tracking-widest text-neutral-400 uppercase">
          미획득 뱃지
        </p>
        <div className="grid grid-cols-3 gap-3">
          {locked.map(badge => (
            <div
              key={badge.id}
              className="rounded-12 flex flex-col items-center gap-2 bg-neutral-50 py-4 opacity-40 grayscale">
              <span className="text-3xl">{badge.emoji}</span>
              <span className="body-5 text-center text-neutral-600">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityContent() {
  return (
    <div className="rounded-16 bg-white shadow-sm">
      {ACTIVITY.map((item, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center justify-between px-4 py-3",
            i < ACTIVITY.length - 1 && "border-b border-neutral-100",
          )}>
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-green-100 text-lg">
              ♻️
            </div>
            <div>
              <p className="body-4 font-medium text-neutral-800">{item.category}</p>
              <p className="body-5 text-neutral-400">{item.date}</p>
            </div>
          </div>
          <span className="body-5 font-semibold text-green-500">+{item.points}P</span>
        </div>
      ))}
    </div>
  );
}

export default function MyPage() {
  const [tab, setTab] = useState<Tab>("stats");

  if (!isLoggedIn) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="rounded-16 flex flex-col items-center gap-4 bg-white py-10 shadow-sm">
          <div className="flex size-20 items-center justify-center rounded-full bg-neutral-100">
            <IconUser className="size-10 text-neutral-300" />
          </div>
          <div className="text-center">
            <p className="body-3 text-neutral-900">로그인하고</p>
            <p className="body-4 text-neutral-500">포인트와 뱃지를 모아보세요</p>
          </div>
        </div>
        <GoogleLoginButton size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-neutral-100">
      <div className="flex flex-col items-center gap-2 bg-white px-4 pt-6 pb-4">
        <div className="relative flex w-full justify-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-neutral-100">
            <IconUser className="size-10 text-neutral-300" />
          </div>
          <button className="absolute top-0 right-0 text-neutral-400 hover:text-neutral-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
              <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
            </svg>
          </button>
        </div>
        <p className="head-5 text-neutral-900">닉네임</p>
      </div>

      <div className="flex border-b border-neutral-200 bg-white">
        {(["stats", "badges", "activity"] as Tab[]).map(t => {
          const labels: Record<Tab, string> = { stats: "통계", badges: "뱃지", activity: "활동" };
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "body-5 flex-1 py-3 font-semibold tracking-wider transition-colors",
                tab === t ? "border-b-2 border-green-500 text-green-500" : "text-neutral-400",
              )}>
              {labels[t].toUpperCase()}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 p-4">
        {tab === "stats" && <StatsContent />}
        {tab === "badges" && <BadgesContent />}
        {tab === "activity" && <ActivityContent />}
        <Button variant="outline" size="md" className="w-full text-neutral-500">
          로그아웃
        </Button>
      </div>
    </div>
  );
}
