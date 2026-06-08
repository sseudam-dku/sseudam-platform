"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

import { LoadingScreen } from "@/components/ui/loading-screen";
import { queueLoginRequiredToast } from "@/lib/login-required-toast";
import { useAuthStore } from "@/lib/store/use-auth-store";

interface CameraAccessGuardProps {
  children: ReactNode;
}

function CameraAccessGuard({ children }: CameraAccessGuardProps) {
  const router = useRouter();
  const { isLoggedIn, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized || isLoggedIn) return;
    queueLoginRequiredToast();
    router.replace("/");
  }, [isInitialized, isLoggedIn, router]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return null;
  }

  return children;
}

export { CameraAccessGuard };
