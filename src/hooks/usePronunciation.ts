import { useState } from 'react';

interface Phonetic {
  audio: string;
  text?: string;
}

interface DictionaryResponse {
  phonetics: Phonetic[];
}

export function usePronunciation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const speak = async (word: string, language: 'en' | 'tr') => {
    setError(null);

    try {
      if (language === 'tr') {
        // For Turkish words, use browser's speech synthesis
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(word);
          utterance.lang = 'tr-TR';
          window.speechSynthesis.speak(utterance);
        } else {
          throw new Error('Speech synthesis not supported');
        }
      } else {
        // For English words, use the Free Dictionary API
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch pronunciation');
        }

        const data: DictionaryResponse[] = await response.json();
        const audio = data[0]?.phonetics?.find((p: Phonetic) => p.audio)?.audio;

        if (audio) {
          const sound = new Audio(audio);
          setIsPlaying(true);
          await sound.play();
          setIsPlaying(false);
        } else {
          throw new Error('No pronunciation available');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to play pronunciation');
      console.error('Pronunciation error:', err);
    }
  };

  return { speak, isPlaying, error };
} 