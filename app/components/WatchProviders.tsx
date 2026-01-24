'use client';

import { useMemo, useState } from 'react';

interface Provider {
    provider_id: number;
    provider_name: string;
}

interface RegionData {
    flatrate?: Provider[];
}

interface WatchProvidersProps {
    data: { results: Record<string, RegionData> };
    onClose?: () => void;
    title: string;
    year?: string;
    director?: string;
    isPage?: boolean;
    userCountry?: string; // Default to 'IN'
    isCached?: boolean;
    onRefresh?: () => void;
}

const REGION_NAMES = new Intl.DisplayNames(['en'], { type: 'region' });

// Simple continent mapping for major countries
const UNKNOWN_CONTINENT = 'Other';
const CONTINENT_MAP: Record<string, string> = {
    'US': 'North America', 'CA': 'North America', 'MX': 'North America',
    'GB': 'Europe', 'FR': 'Europe', 'DE': 'Europe', 'ES': 'Europe', 'IT': 'Europe', 'NL': 'Europe', 'SE': 'Europe', 'NO': 'Europe', 'DK': 'Europe', 'IE': 'Europe', 'PT': 'Europe', 'PL': 'Europe', 'CH': 'Europe', 'AT': 'Europe', 'BE': 'Europe',
    'IN': 'Asia', 'JP': 'Asia', 'KR': 'Asia', 'CN': 'Asia', 'HK': 'Asia', 'TW': 'Asia', 'SG': 'Asia', 'TH': 'Asia', 'ID': 'Asia', 'MY': 'Asia', 'VN': 'Asia',
    'AU': 'Oceania', 'NZ': 'Oceania',
    'BR': 'South America', 'AR': 'South America', 'CL': 'South America', 'CO': 'South America',
    'ZA': 'Africa', 'EG': 'Africa', 'NG': 'Africa',
    'RU': 'Europe', 'TR': 'Europe' // Transcontinental
};

