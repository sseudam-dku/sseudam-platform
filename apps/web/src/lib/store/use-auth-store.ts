"use client";

import { useCallback, useSyncExternalStore } from "react";

import * as authApi from "@/lib/api/auth";
import { getAccessToken } from "@/lib/api/client";
import type { AuthUser } from "@/lib/api/auth";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;
}

let state: AuthState = {
  user: null,
  isLoading: false,
  isInitialized: false,
};

const listeners = new Set<() => void>();

function emitChange(): void {
  for (const listener of listeners) {
    listener();
  }
}

function setState(partial: Partial<AuthState>): void {
  state = { ...state, ...partial };
  emitChange();
}

async function initializeAuth(): Promise<void> {
  if (state.isInitialized || state.isLoading) {
    return;
  }
  if (!getAccessToken()) {
    setState({ isInitialized: true });
    return;
  }
  setState({ isLoading: true });
  try {
    const user = await authApi.fetchCurrentUser();
    setState({ user, isLoading: false, isInitialized: true });
  } catch {
    setState({ user: null, isLoading: false, isInitialized: true });
  }
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  void initializeAuth();
  return () => listeners.delete(listener);
};

const getSnapshot = () => state;
const getServerSnapshot = () => state;

export function useAuthStore() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    setState({ isLoading: true });
    try {
      const result = await authApi.loginWithGoogle(idToken);
      setState({ user: result.user, isLoading: false, isInitialized: true });
      return result.user;
    } catch (error) {
      setState({ isLoading: false });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setState({ isLoading: true });
    try {
      await authApi.logout();
    } finally {
      setState({ user: null, isLoading: false, isInitialized: true });
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) {
      setState({ user: null });
      return null;
    }
    try {
      const user = await authApi.fetchCurrentUser();
      setState({ user });
      return user;
    } catch {
      setState({ user: null });
      return null;
    }
  }, []);

  return {
    user: snapshot.user,
    isLoggedIn: snapshot.user !== null,
    isLoading: snapshot.isLoading,
    isInitialized: snapshot.isInitialized,
    loginWithGoogle,
    logout,
    refreshUser,
  } as const;
}
