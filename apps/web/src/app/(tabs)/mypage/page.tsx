"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Leaf } from "lucide-react";

import { IconUser } from "@/components/icons/user";
import { GoogleLoginButton } from "@/components/ui/social-login-button";
import { cn } from "@/lib/cn";
import { BADGES, ACTIVITY } from "@/data/mock";

type MypageView = "main" | "points" | "badges";

interface MainViewProps {
  onNavigate: (view: MypageView) => void;
  onLogout: () => void;
}

const MainView = ({ onNavigate, onLogout }: MainViewProps) => {
  const earnedBadgesCount = BADGES.filter(b => b.earned).length;

  return (
    <div className="animate-page-enter flex flex-1 flex-col gap-4 p-4">
      {/* 프로필 카드 */}
      <div className="rounded-20 flex items-center gap-4 border border-neutral-100/50 bg-white p-5 shadow-sm">
        <div className="flex size-14 items-center justify-center rounded-full bg-neutral-100">
          <IconUser className="size-7 text-neutral-400" />
        </div>
        <div>
          <p className="head-4 text-neutral-900">닉네임</p>
          <p className="body-5 mt-0.5 text-neutral-400">sseudam@dku.edu</p>
        </div>
      </div>

      {/* 나의 포인트 카드 */}
      <div
        onClick={() => onNavigate("points")}
        className="group rounded-20 flex cursor-pointer items-center justify-between border border-neutral-100/50 bg-white p-5 shadow-sm transition-all duration-200 hover:bg-neutral-50 active:scale-[0.98]">
        <div className="flex flex-col gap-1">
          <span className="body-5 tracking-wider text-neutral-400 uppercase">나의 포인트</span>
          <span className="head-2 text-neutral-900">250 P</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-full bg-green-50 text-green-500 transition-colors group-hover:bg-green-100">
            <Leaf className="size-6" />
          </div>
          <ChevronRight className="size-5 text-neutral-300 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* 나의 뱃지 카드 */}
      <div
        onClick={() => onNavigate("badges")}
        className="group rounded-20 flex cursor-pointer flex-col gap-4 border border-neutral-100/50 bg-white p-5 shadow-sm transition-all duration-200 hover:bg-neutral-50 active:scale-[0.98]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="body-5 tracking-wider text-neutral-400 uppercase">나의 뱃지</span>
            <span className="body-4 text-neutral-500">획득한 뱃지 {earnedBadgesCount}개</span>
          </div>
          <ChevronRight className="size-5 text-neutral-300 transition-transform group-hover:translate-x-0.5" />
        </div>

        {/* 뱃지 미리보기 리스트 (가운데 정렬) */}
        <div className="flex justify-center gap-3">
          {BADGES.slice(0, 6).map(badge => (
            <div
              key={badge.id}
              className={cn(
                "rounded-12 head-3 flex size-11 items-center justify-center border border-neutral-100/30 bg-neutral-50 shadow-sm",
                !badge.earned && "opacity-35 grayscale",
              )}
              title={badge.name}>
              {badge.emoji}
            </div>
          ))}
        </div>
      </div>

      {/* 로그아웃 버튼 */}
      <div className="mt-2 flex justify-center py-4">
        <button
          onClick={onLogout}
          className="body-5 cursor-pointer text-neutral-400 underline decoration-neutral-300 transition-colors hover:text-neutral-600 active:text-neutral-600">
          로그아웃
        </button>
      </div>
    </div>
  );
};

interface PointsViewProps {
  onBack: () => void;
}

