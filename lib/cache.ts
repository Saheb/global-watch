import { getRequestContext } from '@cloudflare/next-on-pages';

// Cloudflare KV Cache Utility
export interface CacheEntry {
    data: any;
    updatedAt: number;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// In-memory fallback for local development (npm run dev)
const localCache = new Map<string, CacheEntry>();

function getKV() {
    try {
        const ctx = getRequestContext();
        if (ctx?.env && (ctx.env as any).GLOBAL_WATCH_CACHE) {
            return (ctx.env as any).GLOBAL_WATCH_CACHE;
        }
    } catch (e) {
        // Ignore in standard dev mode
    }
    // Fallback/Local
    return (process.env as any).GLOBAL_WATCH_CACHE;
}

export async function getCache(key: string): Promise<any | null> {
    try {
        const KV = getKV();

        if (KV) {
            const entry = await KV.get(key, { type: 'json' }) as CacheEntry | null;
            if (entry && (Date.now() - entry.updatedAt < CACHE_TTL_MS)) {
                console.log(`[KV Cache Hit] ${key}`);
                return { ...entry.data, _cachedAt: entry.updatedAt };
            }
        } else {
            // Local fallback
            const entry = localCache.get(key);
            if (entry && (Date.now() - entry.updatedAt < CACHE_TTL_MS)) {
                console.log(`[Local Cache Hit] ${key}`);
                return { ...entry.data, _cachedAt: entry.updatedAt };
            }
        }
    } catch (e) {
        console.error('Cache Read Error:', e);
    }
    return null;
}

export async function setCache(key: string, data: any) {
    try {
        const KV = getKV();
        const entry: CacheEntry = { data, updatedAt: Date.now() };

        if (KV) {
            await KV.put(key, JSON.stringify(entry));
        } else {
            // Local fallback
            localCache.set(key, entry);
        }
    } catch (e) {
        console.error('Cache Write Error:', e);
    }
}
