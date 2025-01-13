'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Word {
  word: string;
  translations: Array<{
    word: string;
    type: string;
  }>;
}

interface WordListProps {
  language: 'en' | 'tr';
  onSearchResult: (result: any | null) => void;
}

const ENGLISH_LETTERS = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const TURKISH_LETTERS = ['Tümü', 'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H', 'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'];

export default function WordList({ language, onSearchResult }: WordListProps) {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState(language === 'en' ? 'All' : 'Tümü');
  const router = useRouter();

  // Reset selected letter when language changes
  useEffect(() => {
    setSelectedLetter(language === 'en' ? 'All' : 'Tümü');
  }, [language]);

  const handleWordClick = async (word: string) => {
    try {
      const response = await fetch(`/api/dictionary/search?q=${encodeURIComponent(word)}&lang=${language}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch word details');
      }
      const data = await response.json();
      onSearchResult(data);
    } catch (err: any) {
      console.error('Word details fetch error:', err);
      onSearchResult(null);
    }
  };

  const fetchWords = async () => {
    setLoading(true);
    setError(null);

    try {
      const letterParam = selectedLetter === (language === 'en' ? 'All' : 'Tümü') ? '' : selectedLetter.toLowerCase();
      console.log(letterParam);
      
      const response = await fetch(
        letterParam 
          ? `/api/dictionary/words/${letterParam}?lang=${language}&page=${page}&limit=12`
          : `/api/dictionary/words?lang=${language}&page=${page}&limit=12`
      );
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch words');
      }

      const data = await response.json();
      if (data.length < 12) {
        setHasMore(false);
      }
      
      setWords(prev => page === 1 ? data : [...prev, ...data]);
    } catch (err: any) {
      setError(err.message || 'Failed to load words. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setWords([]);
  }, [language, selectedLetter]);

  useEffect(() => {
    fetchWords();
  }, [language, page, selectedLetter]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8 text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  const letters = language === 'en' ? ENGLISH_LETTERS : TURKISH_LETTERS;

  return (
    <div>
      {/* Letter Filter */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex flex-wrap gap-2 justify-center">
          {letters.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200
                ${selectedLetter === letter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {words.map((word, index) => (
          <div
            key={`${word.word}-${index}`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg
                     transition-shadow duration-200 cursor-pointer"
            onClick={() => handleWordClick(word.word)}
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {word.word}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {word.translations.map(t => t.word).join(', ')}
            </p>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      )}

      {!loading && hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg
                     hover:bg-blue-700 focus:outline-none focus:ring-2
                     focus:ring-blue-500 focus:ring-offset-2
                     transition-colors duration-200"
          >
            Load More
          </button>
        </div>
      )}

      {!loading && !hasMore && words.length > 0 && (
        <p className="text-center py-8 text-gray-600 dark:text-gray-300">
          No more words to load.
        </p>
      )}

      {!loading && words.length === 0 && (
        <p className="text-center py-8 text-gray-600 dark:text-gray-300">
          No words found.
        </p>
      )}
    </div>
  );
} 