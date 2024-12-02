import { useState, useCallback } from 'react';
import { KeySequence, KeyState } from '../types';
import { normalizeKey } from '../utils/keyUtils';

const SEQUENCE_TIMEOUT = 1000; // 1 second timeout between keys

export const useKeySequence = (targetSequence: string[]) => {
  const [sequence, setSequence] = useState<KeySequence>({
    current: [],
    target: targetSequence,
    index: 0,
  });
  const [lastKeyTimestamp, setLastKeyTimestamp] = useState<number>(0);
  const [isRecording, setIsRecording] = useState(false);

  const resetSequence = useCallback(() => {
    setSequence({
      current: [],
      target: targetSequence,
      index: 0,
    });
    setLastKeyTimestamp(0);
  }, [targetSequence]);

  const handleKeyPress = useCallback((keyState: KeyState) => {
    const normalizedKey = normalizeKey(keyState.key);
    const currentTime = keyState.timestamp;

    // Only reset if we're not recording and there's been a timeout
    if (!isRecording && currentTime - lastKeyTimestamp > SEQUENCE_TIMEOUT && sequence.current.length > 0) {
      resetSequence();
      return { isCorrect: false, isComplete: false };
    }

    setLastKeyTimestamp(currentTime);

    if (isRecording) {
      setSequence(prev => ({
        ...prev,
        current: [...prev.current, normalizedKey],
      }));
      return { isCorrect: true, isComplete: false };
    }

    const expectedKey = targetSequence[sequence.index]?.toLowerCase();
    const isCorrectKey = normalizedKey === expectedKey;

    setSequence(prev => ({
      ...prev,
      current: [...prev.current, normalizedKey],
      index: isCorrectKey ? prev.index + 1 : 0,
    }));

    // If the key was incorrect, we'll reset on the next frame to avoid immediate reset
    if (!isCorrectKey) {
      setTimeout(() => {
        setSequence(prev => ({
          ...prev,
          current: [],
          index: 0,
        }));
      }, 0);
    }

    const isComplete = isCorrectKey && sequence.index === targetSequence.length - 1;

    return { isCorrect: isCorrectKey, isComplete };
  }, [sequence, lastKeyTimestamp, isRecording, targetSequence, resetSequence]);

  return {
    sequence,
    handleKeyPress,
    resetSequence,
    isRecording,
    setIsRecording,
  };
};