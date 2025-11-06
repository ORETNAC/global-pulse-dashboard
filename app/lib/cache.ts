import type { CacheEntry } from './types';

// In-memory cache using Map
const cache = new Map<string, CacheEntry<unknown>>();

// Cache TTL: 15 minutes
const CACHE_TTL = 15 * 60 * 1000;

/**
 * Retrieves cached data if it exists and hasn't expired
 * @param key - Cache key
 * @returns Cached data or undefined if not found/expired
 */
export function getCached<T>(key: string): T | undefined {
  const entry = cache.get(key);

  if (!entry) {
    return undefined;
  }

  const age = Date.now() - entry.timestamp;

  // Check if cache has expired
  if (age > CACHE_TTL) {
    cache.delete(key);
    return undefined;
  }

  return entry.data as T;
}

/**
 * Stores data in cache with current timestamp
 * @param key - Cache key
 * @param data - Data to cache
 */
export function setCache<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * Clears all cached data
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Gets cache statistics for debugging
 * @returns Object with cache size and keys
 */
export function getCacheStats() {
  return {
    size: cache.size,
    keys: [...cache.keys()],
  };
}
