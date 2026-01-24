import { getCache, setCache } from './cache';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
let cachedIP: string | null = null;



function getAuthHeaders(url: string, apiKey: string): { url: string, headers: Record<string, string> } {
    const isV3Key = apiKey.length === 32;
    const separator = url.includes('?') ? '&' : '?';
    if (isV3Key) {
        return {
            url: `${url}${separator}api_key=${apiKey}`,
            headers: { accept: 'application/json' }
        };
    } else {
        return {
            url,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                accept: 'application/json',
            }
        };
    }
}

async function fetchWithBypass(fullUrl: string, headers: Record<string, string>) {
    console.log(`[TMDB Fetch] ${fullUrl}`);
    try {
        const res = await fetch(fullUrl, { headers });
        if (res.ok) return await res.json();

        const errorText = await res.text();
        console.error(`TMDB API Error: ${res.status} ${errorText}`);
        throw new Error(`TMDB Error: ${res.status}`);
    } catch (e: any) {
        console.error(`Fetch Error: ${e.message}`);
        throw e;
    }
}

// CACHED SEARCH
export const searchMedia = async (query: string) => {
    const normalizedQuery = query.toLowerCase().trim();
    const cacheKey = `search:${normalizedQuery}`;

    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) throw new Error('No API Key');

    const { url, headers } = getAuthHeaders(
        `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
        apiKey
    );

    const data = await fetchWithBypass(url, headers);

    if (data.results) {
        const enriched = await Promise.all(data.results.slice(0, 10).map(async (item: any) => {
            if (item.media_type !== 'movie' && item.media_type !== 'tv') return item;
            try {
                // This calls getDetails which also has its own Postgres caching
                const details = await getDetails(item.id, item.media_type);
                const director = details.credits?.crew?.find((c: any) => c.job === 'Director')?.name;
                return { ...item, director };
            } catch (e) {
                return item;
            }
        }));
        data.results = [...enriched, ...data.results.slice(10)];
    }

    await setCache(cacheKey, data);
    return data;
};


// CACHED PROVIDERS
export const getWatchProviders = async (id: string, type: 'movie' | 'tv', forceRefresh = false) => {
    const cacheKey = `avail:${type}:${id}`;

    if (!forceRefresh) {
        const cached = await getCache(cacheKey);
        if (cached) return { ...cached, isCached: true };
    }

    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) throw new Error('No API Key');

    const { url, headers } = getAuthHeaders(
        `${TMDB_BASE_URL}/${type}/${id}/watch/providers`,
        apiKey
    );

    const data = await fetchWithBypass(url, headers);

    await setCache(cacheKey, data);
    return { ...data, isCached: false, _cachedAt: Date.now() };
};

// CACHED DETAILS
export const getDetails = async (id: string, type: 'movie' | 'tv') => {
    const cacheKey = `details:${type}:${id}`;

    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) throw new Error('No API Key');

    const { url, headers } = getAuthHeaders(
        `${TMDB_BASE_URL}/${type}/${id}?append_to_response=credits&language=en-US`,
        apiKey
    );

    const data = await fetchWithBypass(url, headers);

    await setCache(cacheKey, data);
    return data;
};
