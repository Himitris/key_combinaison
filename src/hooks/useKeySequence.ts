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

    if (currentTime - lastKeyTimestamp > SEQUENCE_TIMEOUT) {
      resetSequence();
    }

    setLastKeyTimestamp(currentTime);

    if (isRecording) {
      setSequence(prev => ({
        ...prev,
        current: [...prev.current, normalizedKey],
      }));
      return { isCorrect: false, isComplete: false };
    }

    setSequence(prev => {
      const expectedKey = prev.target[prev.index];
      const isCorrectKey = normalizedKey === expectedKey.toLowerCase();
      const newIndex = isCorrectKey ? prev.index + 1 : 0;
      const newCurrent = isCorrectKey 
        ? [...prev.current, normalizedKey]
        : [normalizedKey];

      return {
        ...prev,
        current: newCurrent,
        index: newIndex,
      };
    });

    const isCorrect = normalizedKey === targetSequence[sequence.index].toLowerCase();
    const isComplete = isCorrect && sequence.index === targetSequence.length - 1;

    return { isCorrect, isComplete };
  }, [sequence, lastKeyTimestamp, isRecording, targetSequence, resetSequence]);

  return {
    sequence,
    handleKeyPress,
    resetSequence,
    isRecording,
    setIsRecording,
  };
};