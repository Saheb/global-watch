import { Suspense } from 'react';
import AvailabilityContent from './AvailabilityContent';
import { getWatchProviders, getDetails } from '@/lib/tmdb';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

interface PageProps {
    params: Promise<{
        type: string;
        id: string;
    }>;
    searchParams: Promise<{
        title?: string;
        refresh?: string;
    }>;
}

export default async function AvailabilityPage({ params, searchParams }: PageProps) {
    const { type, id } = await params;
    const { refresh } = await searchParams;

    if (type !== 'movie' && type !== 'tv') {
        return <div>Invalid media type</div>;
    }

    // Fetch on the server
    const forceRefresh = refresh === 'true';
    const [providersData, detailsData] = await Promise.all([
        getWatchProviders(id, type as 'movie' | 'tv', forceRefresh),
        getDetails(id, type as 'movie' | 'tv')
    ]);

    const director = detailsData.credits?.crew?.find((c: any) => c.job === 'Director')?.name;
    const title = detailsData.title || detailsData.name || 'Unknown Title';
    const year = (detailsData.release_date || detailsData.first_air_date)?.split('-')[0];

    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading availability...</div>}>
            <AvailabilityContent
                data={providersData}
                id={id}
                type={type}
                title={title}
                year={year}
                director={director}
            />
        </Suspense>
    );
}
