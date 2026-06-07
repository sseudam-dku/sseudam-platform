import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-between px-6 pt-[env(safe-area-inset-top)] pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
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

      <Button size="lg" className="w-full" asChild>
        <Link href="/" replace>
          확인
        </Link>
      </Button>
    </main>
  );
};

export default page;
