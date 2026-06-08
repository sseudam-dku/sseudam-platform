"use client";

import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchRecords } from "@/lib/api/records";
import { fetchPointHistory, fetchUserBadges, fetchUserStats } from "@/lib/api/users";
import { fetchCategoryDetail } from "@/lib/api/waste-sorting";
import { queryKeys } from "@/lib/query/query-keys";

export function useWasteGuide(
  categoryId: string | null,
  city: string,
  district: string,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.wasteGuide(categoryId ?? "", city, district),
    queryFn: () => fetchCategoryDetail(categoryId!, city, district),
    enabled: Boolean(categoryId) && enabled,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useWasteGuides(
  categoryIds: string[],
  city: string,
  district: string,
  enabled = true,
) {
  return useQueries({
    queries: categoryIds.map(categoryId => ({
      queryKey: queryKeys.wasteGuide(categoryId, city, district),
      queryFn: () => fetchCategoryDetail(categoryId, city, district),
      enabled: enabled && categoryIds.length > 0,
      staleTime: 24 * 60 * 60 * 1000,
    })),
  });
}

export function useUserStats(isLoggedIn: boolean) {
  return useQuery({
    queryKey: queryKeys.userStats(),
    queryFn: fetchUserStats,
    enabled: isLoggedIn,
    staleTime: 60 * 1000,
  });
}

export function useUserBadges(isLoggedIn: boolean) {
  return useQuery({
    queryKey: queryKeys.userBadges(),
    queryFn: fetchUserBadges,
    enabled: isLoggedIn,
    staleTime: 60 * 1000,
  });
}

export function useRecords(isLoggedIn: boolean) {
  return useQuery({
    queryKey: queryKeys.records(),
    queryFn: fetchRecords,
    enabled: isLoggedIn,
    staleTime: 60 * 1000,
  });
}

export function usePointHistory(isLoggedIn: boolean) {
  return useQuery({
    queryKey: queryKeys.pointHistory(),
    queryFn: fetchPointHistory,
    enabled: isLoggedIn,
    staleTime: 60 * 1000,
  });
}

export function useInvalidateUserData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => undefined,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.userStats() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.userBadges() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.records() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.pointHistory() });
    },
  });
}
