import React from 'react';
import { Zap, Repeat, Sword } from 'lucide-react';
import type { TrainingMode } from '../types';

interface TrainingModeSelectorProps {
  mode: TrainingMode;
  onModeChange: (mode: TrainingMode) => void;
}

export const TrainingModeSelector: React.FC<TrainingModeSelectorProps> = ({
  mode,
  onModeChange,
}) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => onModeChange('speed')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          ${
            mode === 'speed'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }
        `}
      >
        <Zap className="w-4 h-4" />
        Speed Mode
      </button>
      <button
        onClick={() => onModeChange('loop')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          ${
            mode === 'loop'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }
        `}
      >
        <Repeat className="w-4 h-4" />
        Loop Mode
      </button>
      <button
        onClick={() => onModeChange('kiting')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          ${
            mode === 'kiting'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }
        `}
      >
        <Sword className="w-4 h-4" />
        Kiting Mode
      </button>
    </div>
  );
};