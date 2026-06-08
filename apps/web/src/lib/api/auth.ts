import { apiFetch, refreshAccessToken as refreshAccessTokenFromClient } from "./client";

export interface AuthUser {
  id: string;
  email: string;
  nickname: string | null;
  avatarUrl: string | null;
  city: string | null;
  district: string | null;
}

export interface AuthLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export async function loginWithGoogle(idToken: string): Promise<AuthLoginResponse> {
  return apiFetch<AuthLoginResponse>("/auth/google", {
    method: "POST",
    body: { idToken },
  });
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/me", { auth: true });
}

export async function refreshAccessToken(): Promise<void> {
  return refreshAccessTokenFromClient();
}

export async function logout(): Promise<void> {
  await apiFetch<{ success: boolean }>("/auth/logout", {
    method: "POST",
    auth: true,
  });
}
