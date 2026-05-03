/* ============================================
   Bacar.az — Typewriter Hook
   ============================================ */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Typewriter efekti hook'u
 * @param {string[]} words - Sırayla yazılacak kelimeler
 * @param {number} typingSpeed - Yazma hızı (ms)
 * @param {number} deletingSpeed - Silme hızı (ms)
 * @param {number} pauseTime - Kelimeler arası bekleme (ms)
 */
export function useTypewriter(words, typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const pauseTimerRef = useRef(null);

  const tick = useCallback(() => {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      setText(currentWord.substring(0, text.length - 1));
    } else {
      setText(currentWord.substring(0, text.length + 1));
    }

    if (!isDeleting && text === currentWord) {
      // Kelime tamamlandı — son kelimeyse dur
      if (wordIndex === words.length - 1) {
        setIsComplete(true);
        return;
      }
      // Bekle, sonra silmeye başla
      pauseTimerRef.current = setTimeout(() => setIsDeleting(true), pauseTime);
      return;
    }

    if (isDeleting && text === '') {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    }
  }, [text, wordIndex, isDeleting, words, pauseTime]);

  useEffect(() => {
    if (isComplete) return;
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(tick, speed);
    return () => {
      clearTimeout(timer);
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, [tick, isDeleting, typingSpeed, deletingSpeed, isComplete]);

  return { text, isComplete };
}
