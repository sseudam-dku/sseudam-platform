import { Injectable } from "@nestjs/common";

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * Process-local TTL cache with optional per-user invalidation tracking.
 */
@Injectable()
export class InMemoryCacheService {
  private readonly entries = new Map<string, CacheEntry<unknown>>();
  private readonly userKeys = new Map<string, Set<string>>();

  get<T>(key: string): T | null {
    const entry = this.entries.get(key);
    if (!entry) {
      return null;
    }
    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      return null;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number, ownerUserId?: string): void {
    this.entries.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
    if (ownerUserId) {
      const keys = this.userKeys.get(ownerUserId) ?? new Set<string>();
      keys.add(key);
      this.userKeys.set(ownerUserId, keys);
    }
  }

  delete(key: string): void {
    this.entries.delete(key);
    for (const [userId, keys] of this.userKeys.entries()) {
      if (keys.delete(key) && keys.size === 0) {
        this.userKeys.delete(userId);
      }
    }
  }

  invalidateUser(userId: string): void {
    const keys = this.userKeys.get(userId);
    if (!keys) {
      return;
    }
    for (const key of keys) {
      this.entries.delete(key);
    }
    this.userKeys.delete(userId);
  }

  invalidateUserScope(userId: string, keyPrefix: string): void {
    const keys = this.userKeys.get(userId);
    if (!keys) {
      return;
    }
    for (const key of [...keys]) {
      if (key.startsWith(keyPrefix)) {
        this.delete(key);
      }
    }
  }
}
