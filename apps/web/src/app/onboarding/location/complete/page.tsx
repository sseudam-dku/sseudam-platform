"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function LocationCompletePage() {
  const router = useRouter();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-between px-6 pt-[env(safe-area-inset-top)] pb-10">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <CheckCircle2 className="size-20 text-green-500" strokeWidth={1.5} />
        <div className="flex flex-col gap-2">
          <h1 className="head-2 text-neutral-900">위치 설정 완료</h1>
          <p className="body-2 text-neutral-500">
            우리 동네 맞춤 분리배출 가이드를
            <br />
            시작하세요!
          </p>
        </div>
      </div>

      <Button size="lg" className="w-full" onClick={() => router.push("/")}>
        확인
      </Button>
    </main>
  );
}
