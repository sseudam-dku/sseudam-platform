"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { CategoryDetailView } from "@/components/category/category-detail-view";
import { useWasteGuide } from "@/lib/query/hooks";
import { useLocationStore } from "@/lib/store/use-location-store";
import { WASTE_CATEGORIES } from "@/lib/waste-categories";

export function CategoryClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { city, district, isHydrated } = useLocationStore();
  const selected = searchParams.get("selected");

  useEffect(() => {
    const isValid = selected && WASTE_CATEGORIES.some(c => c.id === selected);
    if (!isValid) {
      router.replace("/");
    }
  }, [selected, router]);

  const { data: guide, isLoading: isLoadingGuide } = useWasteGuide(
    selected,
    city,
    district,
    isHydrated,
  );

  const category = WASTE_CATEGORIES.find(c => c.id === selected);

  if (!selected || !category) {
    return null;
  }

  return (
    <CategoryDetailView
      category={category}
      city={city}
      district={district}
      guide={guide ?? null}
      isLoadingGuide={isLoadingGuide}
      isLocationHydrated={isHydrated}
      onBack={() => router.push("/")}
    />
  );
}

export default CategoryClient;
