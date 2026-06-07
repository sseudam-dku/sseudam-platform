export const GUEST_SESSION_KEY = "sseudam-guest-session-id";
export const GUEST_COUNT_KEY = "sseudam-guest-chat-count";
export const GUEST_MESSAGE_LIMIT = 3;

export function getOrCreateGuestSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }
  try {
    const stored = localStorage.getItem(GUEST_SESSION_KEY);
    if (stored) {
      return stored;
    }
    const id = crypto.randomUUID();
    localStorage.setItem(GUEST_SESSION_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function getGuestMessageCount(): number {
  if (typeof window === "undefined") {
    return 0;
  }
  try {
    const stored = localStorage.getItem(GUEST_COUNT_KEY);
    if (!stored) {
      return 0;
    }
    const count = Number.parseInt(stored, 10);
    return Number.isNaN(count) ? 0 : count;
  } catch {
    return 0;
  }
}

export function setGuestMessageCount(count: number): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(GUEST_COUNT_KEY, String(count));
  } catch {}
}

export function syncGuestMessageCountFromRemaining(remainingCount: number): void {
  setGuestMessageCount(GUEST_MESSAGE_LIMIT - remainingCount);
}

export function getRemainingGuestMessages(): number {
  return Math.max(0, GUEST_MESSAGE_LIMIT - getGuestMessageCount());
}

export function isGuestLimitReached(): boolean {
  return getRemainingGuestMessages() <= 0;
}
