import React from 'react';
import { Timer, RotateCcw, AlertCircle, Zap, Trophy } from 'lucide-react';
import type { SpeedModeStats, LoopModeStats, TrainingMode } from '../types';

interface TrainingStatsProps {
  mode: TrainingMode;
  speedStats: SpeedModeStats;
  loopStats: LoopModeStats;
}

export const TrainingStats: React.FC<TrainingStatsProps> = ({ mode, speedStats, loopStats }) => {
  if (mode === 'speed') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Speed Mode Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard
            icon={<RotateCcw />}
            label="Attempts"
            value={speedStats.attempts.toString()}
          />
          <StatCard
            icon={<Timer />}
            label="Best Time"
            value={speedStats.bestTime === Infinity ? '-' : `${speedStats.bestTime.toFixed(2)}s`}
          />
          <StatCard
            icon={<Timer />}
            label="Last Time"
            value={speedStats.lastTime === 0 ? '-' : `${speedStats.lastTime.toFixed(2)}s`}
          />
          <StatCard
            icon={<Timer />}
            label="Average"
            value={speedStats.averageTime === 0 ? '-' : `${speedStats.averageTime.toFixed(2)}s`}
          />
          <StatCard
            icon={<AlertCircle />}
            label="Errors"
            value={speedStats.errors.toString()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Loop Mode Stats
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          icon={<RotateCcw />}
          label="Total Attempts"
          value={loopStats.totalAttempts.toString()}
        />
        <StatCard
          icon={<Zap />}
          label="Successful"
          value={`${loopStats.successfulAttempts} (${Math.round(
            (loopStats.successfulAttempts / Math.max(loopStats.totalAttempts, 1)) * 100
          )}%)`}
        />
        <StatCard
          icon={<Trophy />}
          label="Current Streak"
          value={loopStats.currentStreak.toString()}
        />
        <StatCard
          icon={<Trophy />}
          label="Best Streak"
          value={loopStats.bestStreak.toString()}
        />
        <StatCard
          icon={<AlertCircle />}
          label="Errors"
          value={loopStats.errors.toString()}
        />
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center gap-2 text-gray-600 mb-2">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);