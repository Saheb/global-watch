'use client';

import Link from 'next/link';

interface MediaItem {
    id: number;
    title?: string;
    name?: string;
    media_type: 'movie' | 'tv';
    release_date?: string;
    first_air_date?: string;
    director?: string;
}

interface SearchResultsProps {
    results: MediaItem[];
}

export default function SearchResults({ results }: SearchResultsProps) {
    if (results.length === 0) return null;

    return (
        <div className="overflow-hidden">
            {/* Mobile View (Cards) */}
            <div className="md:hidden space-y-4">
                {results.map((item) => (
                    <div key={item.id} className="border border-gray-200 p-4 rounded-lg bg-gray-50/50">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg leading-tight">{item.title || item.name}</h3>
                            <span className="text-xs uppercase font-bold tracking-wider text-gray-500 bg-white px-2 py-1 border border-gray-200 rounded">
                                {item.media_type}
                            </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-4 space-y-1">
                            <p><span className="font-medium text-gray-400">Year:</span> {(item.release_date || item.first_air_date)?.split('-')[0] || '-'}</p>
                            {item.director && <p><span className="font-medium text-gray-400">Director:</span> {item.director}</p>}
                        </div>
                        <Link
                            href={`/availability/${item.media_type}/${item.id}?title=${encodeURIComponent(item.title || item.name || '')}`}
                            className="block w-full text-center bg-black text-white font-bold py-3 text-sm hover:bg-gray-800 transition-colors"
                        >
                            Check Availability
                        </Link>
                    </div>
                ))}
            </div>

            {/* Desktop View (Table) */}
            <table className="hidden md:table w-full">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-left">
                        <th className="py-3 px-4 font-semibold text-gray-600">Title</th>
                        <th className="py-3 px-4 font-semibold text-gray-600">Type</th>
                        <th className="py-3 px-4 font-semibold text-gray-600">Year</th>
                        <th className="py-3 px-4 font-semibold text-gray-600">Director</th>
                        <th className="py-3 px-4 font-semibold text-gray-600">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
                            <td className="py-3 px-4 font-medium">{item.title || item.name}</td>
                            <td className="py-3 px-4 capitalize text-sm text-gray-500">{item.media_type}</td>
                            <td className="py-3 px-4 text-sm text-gray-500">{(item.release_date || item.first_air_date)?.split('-')[0] || '-'}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{item.director || '-'}</td>
                            <td className="py-3 px-4">
                                <Link
                                    href={`/availability/${item.media_type}/${item.id}?title=${encodeURIComponent(item.title || item.name || '')}`}
                                    className="text-black font-bold border-b border-black text-sm hover:text-gray-600 hover:border-gray-600 transition-colors"
                                >
                                    Check Availability
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
