"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { CategoryDetailView } from "@/components/category/category-detail-view";
import { fetchCategoryDetail, type WasteCategoryDetail } from "@/lib/api/waste-sorting";
import { useLocationStore } from "@/lib/store/use-location-store";
import { WASTE_CATEGORIES } from "@/lib/waste-categories";

export function CategoryClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { city, district, isHydrated } = useLocationStore();
  const [selected, setSelected] = useState<string | null>(searchParams.get("selected"));
  const [guideState, setGuideState] = useState<{
    categoryId: string;
    guide: WasteCategoryDetail | null;
  }>({ categoryId: "", guide: null });

  useEffect(() => {
    setSelected(searchParams.get("selected"));
  }, [searchParams]);

  useEffect(() => {
    const param = searchParams.get("selected");
    const isValid = param && WASTE_CATEGORIES.some(c => c.id === param);
    if (!isValid) {
      router.replace("/");
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!selected || !isHydrated) return;
    let cancelled = false;
    void fetchCategoryDetail(selected, city, district)
      .then(data => {
        if (!cancelled) {
          setGuideState({ categoryId: selected, guide: data });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGuideState({ categoryId: selected, guide: null });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selected, city, district, isHydrated]);

  const category = WASTE_CATEGORIES.find(c => c.id === selected);
  const guide = guideState.categoryId === selected ? guideState.guide : null;
  const isLoadingGuide = selected !== null && guideState.categoryId !== selected;

  if (!selected || !category) {
    return null;
  }

  return (
    <CategoryDetailView
      category={category}
      city={city}
      district={district}
      guide={guide}
      isLoadingGuide={isLoadingGuide}
      isLocationHydrated={isHydrated}
      onBack={() => router.push("/")}
    />
  );
}

export default CategoryClient;
