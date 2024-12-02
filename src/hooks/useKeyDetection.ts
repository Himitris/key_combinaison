import { useEffect, useCallback } from 'react';
import { KeyState } from '../types';
import { getMouseButtonName } from '../utils/mouseUtils';

export const useKeyDetection = (onKeyPress: (keyState: KeyState) => void) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default behavior only for specific keys that might interfere
    if (e.key === 'Tab' || e.key === 'Space') {
      e.preventDefault();
    }
    
    onKeyPress({
      key: e.key,
      timestamp: Date.now(),
      source: 'keyboard',
    });
  }, [onKeyPress]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    // Prevent context menu for right clicks during training
    if (e.button === 2) {
      e.preventDefault();
    }

    // Only handle mouse events if they occur within the training area
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }

    const buttonName = getMouseButtonName(e.button);
    onKeyPress({
      key: buttonName,
      timestamp: Date.now(),
      source: 'mouse',
    });
  }, [onKeyPress]);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    // Prevent context menu during training
    e.preventDefault();
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [handleKeyDown, handleMouseDown, handleContextMenu]);
};