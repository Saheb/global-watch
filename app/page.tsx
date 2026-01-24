'use client';

import { useState, useCallback, useEffect } from 'react';
import SearchBox from './components/SearchBox';
import SearchResults from './components/SearchResults';

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  media_type: 'movie' | 'tv';
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
}

export default function Home() {
  const [results, setResults] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);

    // Update Recent Searches (Unique, limit 5)
    setRecentSearches(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== query.toLowerCase());
      const updated = [query, ...filtered].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.results) {
        setResults(data.results.filter((item: MediaItem) => item.media_type === 'movie' || item.media_type === 'tv'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <main className="container mx-auto max-w-4xl px-4 py-6 md:py-12">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">GlobalWatch</h1>
        <p className="text-gray-600">Find where movies are streaming globally.</p>
      </div>

      <SearchBox onSearch={handleSearch} isLoading={isLoading} />

      {recentSearches.length > 0 && results.length === 0 && !isLoading && (
        <div className="mt-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Recent Searches</h2>
          <div className="flex flex-wrap gap-4">
            {recentSearches.map((query, i) => (
              <button
                key={i}
                onClick={() => handleSearch(query)}
                className="text-black font-bold border-b border-black hover:border-b-2 transition-all cursor-pointer"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12">
        <SearchResults results={results} />
      </div>
    </main>
  );
}
