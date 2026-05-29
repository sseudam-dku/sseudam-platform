import Link from "next/link";

import { GoogleLoginButton } from "@/components/ui/social-login-button";

export default function OnboardingPage() {
  return (
    <main className="flex min-h-dvh flex-col px-6 pt-[env(safe-area-inset-top)] pb-10">
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <div className="rounded-20 flex size-20 items-center justify-center bg-green-500">
          <span className="text-3xl">♻️</span>
        </div>
        <div className="mt-2 flex flex-col gap-1">
          <h1 className="head-1 text-neutral-900">쓰담</h1>
          <p className="body-2 text-neutral-500">우리 동네 맞춤 분리배출 가이드</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <GoogleLoginButton size="lg" />
        <Link
          href="/onboarding/location"
          className="body-2 text-center text-neutral-400 underline-offset-4 hover:underline">
          비회원으로 시작하기
        </Link>
      </div>
    </main>
  );
}
