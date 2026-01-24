import { NextRequest, NextResponse } from 'next/server';
import { getWatchProviders } from '@/lib/tmdb';


export const runtime = 'edge';


export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
        return NextResponse.json({ error: 'Parameters "id" and "type" are required' }, { status: 400 });
    }

    if (type !== 'movie' && type !== 'tv') {
        return NextResponse.json({ error: 'Type must be "movie" or "tv"' }, { status: 400 });
    }

    try {
        const data = await getWatchProviders(id, type);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Availability API error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
