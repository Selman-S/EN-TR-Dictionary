'use client';

import { useState } from 'react';
import SearchComponent from '@/components/SearchComponent';
import WordList from '@/components/WordList';
import WordCard from '@/components/WordCard';
import AddWordForm from '@/components/AddWordForm';
import Modal from '@/components/Modal';
import DarkModeToggle from '@/components/DarkModeToggle';

interface WordResult {
  word: string;
  language: 'en' | 'tr';
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  translations: Array<{
    word: string;
    type: string;
    definitions: string[];
    examples: string[];
  }>;
}

export default function Home() {
  const [searchResult, setSearchResult] = useState<WordResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'tr'>('en');

  const handleSearchResult = (result: WordResult | null) => {
    setSearchResult(result);
    // Scroll to the search result if it exists
    if (result) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLanguageChange = (lang: 'en' | 'tr') => {
    setCurrentLanguage(lang);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              English-Turkish Dictionary
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              Search words in English or Turkish
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md
                       text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2
                       focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              + Add New Word
            </button>
          </div>
          <div className="flex-none">
            <DarkModeToggle />
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto mb-8">
          <SearchComponent 
            onSearchResult={handleSearchResult} 
            onLanguageChange={handleLanguageChange}
          />
        </div>

        {/* Search Result */}
        {searchResult && (
          <div className="max-w-3xl mx-auto mb-12">
            <WordCard word={searchResult} sourceLang={searchResult.language} />
          </div>
        )}

        {/* Word list */}
        <WordList 
          language={currentLanguage} 
          onSearchResult={handleSearchResult}
        />
      </div>

      {/* Add Word Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Word"
      >
        <AddWordForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </main>
  );
}
