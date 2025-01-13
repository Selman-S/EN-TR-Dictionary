'use client';

import { useState } from 'react';

interface WordFormData {
  word: string;
  language: 'en' | 'tr';
  type: string;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  translation: {
    word: string;
    definition: string;
    examples: string[];
  };
}

interface AddWordFormProps {
  onSuccess?: () => void;
}

const WORD_TYPES = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'preposition',
  'conjunction',
  'interjection'
];

const DIFFICULTY_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function AddWordForm({ onSuccess }: AddWordFormProps) {
  const [formData, setFormData] = useState<WordFormData>({
    word: '',
    language: 'en',
    type: 'noun',
    difficulty: 'B1',
    translation: {
      word: '',
      definition: '',
      examples: ['']
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleExampleChange = (index: number, value: string) => {
    const newExamples = [...formData.translation.examples];
    newExamples[index] = value;
    setFormData({
      ...formData,
      translation: {
        ...formData.translation,
        examples: newExamples
      }
    });
  };

  const addExampleField = () => {
    setFormData({
      ...formData,
      translation: {
        ...formData.translation,
        examples: [...formData.translation.examples, '']
      }
    });
  };

  const removeExampleField = (index: number) => {
    const newExamples = formData.translation.examples.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      translation: {
        ...formData.translation,
        examples: newExamples
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Filter out empty examples
    const validExamples = formData.translation.examples.filter(ex => ex.trim() !== '');

    try {
      const response = await fetch('/api/dictionary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: formData.word,
          language: formData.language,
          difficulty: formData.difficulty,
          translations: [{
            word: formData.translation.word,
            type: formData.type,
            definitions: [formData.translation.definition],
            examples: validExamples
          }]
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add word');
      }

      setSuccess('Word added successfully!');
      resetForm();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add word. Please try again.');
      console.error('Add word error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      word: '',
      language: 'en',
      type: 'noun',
      difficulty: 'B1',
      translation: {
        word: '',
        definition: '',
        examples: ['']
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {success && (
        <div
          className="p-4 rounded-lg bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300"
        >
          {success}
        </div>
      )}

      {error && (
        <div
          className="p-4 rounded-lg bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Word and Language */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Word
            </label>
            <input
              type="text"
              value={formData.word}
              onChange={(e) => setFormData({ ...formData, word: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white
                       focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Language
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value as 'en' | 'tr' })}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white
                       focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="tr">Turkish</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Word Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white
                       focus:border-blue-500 focus:ring-blue-500"
            >
              {WORD_TYPES.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Difficulty Level
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' })}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white
                       focus:border-blue-500 focus:ring-blue-500"
            >
              {DIFFICULTY_LEVELS.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Translation */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Translation
            </label>
            <input
              type="text"
              value={formData.translation.word}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  translation: { ...formData.translation, word: e.target.value }
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white
                       focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Definition
            </label>
            <textarea
              value={formData.translation.definition}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  translation: { ...formData.translation, definition: e.target.value }
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white
                       focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Examples
          </label>
          <button
            type="button"
            onClick={addExampleField}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500"
          >
            + Add Example
          </button>
        </div>
        {formData.translation.examples.map((example, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={example}
              onChange={(e) => handleExampleChange(index, e.target.value)}
              className="flex-1 rounded-md border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white
                       focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter an example"
            />
            {formData.translation.examples.length > 1 && (
              <button
                type="button"
                onClick={() => removeExampleField(index)}
                className="px-2 py-1 text-red-600 dark:text-red-400 hover:text-red-500"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200"
        >
          {loading ? 'Adding...' : 'Add Word'}
        </button>
      </div>
    </form>
  );
} 