import { Suspense } from 'react';
import AvailabilityContent from './AvailabilityContent';
import { getWatchProviders, getDetails } from '@/lib/tmdb';
import { logActivity } from '@/lib/activity';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function AvailabilityPage({ params, searchParams }: any) {
    const { type, id } = await params;
    const { refresh } = await searchParams;

    if (type !== 'movie' && type !== 'tv') {
        return <div className="p-8 text-center">Invalid media type</div>;
    }

    // Fetch on the server
    const forceRefresh = refresh === 'true';
    const [providers, details] = await Promise.all([
        getWatchProviders(id, type as 'movie' | 'tv', forceRefresh),
        getDetails(id, type as 'movie' | 'tv')
    ]);

    // Log Activity (using waitUntil to ensure it completes after response)
    let countryCode = 'XX';
    try {
        const headerStore = await headers();
        countryCode = headerStore.get('cf-ipcountry') || 'XX';

        const activityPromise = logActivity({
            title: details.title || details.name || 'Unknown',
            countryCode: countryCode,
            timestamp: Date.now(),
            type: type as 'movie' | 'tv',
            id: id
        });

        // Use waitUntil to ensure the promise completes after response is sent
        try {
            const { getRequestContext } = await import('@cloudflare/next-on-pages');
            const ctx = getRequestContext();
            ctx.ctx.waitUntil(activityPromise);
        } catch {
            // Fallback for non-Cloudflare environments: just await it
            await activityPromise;
        }
    } catch (e) {
        console.error('Activity log error:', e);
    }

    const director = details.credits?.crew?.find((c: any) => c.job === 'Director')?.name;
    const title = details.title || details.name || 'Unknown Title';
    const year = (details.release_date || details.first_air_date)?.split('-')[0];

    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading availability...</div>}>
            <AvailabilityContent
                data={providers}
                id={id}
                type={type}
                director={director}
                title={title}
                year={year}
                userCountry={countryCode !== 'XX' ? countryCode : undefined}
            />
        </Suspense>
    );
}
