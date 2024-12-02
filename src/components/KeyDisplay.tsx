import React from 'react';
import { Keyboard } from 'lucide-react';
import { formatKeyDisplay } from '../utils/keyUtils';

interface KeyDisplayProps {
  sequence: string[];
  currentIndex: number;
}

export const KeyDisplay: React.FC<KeyDisplayProps> = ({ sequence, currentIndex }) => {
  return (
    <div className="flex gap-2 items-center justify-center flex-wrap">
      {sequence.map((key, index) => (
        <div
          key={index}
          className={`
            flex items-center justify-center
            px-4 py-2 rounded-lg
            border-2 min-w-[60px]
            ${
              index === currentIndex
                ? 'bg-blue-500 text-white border-blue-600'
                : index < currentIndex
                ? 'bg-green-500 text-white border-green-600'
                : 'bg-white border-gray-300'
            }
          `}
        >
          <Keyboard className="w-4 h-4 mr-1" />
          <span className="font-medium">{formatKeyDisplay(key)}</span>
          <span className="ml-2 text-sm opacity-75">#{index + 1}</span>
        </div>
      ))}
    </div>
  );
};