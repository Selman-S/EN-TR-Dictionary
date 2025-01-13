'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SearchComponentProps {
  onSearchResult: (result: any | null) => void;
  onLanguageChange?: (lang: 'en' | 'tr') => void;
}

interface Suggestion {
  word: string;
  translation: string;
}

export default function SearchComponent({ onSearchResult, onLanguageChange }: SearchComponentProps) {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState<'en' | 'tr'>('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as 'en' | 'tr';
    setLanguage(newLang);
    onLanguageChange?.(newLang);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`/api/dictionary/autocomplete?q=${encodeURIComponent(query)}&lang=${language}`);
        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }
        const data = await response.json();
        setSuggestions(data);
      } catch (err) {
        console.error('Autocomplete error:', err);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, language]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const response = await fetch(`/api/dictionary/search?q=${encodeURIComponent(searchQuery)}&lang=${language}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch results');
      }
      const data = await response.json();
      onSearchResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch results. Please try again.');
      onSearchResult(null);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search for a word..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                     placeholder-gray-500 dark:placeholder-gray-400"
          />
          
          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion.word)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600
                           text-gray-900 dark:text-white first:rounded-t-lg last:rounded-b-lg"
                >
                  <div className="font-medium">{suggestion.word}</div>
                  {suggestion.translation && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {suggestion.translation}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="en">English</option>
            <option value="tr">Turkish</option>
          </select>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg
                     hover:bg-blue-700 focus:outline-none focus:ring-2
                     focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50
                     disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-red-600 dark:text-red-400 text-sm">
          {error}
        </p>
      )}
    </form>
  );
} 