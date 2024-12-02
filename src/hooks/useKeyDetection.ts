import { useEffect, useCallback } from 'react';
import { KeyState } from '../types';

export const useKeyDetection = (onKeyPress: (keyState: KeyState) => void) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    onKeyPress({
      key: e.key,
      timestamp: Date.now(),
      source: 'keyboard',
    });
  }, [onKeyPress]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    const buttonMap: { [key: number]: string } = {
      0: 'MouseLeft',
      1: 'MouseMiddle',
      2: 'MouseRight',
    };
    
    onKeyPress({
      key: buttonMap[e.button] || `Mouse${e.button}`,
      timestamp: Date.now(),
      source: 'mouse',
    });
  }, [onKeyPress]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleKeyDown, handleMouseDown]);
};