"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import iconPoint from "@/assets/icon-point.svg";
import { Header } from "@/components/ui/header";
import { usePointHistory, useUserStats } from "@/lib/query/hooks";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { cn } from "@/lib/cn";

const Page = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const { data: history = [] } = usePointHistory(isLoggedIn);
  const { data: stats } = useUserStats(isLoggedIn);

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-neutral-100">
      <Header title="나의 포인트" onBack={() => router.back()} />

      <div className="scrollbar-hide flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="rounded-20 flex items-center justify-between border border-neutral-100/50 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="body-5 tracking-wider text-neutral-400 uppercase">총 포인트</span>
            <span className="head-1 text-neutral-900">{stats?.totalPoints ?? 0} P</span>
            <span className="body-5 mt-1 text-neutral-500">
              이번 달 {stats?.monthlyRecords ?? 0}회 분리배출
            </span>
          </div>
          <Image src={iconPoint} alt="포인트" width={48} height={48} />
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="body-5 px-1 tracking-widest text-neutral-400 uppercase">상세 적립 내역</h2>
          <div className="rounded-20 overflow-hidden border border-neutral-100/50 bg-white shadow-sm">
            {history.length === 0 ? (
              <p className="body-4 p-5 text-center text-neutral-400">적립 내역이 없습니다.</p>
            ) : (
              history.map((item, i) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center justify-between px-5 py-4 transition-colors hover:bg-neutral-50",
                    i < history.length - 1 && "border-b border-neutral-100",
                  )}>
                  <div className="flex items-center gap-3.5">
                    <Image
                      src={iconPoint}
                      alt="포인트"
                      width={28}
                      height={28}
                      className="shrink-0"
                    />
                    <div>
                      <p className="body-3 text-neutral-800">{item.category}</p>
                      <p className="body-5 mt-0.5 text-neutral-400">{item.date}</p>
                    </div>
                  </div>
                  <span className="body-3 text-green-500">+{item.points}P</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
