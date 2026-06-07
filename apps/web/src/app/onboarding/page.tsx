"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { GoogleLoginButton } from "@/components/ui/social-login-button";

const DISTRICTS = ["마포구", "은평구", "강남구", "송파구", "용산구", "서대문구"];

const Page = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(prev => (prev + 1) % DISTRICTS.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="flex min-h-dvh flex-col px-6 pt-[env(safe-area-inset-top)] pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <Image src="/logo-nobg.svg" alt="쓰담 로고" width={200} height={200} priority />
        <div className="flex flex-col">
          <h1 className="head-1 text-neutral-900">쓰담에서</h1>
          <p className="head-1 flex items-center justify-center text-neutral-900">
            <span className="relative inline-flex h-[1.2em] min-w-[4em] items-center justify-center overflow-hidden">
              {DISTRICTS.map((district, i) => (
                <span
                  key={district}
                  className="absolute text-neutral-900"
                  style={{
                    animation: i === index ? "slot-up 2.5s ease-in-out" : "none",
                    opacity: i === index ? 1 : 0,
                  }}>
                  {district}
                </span>
              ))}
            </span>
            의
          </p>
          <p className="head-1 text-neutral-900">분리배출 확인하기</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <GoogleLoginButton size="lg" />
        <Link
          href="/onboarding/location"
          className="body-2 text-center text-neutral-600 underline underline-offset-2">
          비회원으로 시작하기
        </Link>
      </div>
    </main>
  );
};

export default Page;