export default function WatchProviders({ data, onClose, title, year, director, isPage = false, userCountry = 'IN', isCached = false, onRefresh }: WatchProvidersProps) {
    const [selectedContinent, setSelectedContinent] = useState<string>('All');

    const allRows = useMemo(() => {
        const list = Object.entries(data.results)
            .map(([code, details]) => {
                const providers = details.flatrate || [];
                if (providers.length === 0) return null;
                return {
                    code,
                    country: REGION_NAMES.of(code) || code,
                    providers: providers.map(p => p.provider_name).join(', '),
                    continent: CONTINENT_MAP[code] || UNKNOWN_CONTINENT
                };
            })
            .filter((row): row is { code: string, country: string, providers: string, continent: string } => row !== null);

        // Sort by Continent then Country
        list.sort((a, b) => {
            // User country always on top
            if (a.code === userCountry) return -1;
            if (b.code === userCountry) return 1;

            if (a.continent !== b.continent) {
                return a.continent.localeCompare(b.continent);
            }
            return a.country.localeCompare(b.country);
        });

        return list;
    }, [data, userCountry]);

    const userRow = useMemo(() => {
        return allRows.find(r => r.code === userCountry);
    }, [allRows, userCountry]);

    const availableContinents = useMemo(() => {
        const continents = new Set(allRows.map(r => r.continent));
        return ['All', ...Array.from(continents).sort()];
    }, [allRows]);

    const filteredRows = useMemo(() => {
        // Exclude user country from the main list as it's shown at the top
        let list = allRows.filter(r => r.code !== userCountry);

        if (selectedContinent !== 'All') {
            list = list.filter(r => r.continent === selectedContinent);
        }
        return list;
    }, [allRows, selectedContinent, userCountry]);

    const groupedRows = useMemo(() => {
        let currentContinent = '';
        const groups = [];

        for (const row of filteredRows) {
            if (row.continent !== currentContinent) {
                groups.push({ type: 'header', label: row.continent });
                currentContinent = row.continent;
            }
            groups.push({ type: 'row', data: row });
        }
        return groups;
    }, [filteredRows]);

    const content = (
        <div className={`flex flex-col ${isPage ? 'h-full' : 'max-h-[80vh] overflow-hidden'}`}>
            <div className={`p-6 border-b border-gray-100 bg-white flex justify-between items-start flex-shrink-0 ${isPage ? 'rounded-t-lg' : ''}`}>
                <div>
                    <h3 className="text-4xl font-bold text-black mb-1">{title} {year && <span className="text-gray-400 font-normal">({year})</span>}</h3>
                    {director && <p className="text-gray-500 font-medium">Directed by {director}</p>}

                    {isCached && (
                        <div className="mt-4 flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                            <span className="text-gray-400">
                                {(() => {
                                    // @ts-ignore
                                    const cachedAt = data._cachedAt;
                                    if (!cachedAt) return 'Cached';
                                    const diff = Math.floor((Date.now() - cachedAt) / 1000);
                                    if (diff < 60) return `Cached ${diff}s ago`;
                                    if (diff < 3600) return `Cached ${Math.floor(diff / 60)}m ago`;
                                    return `Cached ${Math.floor(diff / 3600)}h ago`;
                                })()}
                            </span>
                            <button
                                onClick={onRefresh}
                                className="text-black border-b border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                            >
                                Refresh Live
                            </button>
                        </div>
                    )}
                </div>
                {!isPage && (
                    <button onClick={onClose} className="text-black font-bold border-b-2 border-black">Close</button>
                )}
            </div>

            {/* Continent Tabs */}
            <div className="flex flex-nowrap overflow-x-auto overflow-y-hidden py-4 mb-4 border-b border-gray-200 gap-3 md:gap-8 no-scrollbar touch-pan-x">
                {availableContinents.map(continent => (
                    <button
                        key={continent}
                        onClick={() => setSelectedContinent(continent)}
                        className={`text-sm font-bold uppercase tracking-tight whitespace-nowrap border-b-2 transition-all flex-shrink-0 px-1 ${selectedContinent === continent
                            ? 'text-black border-black'
                            : 'text-gray-400 border-transparent hover:text-black'
                            }`}
                    >
                        {continent}
                    </button>
                ))}
            </div>

            <div className="overflow-y-auto flex-1 h-full min-h-0">

                {/* User Location Card - Simple Header */}
                {userRow && (
                    <div className="py-6 border-b border-gray-200">
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-900">Your Location</h4>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <span className="font-bold text-xl">{userRow.country}</span>
                            <span className="text-gray-600 leading-relaxed max-w-2xl">{userRow.providers}</span>
                        </div>
                    </div>
                )}

                <table className="w-full">
                    <thead className="sticky top-0 bg-gray-100 shadow-sm z-10">
                        <tr className="border-b border-gray-200 text-left">
                            <th className="py-3 px-4 md:px-6 font-semibold text-gray-600 w-1/3 text-sm md:text-base">Country</th>
                            <th className="py-3 px-4 md:px-6 font-semibold text-gray-600 text-sm md:text-base">Streaming Services</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupedRows.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="text-center py-12 text-gray-500">
                                    {userRow ? 'No other locations found matching filter.' : 'No streaming links found.'}
                                </td>
                            </tr>
                        ) : (
                            groupedRows.map((item, idx) => {
                                if (item.type === 'header') {
                                    return (
                                        <tr key={`h-${idx}`} className="bg-gray-50">
                                            <td colSpan={2} className="py-2 px-4 md:px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                                {item.label}
                                            </td>
                                        </tr>
                                    );
                                } else {
                                    const row = item.data!;
                                    return (
                                        <tr key={row.code} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 md:px-6 align-top">
                                                <span className="font-medium text-gray-800 block">
                                                    {row.country}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 md:px-6 text-gray-600 leading-relaxed align-top">
                                                {row.providers}
                                            </td>
                                        </tr>
                                    );
                                }
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    if (isPage) {
        return content;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/20 backdrop-blur-sm">
            <div className="bg-white w-full h-full md:h-auto md:max-w-4xl md:max-h-[90vh] md:rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200">
                {content}
            </div>
        </div>
    );
}
