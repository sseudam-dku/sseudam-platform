import { apiFetch, clearAccessToken, setAccessToken } from "./client";

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
  user: AuthUser;
}

export async function loginWithGoogle(idToken: string): Promise<AuthLoginResponse> {
  const result = await apiFetch<AuthLoginResponse>("/auth/google", {
    method: "POST",
    body: { idToken },
  });
  setAccessToken(result.accessToken);
  return result;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/me", { auth: true });
}

export async function logout(): Promise<void> {
  try {
    await apiFetch<{ success: boolean }>("/auth/logout", {
      method: "POST",
      auth: true,
    });
  } finally {
    clearAccessToken();
  }
}
