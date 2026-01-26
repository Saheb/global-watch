'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import WatchProviders from '@/app/components/WatchProviders';
import { useCallback } from 'react';

interface AvailabilityContentProps {
    data: any;
    id: string;
    type: string;
    title: string;
    year?: string;
    director?: string;
    userCountry?: string;
}

export default function AvailabilityContent({ data, id, type, title, year, director, userCountry }: AvailabilityContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleRefresh = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('refresh', 'true');
        router.replace(`?${params.toString()}`);
    }, [router, searchParams]);

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="mb-12">
                <a href="/" className="text-black font-bold border-b border-black">← Back</a>
            </div>

            <div className="bg-white overflow-hidden">
                <WatchProviders
                    data={data}
                    title={title}
                    year={year}
                    director={director}
                    isPage={true}
                    isCached={data.isCached}
                    onRefresh={handleRefresh}
                    userCountry={userCountry}
                />
            </div>
        </div>
    );
}
