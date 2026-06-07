export const ONBOARDING_COMPLETE_KEY = "sseudam-onboarding-complete";

export function markOnboardingComplete(): void {
  if (typeof document === "undefined") {
    return;
  }
  try {
    localStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
    document.cookie = `${ONBOARDING_COMPLETE_KEY}=true; path=/; max-age=31536000; SameSite=Lax`;
  } catch {}
}
