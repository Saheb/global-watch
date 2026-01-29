export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getRecentActivity } from '@/lib/activity';

export async function GET() {
    const activity = await getRecentActivity();
    return NextResponse.json(activity);
}
