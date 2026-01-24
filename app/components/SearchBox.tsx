'use client';

import { useState } from 'react';

interface SearchBoxProps {
    onSearch: (query: string) => void;
    isLoading?: boolean;
}

export default function SearchBox({ onSearch, isLoading }: SearchBoxProps) {
    const [query, setQuery] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) {
            onSearch(query);
        }
    };
    return (
        <div className="mb-12">
            <input
                type="text"
                className="w-full p-4 text-lg border border-gray-300 rounded-none focus:outline-none focus:border-black placeholder:text-gray-400"
                placeholder="Search for a movie or show..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
            />
            {isLoading ? (
                <p className="text-sm mt-2 text-gray-500">Searching...</p>
            ) : (
                query && <p className="text-xs mt-2 text-gray-400 uppercase tracking-wider font-medium">Press <span className="font-bold text-gray-600">Enter</span> to search</p>
            )}
        </div>
    );
}
