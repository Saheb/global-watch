import { getKV } from './cache';

export interface ActivityItem {
    title: string;
    countryCode: string; // ISO 3166-1 alpha-2
    timestamp: number;
    type: 'movie' | 'tv';
    id: string;
}

const ACTIVITY_KEY = 'RECENT_ACTIVITY';
const MAX_ITEMS = 10;
const ACTIVITY_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

// Local fallback for dev (In-memory only, won't share across processes)
let localActivity: ActivityItem[] = [];

export async function getRecentActivity(): Promise<ActivityItem[]> {
    try {
        const KV = getKV();
        if (KV) {
            const data = await KV.get(ACTIVITY_KEY, { type: 'json' });
            return (data as ActivityItem[]) || [];
        }
        return localActivity;
    } catch (e) {
        console.error('Activity Read Error:', e);
        return [];
    }
}

export async function logActivity(item: ActivityItem) {
    try {
        // Validate inputs
        if (!item.title || !item.countryCode) return;

        const KV = getKV();
        let current = await getRecentActivity();

        // Remove existing entry for same movie/tv (deduplicate)
        current = current.filter(a => !(a.type === item.type && a.id === item.id));

        // Add new item to start
        current.unshift(item);

        // Limit to MAX_ITEMS
        if (current.length > MAX_ITEMS) {
            current = current.slice(0, MAX_ITEMS);
        }

        if (KV) {
            // Store with 30-day TTL
            await KV.put(ACTIVITY_KEY, JSON.stringify(current), {
                expirationTtl: ACTIVITY_TTL_SECONDS
            });
        } else {
            localActivity = current;
        }
    } catch (e) {
        console.error('Activity Write Error:', e);
    }
}
