'use client';

import { useEffect, useState } from 'react';
import type { ActivityItem } from '@/lib/activity';
import Link from 'next/link';

export default function RecentActivity() {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/activity')
            .then(res => res.json())
            .then(data => {
                setActivities(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return null;

    if (activities.length === 0) {
        return (
            <div className="mt-12 w-full max-w-2xl mx-auto text-center">
                <p className="text-gray-400 text-sm">Waiting for recent searches...</p>
            </div>
        );
    }

    return (
        <div className="mt-12 w-full max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 text-center">
                Global Activity
            </h2>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
                {activities.map((item, i) => (
                    <Link
                        key={i}
                        href={`/availability/${item.type}/${item.id}`}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
                    >
                        <span
                            className="text-2xl cursor-help select-none"
                            title={getCountryName(item.countryCode)}
                        >
                            {getFlagEmoji(item.countryCode)}
                        </span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 truncate">
                                Someone in <span className="font-medium text-black">{getCountryName(item.countryCode)}</span> looked up
                            </p>
                            <p className="text-base font-bold text-black truncate group-hover:text-amber-500 transition-colors">
                                {item.title}
                            </p>
                        </div>
                        <span className="text-xs text-gray-300 font-mono whitespace-nowrap">
                            {getTimeAgo(item.timestamp)}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function getFlagEmoji(countryCode: string) {
    if (!countryCode || countryCode === 'XX') return '🌍';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

function getCountryName(code: string) {
    if (!code || code === 'XX') return 'Unknown Location';
    try {
        return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code;
    } catch (e) {
        return code;
    }
}

function getTimeAgo(timestamp: number) {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return `Just now`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
}
