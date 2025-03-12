import React from 'react';
import { Timer, RotateCcw, AlertCircle, Zap, Trophy, TrendingUp, Medal, Clock, Activity } from 'lucide-react';
import type { SpeedModeStats, LoopModeStats, TrainingMode } from '../types';

interface TrainingStatsProps {
  mode: TrainingMode;
  speedStats: SpeedModeStats;
  loopStats: LoopModeStats;
}

export const TrainingStats: React.FC<TrainingStatsProps> = ({ mode, speedStats, loopStats }) => {
  if (mode === 'speed') {
    const hasAttempts = speedStats.attempts > 0;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-amber-600">
            <Zap className="w-5 h-5" />
            Speed Mode Stats
          </h3>
          {hasAttempts && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Best time:</span>
              <span className="font-mono font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                {speedStats.bestTime === Infinity ? '-' : `${speedStats.bestTime.toFixed(2)}s`}
              </span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`relative overflow-hidden rounded-xl border ${hasAttempts ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50' : 'border-gray-200 bg-gray-50'} p-4`}>
            <div className="flex justify-between mb-4">
              <div className={`p-2 rounded-lg ${hasAttempts ? 'bg-amber-100' : 'bg-gray-100'}`}>
                <RotateCcw className={`w-5 h-5 ${hasAttempts ? 'text-amber-600' : 'text-gray-500'}`} />
              </div>
              {hasAttempts && speedStats.attempts > 5 && (
                <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                  Veteran
                </span>
              )}
            </div>
            <h4 className="text-sm text-gray-500 mb-1">Total Attempts</h4>
            <p className={`text-3xl font-bold ${hasAttempts ? 'text-gray-800' : 'text-gray-400'}`}>
              {speedStats.attempts}
            </p>
            {hasAttempts && (
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-amber-200 rounded-full opacity-20"></div>
            )}
          </div>
          
          <div className={`relative overflow-hidden rounded-xl border ${hasAttempts ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50' : 'border-gray-200 bg-gray-50'} p-4`}>
            <div className="flex justify-between mb-4">
              <div className={`p-2 rounded-lg ${hasAttempts ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Clock className={`w-5 h-5 ${hasAttempts ? 'text-blue-600' : 'text-gray-500'}`} />
              </div>
            </div>
            <h4 className="text-sm text-gray-500 mb-1">Latest Time</h4>
            <p className={`text-3xl font-bold ${hasAttempts ? 'text-gray-800' : 'text-gray-400'}`}>
              {hasAttempts ? `${speedStats.lastTime.toFixed(2)}s` : '-'}
            </p>
            {hasAttempts && (
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-200 rounded-full opacity-20"></div>
            )}
          </div>
          
          <div className={`relative overflow-hidden rounded-xl border ${hasAttempts ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' : 'border-gray-200 bg-gray-50'} p-4`}>
            <div className="flex justify-between mb-4">
              <div className={`p-2 rounded-lg ${hasAttempts ? 'bg-green-100' : 'bg-gray-100'}`}>
                <TrendingUp className={`w-5 h-5 ${hasAttempts ? 'text-green-600' : 'text-gray-500'}`} />
              </div>
              {hasAttempts && speedStats.averageTime < 2 && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Pro
                </span>
              )}
            </div>
            <h4 className="text-sm text-gray-500 mb-1">Average Time</h4>
            <p className={`text-3xl font-bold ${hasAttempts ? 'text-gray-800' : 'text-gray-400'}`}>
              {hasAttempts ? `${speedStats.averageTime.toFixed(2)}s` : '-'}
            </p>
            {hasAttempts && (
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-green-200 rounded-full opacity-20"></div>
            )}
          </div>
          
          <div className={`relative overflow-hidden rounded-xl border ${speedStats.errors > 0 ? 'border-red-200 bg-gradient-to-br from-red-50 to-orange-50' : 'border-gray-200 bg-gray-50'} p-4`}>
            <div className="flex justify-between mb-4">
              <div className={`p-2 rounded-lg ${speedStats.errors > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
                <AlertCircle className={`w-5 h-5 ${speedStats.errors > 0 ? 'text-red-500' : 'text-gray-500'}`} />
              </div>
              {speedStats.errors === 0 && hasAttempts && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Perfect!
                </span>
              )}
            </div>
            <h4 className="text-sm text-gray-500 mb-1">Errors</h4>
            <p className={`text-3xl font-bold ${speedStats.errors > 0 ? 'text-red-600' : 'text-gray-400'}`}>
              {speedStats.errors}
            </p>
            {speedStats.errors > 0 && (
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-red-200 rounded-full opacity-20"></div>
            )}
          </div>
        </div>
        
        {!hasAttempts && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-full mt-0.5">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Start practicing!</h4>
                <p className="text-blue-600 text-sm">Complete your first attempt to see your statistics</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Loop mode stats
  const hasAttempts = loopStats.totalAttempts > 0;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-emerald-600">
          <Trophy className="w-5 h-5" />
          Loop Mode Stats
        </h3>
        {hasAttempts && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Current streak:</span>
            <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
              {loopStats.currentStreak}
            </span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className={`relative overflow-hidden rounded-xl border ${hasAttempts ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50' : 'border-gray-200 bg-gray-50'} p-4`}>
          <div className="flex justify-between mb-4">
            <div className={`p-2 rounded-lg ${hasAttempts ? 'bg-emerald-100' : 'bg-gray-100'}`}>
              <RotateCcw className={`w-5 h-5 ${hasAttempts ? 'text-emerald-600' : 'text-gray-500'}`} />
            </div>
          </div>
          <h4 className="text-sm text-gray-500 mb-1">Total Attempts</h4>
          <p className={`text-3xl font-bold ${hasAttempts ? 'text-gray-800' : 'text-gray-400'}`}>
            {loopStats.totalAttempts}
          </p>
          {hasAttempts && (
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-200 rounded-full opacity-20"></div>
          )}
        </div>
        
        <div className={`relative overflow-hidden rounded-xl border ${hasAttempts ? 'border-green-200 bg-gradient-to-br from-green-50 to-teal-50' : 'border-gray-200 bg-gray-50'} p-4`}>
          <div className="flex justify-between mb-4">
            <div className={`p-2 rounded-lg ${hasAttempts ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Zap className={`w-5 h-5 ${hasAttempts ? 'text-green-600' : 'text-gray-500'}`} />
            </div>
          </div>
          <h4 className="text-sm text-gray-500 mb-1">Success Rate</h4>
          <p className={`text-3xl font-bold ${hasAttempts ? 'text-gray-800' : 'text-gray-400'}`}>
            {hasAttempts ? `${Math.round((loopStats.successfulAttempts / loopStats.totalAttempts) * 100)}%` : '-'}
          </p>
          {hasAttempts && (
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-green-200 rounded-full opacity-20"></div>
          )}
        </div>
        
        <div className={`relative overflow-hidden rounded-xl border ${hasAttempts ? 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50' : 'border-gray-200 bg-gray-50'} p-4`}>
          <div className="flex justify-between mb-4">
            <div className={`p-2 rounded-lg ${hasAttempts ? 'bg-indigo-100' : 'bg-gray-100'}`}>
              <Activity className={`w-5 h-5 ${hasAttempts ? 'text-indigo-600' : 'text-gray-500'}`} />
            </div>
          </div>
          <h4 className="text-sm text-gray-500 mb-1">Current Streak</h4>
          <p className={`text-3xl font-bold ${hasAttempts ? 'text-gray-800' : 'text-gray-400'}`}>
            {loopStats.currentStreak}
          </p>
          {hasAttempts && (
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-200 rounded-full opacity-20"></div>
          )}
        </div>
        
        <div className={`relative overflow-hidden rounded-xl border ${hasAttempts ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50' : 'border-gray-200 bg-gray-50'} p-4`}>
          <div className="flex justify-between mb-4">
            <div className={`p-2 rounded-lg ${hasAttempts ? 'bg-amber-100' : 'bg-gray-100'}`}>
              <Medal className={`w-5 h-5 ${hasAttempts ? 'text-amber-600' : 'text-gray-500'}`} />
            </div>
            {hasAttempts && loopStats.bestStreak >= 10 && (
              <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                Expert
              </span>
            )}
          </div>
          <h4 className="text-sm text-gray-500 mb-1">Best Streak</h4>
          <p className={`text-3xl font-bold ${hasAttempts ? 'text-gray-800' : 'text-gray-400'}`}>
            {loopStats.bestStreak}
          </p>
          {hasAttempts && (
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-amber-200 rounded-full opacity-20"></div>
          )}
        </div>
        
        <div className={`relative overflow-hidden rounded-xl border ${loopStats.errors > 0 ? 'border-red-200 bg-gradient-to-br from-red-50 to-orange-50' : 'border-gray-200 bg-gray-50'} p-4`}>
          <div className="flex justify-between mb-4">
            <div className={`p-2 rounded-lg ${loopStats.errors > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
              <AlertCircle className={`w-5 h-5 ${loopStats.errors > 0 ? 'text-red-500' : 'text-gray-500'}`} />
            </div>
            {loopStats.errors === 0 && hasAttempts && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Flawless
              </span>
            )}
          </div>
          <h4 className="text-sm text-gray-500 mb-1">Errors</h4>
          <p className={`text-3xl font-bold ${loopStats.errors > 0 ? 'text-red-600' : 'text-gray-400'}`}>
            {loopStats.errors}
          </p>
          {loopStats.errors > 0 && (
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-red-200 rounded-full opacity-20"></div>
          )}
        </div>
      </div>
      
      {!hasAttempts && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-full mt-0.5">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Start practicing!</h4>
              <p className="text-blue-600 text-sm">Complete your first attempt to see your statistics</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};