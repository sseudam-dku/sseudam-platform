"use client";

import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import Map from "@/components/ui/map";
import { SearchBar } from "@/components/ui/search-bar";
import { updateUserLocation } from "@/lib/api/users";
import { markOnboardingComplete } from "@/lib/onboarding";
import { reverseGeocode } from "@/lib/location/reverse-geocode";
import { useGeocode } from "@/lib/location/use-geocode";
import { useGeolocation } from "@/lib/location/use-geolocation";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { useLocationStore } from "@/lib/store/use-location-store";

const Page = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const { setLocationFromDisplay } = useLocationStore();
  const [query, setQuery] = useState("");
  const { position, locating, locate } = useGeolocation();
  const [selected, setSelected] = useState(false);
  const { results, clear } = useGeocode(query, !selected);
  const [center, setCenter] = useState<{ lng: number; lat: number } | undefined>();
  const [districtDisplay, setDistrictDisplay] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const mapCenter = center ?? position;

  useEffect(() => {
    if (!position) return;
    reverseGeocode(position.lng, position.lat)
      .then(result => {
        if (result) {
          setQuery(result.name);
          setDistrictDisplay(result.district);
          setSelected(true);
        }
      })
      .finally(() => {
        setCenter(position);
      });
  }, [position]);

  async function handleComplete() {
    if (!districtDisplay) return;
    setIsSaving(true);
    const parts = districtDisplay.trim().split(/\s+/);
    const city = parts.length >= 2 ? parts[0] : "서울";
    const district = parts.length >= 2 ? parts.slice(1).join(" ") : parts[0];
    setLocationFromDisplay(`${city} ${district}`);
    markOnboardingComplete();
    if (isLoggedIn) {
      try {
        await updateUserLocation(city, district);
      } catch {
        // 로컬 저장은 완료됨 — API 동기화 실패는 무시
      }
    }
    setIsSaving(false);
    router.push("/onboarding/location/complete");
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header title="내 위치 설정" onBack={() => router.back()} />

      <div className="relative flex flex-1 flex-col gap-4 px-4 py-4">
        <SearchBar
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setSelected(false);
            setDistrictDisplay("");
          }}
          onClear={() => {
            setQuery("");
            setSelected(false);
            setDistrictDisplay("");
            clear();
          }}
          placeholder="지역이나 동네로 검색"
        />

        {results.length > 0 && !selected && (
          <ul className="rounded-12 absolute top-18 right-4 left-4 z-10 overflow-hidden border border-neutral-200 bg-white shadow-lg">
            {results.map(result => (
              <li key={result.id}>
                <button
                  className="flex w-full cursor-pointer flex-col px-4 py-3 text-left hover:cursor-pointer hover:bg-neutral-50 active:bg-neutral-100"
                  onClick={() => {
                    setCenter({ lng: result.lng, lat: result.lat });
                    setQuery(result.fullAddress);
                    setDistrictDisplay(result.district);
                    setSelected(true);
                    clear();
                  }}>
                  <span className="body-3 text-neutral-900">{result.name}</span>
                  <span className="body-5 text-neutral-400">{result.fullAddress}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <Button
          variant="secondary"
          size="md"
          className="w-full"
          onClick={locate}
          disabled={locating}>
          <MapPin className="size-4" />
          {locating ? "위치 찾는 중" : "현재 위치로 찾기"}
        </Button>

        <Map className="min-h-60 flex-1" center={mapCenter} marker={mapCenter} />
      </div>

      <div className="border-t border-neutral-200 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <Button
          size="lg"
          className="w-full"
          disabled={!districtDisplay || isSaving}
          onClick={handleComplete}>
          {isSaving ? "저장 중..." : "설정 완료"}
        </Button>
      </div>
    </div>
  );
};

export default Page;
