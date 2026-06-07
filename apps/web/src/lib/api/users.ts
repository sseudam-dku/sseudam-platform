import { apiFetch } from "./client";

export interface UserLocation {
  city: string;
  district: string;
  displayName: string;
}

export interface UserStats {
  totalRecords: number;
  totalPoints: number;
  monthlyRecords: number;
  streakDays: number;
  categoryBreakdown: Array<{
    name: string;
    percent: number;
    color: string;
  }>;
}

export interface UserBadge {
  id: string;
  name: string;
  emoji: string;
  image: string;
  description: string;
  reward: string;
  earned: boolean;
}

export interface PointHistoryItem {
  id: string;
  date: string;
  category: string;
  points: number;
}

export async function updateUserLocation(city: string, district: string): Promise<UserLocation> {
  return apiFetch<UserLocation>("/users/location", {
    method: "PUT",
    auth: true,
    body: { city, district },
  });
}

export async function fetchUserLocation(): Promise<UserLocation> {
  return apiFetch<UserLocation>("/users/location", { auth: true });
}

export async function fetchUserStats(): Promise<UserStats> {
  return apiFetch<UserStats>("/users/stats", { auth: true });
}

export async function fetchUserBadges(): Promise<UserBadge[]> {
  return apiFetch<UserBadge[]>("/users/badges", { auth: true });
}

export async function fetchPointHistory(): Promise<PointHistoryItem[]> {
  return apiFetch<PointHistoryItem[]>("/users/points", { auth: true });
}
