"use client";

import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { SearchBar } from "@/components/ui/search-bar";

const Page = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <div className="flex min-h-dvh flex-col">
      <Header title={<span className="body-3 text-neutral-900">내 위치 설정</span>} />

      <div className="flex flex-1 flex-col gap-4 px-4 py-4">
        <SearchBar
          value={query}
          onChange={e => setQuery(e.target.value)}
          onClear={() => setQuery("")}
          placeholder="시, 군, 구 단위로 검색"
        />

        <Button variant="secondary" size="md" className="w-full" onClick={() => {}}>
          <MapPin className="size-4" />
          현재 위치로 찾기
        </Button>

        <div className="rounded-12 flex-1 bg-neutral-100" />
      </div>

      <div className="border-t border-neutral-200 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <Button
          size="lg"
          className="w-full"
          onClick={() => router.push("/onboarding/location/complete")}>
          설정 완료
        </Button>
      </div>
    </div>
  );
};

export default Page;
