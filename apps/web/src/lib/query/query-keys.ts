export const queryKeys = {
  wasteGuide: (categoryId: string, city: string, district: string) =>
    ["waste-guide", categoryId, city, district] as const,
  userStats: () => ["user-stats"] as const,
  userBadges: () => ["user-badges"] as const,
  records: () => ["records"] as const,
  pointHistory: () => ["point-history"] as const,
};
