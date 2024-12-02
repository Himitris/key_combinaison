import React from 'react';
import { Plus, Save, X } from 'lucide-react';
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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Edit Combination</h3>
        {isRecording ? (
          <button
            onClick={() => onSaveCombination(currentSequence)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        ) : (
          <button
            onClick={onStartRecording}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            Record New
          </button>
        )}
      </div>
      {isRecording && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Press your desired key sequence:</p>
          <div className="flex gap-2 flex-wrap">
            {currentSequence.map((key, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white rounded border border-gray-300 text-sm"
              >
                {formatKeyDisplay(key)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};