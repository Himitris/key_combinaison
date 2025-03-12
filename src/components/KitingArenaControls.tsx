import React from 'react';
import { Target, Crosshair, Layers } from 'lucide-react';

interface KitingArenaControlsProps {
  attackRange: number;
  setAttackRange: (range: number) => void;
  targetMode: 'closest-to-player' | 'closest-to-cursor';
  setTargetMode: (mode: 'closest-to-player' | 'closest-to-cursor') => void;
}

export const KitingArenaControls: React.FC<KitingArenaControlsProps> = ({
  attackRange,
  setAttackRange,
  targetMode,
  setTargetMode,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Target className="w-5 h-5 text-indigo-600" />
        Kiting Controls
      </h3>
      
      <div className="space-y-6">
        {/* Attack Range Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="attack-range" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Crosshair className="w-4 h-4 text-gray-500" />
              Attack Range
            </label>
            <span className="text-indigo-600 font-mono text-sm bg-indigo-50 px-2 py-0.5 rounded">
              {attackRange}px
            </span>
          </div>
          
          <input
            id="attack-range"
            type="range"
            min="50"
            max="200"
            step="10"
            value={attackRange}
            onChange={(e) => setAttackRange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>50px</span>
            <span>120px</span>
            <span>200px</span>
          </div>
        </div>
        
        {/* Target Mode Toggle */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-gray-500" />
            Target Priority
          </label>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setTargetMode('closest-to-player')}
              className={`flex-1 flex items-center justify-center py-2 px-3 text-sm rounded-lg transition-all ${
                targetMode === 'closest-to-player' 
                  ? 'bg-white shadow text-indigo-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Closest to Player
            </button>
            <button
              onClick={() => setTargetMode('closest-to-cursor')}
              className={`flex-1 flex items-center justify-center py-2 px-3 text-sm rounded-lg transition-all ${
                targetMode === 'closest-to-cursor' 
                  ? 'bg-white shadow text-indigo-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Closest to Cursor
            </button>
          </div>
          
          <p className="text-xs text-gray-500 italic">
            {targetMode === 'closest-to-player' 
              ? 'Targets the enemy nearest to your character'
              : 'Targets the enemy nearest to your mouse cursor'}
          </p>
        </div>
      </div>
    </div>
  );
};