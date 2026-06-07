import { apiFetch } from "./client";

export interface WasteCategoryDetail {
  id: string;
  name: string;
  href: string;
  district: string;
  displayLocation: string;
  method: string;
  schedule: string | null;
  noCollectDay: string | null;
  disposalPlace: string | null;
  disposalPlaceType: string | null;
  disposalTimeStart: string | null;
  disposalTimeEnd: string | null;
  managementZone: string | null;
  generalWasteMethod: string | null;
  generalWasteSchedule: string | null;
  caution: string;
  source: "api" | "fallback";
}

export async function fetchCategoryDetail(
  id: string,
  city: string,
  district: string,
): Promise<WasteCategoryDetail> {
  const params = new URLSearchParams({ city, district });
  return apiFetch<WasteCategoryDetail>(`/waste-sorting/categories/${id}?${params.toString()}`);
}
