import { toast } from "sonner";

export const LOGIN_REQUIRED_TOAST_MESSAGE = "로그인 후 이용 가능해요";

const STORAGE_KEY = "sseudam:login-required-toast";

export function queueLoginRequiredToast(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, "1");
}

export function consumeLoginRequiredToast(): boolean {
  if (typeof window === "undefined") return false;
  const pending = sessionStorage.getItem(STORAGE_KEY) === "1";
  if (pending) {
    sessionStorage.removeItem(STORAGE_KEY);
  }
  return pending;
}

export function showLoginRequiredToast(): void {
  toast.error(LOGIN_REQUIRED_TOAST_MESSAGE);
}
