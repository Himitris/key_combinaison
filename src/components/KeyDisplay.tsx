import React from 'react';
import { Keyboard, MousePointer, ChevronRight } from 'lucide-react';
import { formatKeyDisplay } from '../utils/keyUtils';

interface KeyDisplayProps {
  sequence: string[];
  currentIndex: number;
}

export const KeyDisplay: React.FC<KeyDisplayProps> = ({ sequence, currentIndex }) => {
  // Function to determine which icon to use based on key type
  const getKeyIcon = (key: string) => {
    if (key.toLowerCase().includes('click')) {
      return <MousePointer className="w-4 h-4" />;
    }
    return <Keyboard className="w-4 h-4" />;
  };

  // Function to determine key background/border color based on status
  const getKeyStyles = (index: number) => {
    if (index === currentIndex) {
      return {
        container: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-600 animate-pulse',
        innerBg: 'bg-blue-600/20',
        shadow: 'shadow-lg shadow-blue-500/30'
      };
    } else if (index < currentIndex) {
      return {
        container: 'bg-gradient-to-r from-green-500 to-teal-500 text-white border-green-600',
        innerBg: 'bg-green-600/20',
        shadow: 'shadow-md shadow-green-500/20'
      };
    }
    return {
      container: 'bg-white text-gray-800 border-gray-200 hover:border-gray-300',
      innerBg: 'bg-gray-50',
      shadow: 'shadow-sm'
    };
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
      {sequence.map((key, index) => {
        const styles = getKeyStyles(index);
        
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
            
            <div
              className={`
                flex flex-col items-center
                rounded-xl ${styles.shadow}
                border-2 min-w-16 overflow-hidden transition-all duration-200
                ${styles.container}
              `}
            >
              <div className="w-full px-4 py-3 font-medium flex items-center justify-center gap-2">
                {getKeyIcon(key)}
                <span className="font-medium">{formatKeyDisplay(key)}</span>
              </div>
              
              <div className={`w-full ${styles.innerBg} px-2 py-1 text-xs flex justify-between border-t border-t-black/10`}>
                <span className="opacity-75">{index + 1}</span>
                {index === currentIndex && <span className="animate-pulse">Active</span>}
                {index < currentIndex && <span>✓</span>}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};