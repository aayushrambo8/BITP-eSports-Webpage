interface RateLimitRecord {
  count: number;
  expiresAt: number;
}

const store = new Map<string, RateLimitRecord>();
const MAX_RECORDS = 10_000;

export function checkRateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000
): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = store.get(key);

  if (!record || record.expiresAt <= now) {
    if (store.size >= MAX_RECORDS) {
      for (const [storedKey, storedRecord] of store) {
        if (storedRecord.expiresAt <= now) store.delete(storedKey);
      }
      if (store.size >= MAX_RECORDS) {
        return { success: false, remaining: 0 };
      }
    }
    store.set(key, { count: 1, expiresAt: now + windowMs });
    return { success: true, remaining: Math.max(0, limit - 1) };
  }

  if (record.count >= limit) return { success: false, remaining: 0 };

  record.count += 1;
  return { success: true, remaining: Math.max(0, limit - record.count) };
}
