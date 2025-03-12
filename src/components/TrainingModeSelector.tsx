import React from 'react';
import { Zap, Repeat, Sword, Clock, Target } from 'lucide-react';
import type { TrainingMode } from '../types';

interface TrainingModeSelectorProps {
  mode: TrainingMode;
  onModeChange: (mode: TrainingMode) => void;
}

export const TrainingModeSelector: React.FC<TrainingModeSelectorProps> = ({
  mode,
  onModeChange,
}) => {
  const modes = [
    {
      id: 'speed',
      label: 'Speed Mode',
      icon: <Zap className="w-5 h-5" />,
      description: 'Practice executing combinations as quickly as possible',
      color: 'from-amber-500 to-orange-500',
      hoverColor: 'from-amber-600 to-orange-600',
      iconBg: 'bg-amber-100 text-amber-600',
    },
    {
      id: 'loop',
      label: 'Loop Mode',
      icon: <Repeat className="w-5 h-5" />,
      description: 'Continuously repeat combinations to build muscle memory',
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'from-green-600 to-emerald-600',
      iconBg: 'bg-green-100 text-green-600',
    },
    {
      id: 'kiting',
      label: 'Kiting Mode',
      icon: <Sword className="w-5 h-5" />,
      description: 'Practice movement and attack patterns like in MOBAs',
      color: 'from-blue-500 to-indigo-500',
      hoverColor: 'from-blue-600 to-indigo-600',
      iconBg: 'bg-blue-100 text-blue-600',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
        <Target className="w-5 h-5 text-indigo-600" />
        Training Mode
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {modes.map((item) => {
          const isActive = mode === item.id as TrainingMode;
          
          return (
            <button
              key={item.id}
              onClick={() => onModeChange(item.id as TrainingMode)}
              className={`
                relative overflow-hidden rounded-xl border transition-all duration-200
                ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white border-transparent shadow-lg`
                    : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300 hover:shadow-md'
                }
              `}
            >
              {/* Accent corner */}
              {isActive && (
                <div className="absolute top-0 right-0 w-8 h-8 bg-white/20 transform rotate-45 translate-x-4 -translate-y-4"></div>
              )}
              
              <div className="px-4 py-3 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20' : item.iconBg}`}>
                    {item.icon}
                  </span>
                  <span className={`font-semibold ${isActive ? 'text-white' : 'text-gray-800'}`}>
                    {item.label}
                  </span>
                </div>
                
                <p className={`text-sm ${isActive ? 'text-white/80' : 'text-gray-600'}`}>
                  {item.description}
                </p>
                
                {isActive && (
                  <div className="mt-2 pt-2 border-t border-white/20 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-xs">Active Mode</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};