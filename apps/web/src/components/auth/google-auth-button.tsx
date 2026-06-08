"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { GoogleLoginButton } from "@/components/ui/social-login-button";
import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/use-auth-store";

interface GoogleAuthButtonProps {
  redirectTo?: string;
  size?: "sm" | "md" | "lg";
}

const GoogleAuthButton = ({
  redirectTo = "/onboarding/location",
  size = "lg",
}: GoogleAuthButtonProps) => {
  const router = useRouter();
  const { loginWithGoogle, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  async function handleSuccess(response: CredentialResponse) {
    if (!response.credential) {
      setError("Google 인증에 실패했습니다.");
      return;
    }
    setError(null);
    try {
      await loginWithGoogle(response.credential);
      router.push(redirectTo);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "로그인에 실패했습니다. 다시 시도해 주세요.";
      setError(message);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <GoogleLoginButton size={size} disabled={isLoading} aria-hidden="true" tabIndex={-1} />
        <div className="absolute inset-0 opacity-0">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setError("Google 인증에 실패했습니다.")}
            useOneTap={false}
            width="400"
          />
        </div>
      </div>
      {error && <p className="body-5 text-center text-rose-500">{error}</p>}
    </div>
  );
};

export default GoogleAuthButton;
