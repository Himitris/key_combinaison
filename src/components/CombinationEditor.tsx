import React from 'react';
import { Plus, Save, Trash, MousePointer, Keyboard } from 'lucide-react';
import { formatKeyDisplay } from '../utils/keyUtils';

interface CombinationEditorProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onSaveCombination: (keys: string[]) => void;
  currentSequence: string[];
}

export const CombinationEditor: React.FC<CombinationEditorProps> = ({
  isRecording,
  onStartRecording,
  onSaveCombination,
  currentSequence,
}) => {
  // Function to determine which icon to use based on key type
  const getKeyIcon = (key: string) => {
    if (key.toLowerCase().includes('click')) {
      return <MousePointer className="w-4 h-4" />;
    }
    return <Keyboard className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-800 p-1.5 rounded">
            <Keyboard className="w-5 h-5" />
          </span>
          Edit Combination
        </h3>
        {isRecording ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSaveCombination(currentSequence);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 shadow-md transition-all duration-200 font-medium"
          >
            <Save className="w-4 h-4" />
            Save Combination
          </button>
        ) : (
          <button
            onClick={onStartRecording}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 shadow-md transition-all duration-200 font-medium"
          >
            <Plus className="w-4 h-4" />
            Record New
          </button>
        )}
      </div>
      
      {isRecording ? (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500 animate-pulse"></div>
          
          <div className="flex justify-between items-center mb-4">
            <p className="text-indigo-800 font-medium flex items-center gap-2">
              <span className="bg-red-100 p-1 rounded-full">
                <span className="block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </span>
              Recording Key Sequence
            </p>
            {currentSequence.length > 0 && (
              <button 
                onClick={() => onSaveCombination([])}
                className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
              >
                <Trash className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <p className="text-gray-600 mb-4">Press your desired key sequence:</p>
          
          {currentSequence.length > 0 ? (
            <div className="flex gap-2 flex-wrap items-center">
              {currentSequence.map((key, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <div className="text-indigo-400 font-bold">→</div>
                  )}
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg border border-indigo-200 shadow-sm">
                    <span className="p-1 bg-indigo-100 rounded text-indigo-800">
                      {getKeyIcon(key)}
                    </span>
                    <span className="font-medium text-gray-800">{formatKeyDisplay(key)}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg bg-white/50">
              <div className="flex justify-center mb-2">
                <Keyboard className="w-8 h-8 text-gray-400" />
              </div>
              <p>Press any keys or mouse buttons to record your combination</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <p className="text-gray-600">
            Click "Record New" to create a custom key combination, or use the default combination shown below.
          </p>
        </div>
      )}
    </div>
  );
};