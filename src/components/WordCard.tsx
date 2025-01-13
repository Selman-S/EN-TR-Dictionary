'use client';

import { useState } from 'react';
import { usePronunciation } from '@/hooks/usePronunciation';

interface WordCardProps {
  word: {
    word: string;
    language: 'en' | 'tr';
    difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    translations: Array<{
      word: string;
      type: string;
      definitions: string[];
      examples: string[];
    }>;
  };
  sourceLang: 'en' | 'tr';
}

const difficultyColors = {
  'A1': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'A2': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  'B1': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'B2': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  'C1': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'C2': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300'
};

export default function WordCard({ word, sourceLang }: WordCardProps) {
  const [activeTab, setActiveTab] = useState(0);
  const { speak, isPlaying, error: pronunciationError } = usePronunciation();

  const handlePronounce = () => {
    speak(word.word, sourceLang);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Word header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {word.word}
            </h2>
            <span className={`px-2 py-1 rounded text-sm font-medium ${difficultyColors[word.difficulty]}`}>
              {word.difficulty}
            </span>
          </div>
          <button
            onClick={handlePronounce}
            disabled={isPlaying}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          </button>
        </div>
        {pronunciationError && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {pronunciationError}
          </p>
        )}
      </div>

      {/* Translations tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto">
          {word.translations.map((translation, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200
                       ${activeTab === index
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              {translation.type}
            </button>
          ))}
        </div>
      </div>

      {/* Translation content */}
      <div className="p-6">
        {word.translations[activeTab] && (
          <div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {word.translations[activeTab].word}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {word.translations[activeTab].type}
              </p>
            </div>

            {/* Definitions */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                Definitions
              </h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {word.translations[activeTab].definitions.map((definition, index) => (
                  <li key={index}>{definition}</li>
                ))}
              </ul>
            </div>

            {/* Examples */}
            {word.translations[activeTab].examples.length > 0 && (
              <div className="mt-6 space-y-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  Examples
                </h4>
                <ul className="space-y-2">
                  {word.translations[activeTab].examples.map((example, index) => (
                    <li
                      key={index}
                      className="pl-4 border-l-2 border-gray-200 dark:border-gray-700
                               text-gray-600 dark:text-gray-400"
                    >
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 