const PointsView = ({ onBack }: PointsViewProps) => {
  return (
    <div className="animate-page-enter flex flex-1 flex-col overflow-hidden bg-neutral-100">
      {/* 헤더 */}
      <div className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4">
        <button
          onClick={onBack}
          className="flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-neutral-100 active:scale-95"
          aria-label="뒤로 가기">
          <ChevronLeft className="size-6 text-neutral-700" />
        </button>
        <h1 className="head-5 text-neutral-900">나의 포인트</h1>
        <div className="size-10" />
      </div>

      {/* 본문 콘텐츠 스크롤 영역 */}
      <div className="scrollbar-hide flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {/* 총 포인트 대형 카드 */}
        <div className="rounded-20 flex items-center justify-between border border-neutral-100/50 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="body-5 tracking-wider text-neutral-400 uppercase">총 포인트</span>
            <span className="head-1 text-neutral-900">250 P</span>
            <span className="body-5 mt-1 text-neutral-500">누적 65 포인트 획득</span>
          </div>
          <div className="flex size-16 items-center justify-center rounded-full bg-green-50 text-green-500 shadow-inner">
            <Leaf className="size-8" />
          </div>
        </div>

        {/* 상세 적립 내역 */}
        <div className="flex flex-col gap-3">
          <h2 className="body-5 px-1 tracking-widest text-neutral-400 uppercase">상세 적립 내역</h2>
          <div className="rounded-20 overflow-hidden border border-neutral-100/50 bg-white shadow-sm">
            {ACTIVITY.map((item, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center justify-between px-5 py-4 transition-colors hover:bg-neutral-50",
                  i < ACTIVITY.length - 1 && "border-b border-neutral-100",
                )}>
                <div className="flex items-center gap-3.5">
                  <div className="head-4 flex size-10 items-center justify-center rounded-full bg-green-50">
                    ♻️
                  </div>
                  <div>
                    <p className="body-3 text-neutral-800">{item.category}</p>
                    <p className="body-5 mt-0.5 text-neutral-400">{item.date}</p>
                  </div>
                </div>
                <span className="body-3 text-green-500">+{item.points}P</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface BadgesViewProps {
  onBack: () => void;
}

const BadgesView = ({ onBack }: BadgesViewProps) => {
  return (
    <div className="animate-page-enter flex flex-1 flex-col overflow-hidden bg-neutral-100">
      {/* 헤더 */}
      <div className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4">
        <button
          onClick={onBack}
          className="flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-neutral-100 active:scale-95"
          aria-label="뒤로 가기">
          <ChevronLeft className="size-6 text-neutral-700" />
        </button>
        <h1 className="head-5 text-neutral-900">나의 뱃지</h1>
        <div className="size-10" />
      </div>

      {/* 본문 콘텐츠 스크롤 영역 */}
      <div className="scrollbar-hide flex flex-1 flex-col overflow-y-auto p-4">
        <div className="my-auto flex flex-wrap justify-center gap-4">
          {BADGES.map(badge => (
            <div
              key={badge.id}
              className={cn(
                "rounded-20 flex min-h-48 w-[calc(50%-var(--spacing-2))] min-w-35 flex-col items-center justify-between gap-3 border bg-white px-4 py-6 shadow-sm transition-all duration-200 hover:shadow-md",
                badge.earned
                  ? "border-green-100 text-neutral-900"
                  : "border-neutral-100 bg-neutral-50/50 text-neutral-400 opacity-40 grayscale",
              )}>
              <div className="head-1 flex size-14 items-center justify-center rounded-full bg-neutral-50 shadow-inner">
                {badge.emoji}
              </div>
              <div className="flex flex-col gap-1 text-center">
                <p className="body-4 leading-tight">{badge.name}</p>
                <p className="body-5 leading-tight break-keep text-neutral-400">
                  {badge.description}
                </p>
                <div className="mt-1 flex items-center justify-center gap-1.5">
                  <span className="body-5 shrink-0 rounded bg-green-50 px-1.5 py-0.5 text-green-600">
                    {badge.reward}
                  </span>
                  <span className="body-5 shrink-0 text-neutral-400">
                    {badge.earned ? "획득 완료" : "미획득"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [view, setView] = useState<MypageView>("main");

  if (!isLoggedIn) {
    return (
      <div className="animate-page-enter flex flex-1 flex-col gap-4 bg-neutral-100 p-4">
        <div className="rounded-20 flex flex-col items-center gap-4 border border-neutral-100/50 bg-white py-12 shadow-sm">
          <div className="flex size-20 items-center justify-center rounded-full bg-neutral-100">
            <IconUser className="size-10 text-neutral-300" />
          </div>
          <div className="text-center">
            <p className="head-4 text-neutral-900">로그인하고</p>
            <p className="body-4 mt-1 text-neutral-500">포인트와 뱃지를 모아보세요</p>
          </div>
        </div>
        <div onClick={() => setIsLoggedIn(true)} className="cursor-pointer">
          <GoogleLoginButton size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="scrollbar-hide flex flex-1 flex-col overflow-hidden bg-neutral-100">
      {view === "main" && (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="scrollbar-hide flex-1 overflow-y-auto">
            <MainView onNavigate={v => setView(v)} onLogout={() => setIsLoggedIn(false)} />
          </div>
        </div>
      )}

      {view === "points" && <PointsView onBack={() => setView("main")} />}

      {view === "badges" && <BadgesView onBack={() => setView("main")} />}
    </div>
  );
};

export default Page;
