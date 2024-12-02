import React, { useState, useCallback } from 'react';
import { KeyDisplay } from './components/KeyDisplay';
import { TrainingStats } from './components/TrainingStats';
import { TrainingModeSelector } from './components/TrainingModeSelector';
import { CombinationEditor } from './components/CombinationEditor';
import { KitingArena } from './components/KitingArena';
import { useKeySequence } from './hooks/useKeySequence';
import { useKeyDetection } from './hooks/useKeyDetection';
import type { TrainingMode, SpeedModeStats, LoopModeStats } from './types';

function App() {
  const [mode, setMode] = useState<TrainingMode>('speed');
  const [combination, setCombination] = useState(['right click', 'q', 'left click']);
  const [speedStats, setSpeedStats] = useState<SpeedModeStats>({
    attempts: 0,
    bestTime: Infinity,
    lastTime: 0,
    averageTime: 0,
    errors: 0,
  });
  const [loopStats, setLoopStats] = useState<LoopModeStats>({
    totalAttempts: 0,
    successfulAttempts: 0,
    currentStreak: 0,
    bestStreak: 0,
    errors: 0,
  });
  const [startTime, setStartTime] = useState<number | null>(null);

  const {
    sequence,
    handleKeyPress,
    resetSequence,
    isRecording,
    setIsRecording,
  } = useKeySequence(combination);

  const handleKeyEvent = useCallback((keyState: { key: string; timestamp: number; source: 'keyboard' | 'mouse' | 'button' }) => {
    if (!startTime && !isRecording) {
      setStartTime(Date.now());
    }

    const { isCorrect, isComplete } = handleKeyPress(keyState);

    if (!isCorrect && !isRecording) {
      if (mode === 'speed') {
        setSpeedStats(prev => ({
          ...prev,
          errors: prev.errors + 1,
        }));
      } else {
        setLoopStats(prev => ({
          ...prev,
          errors: prev.errors + 1,
          currentStreak: 0,
          totalAttempts: prev.totalAttempts + 1,
        }));
      }
      resetSequence();
      setStartTime(null);
    }

    if (isComplete && startTime) {
      const time = (Date.now() - startTime) / 1000;
      
      if (mode === 'speed') {
        setSpeedStats(prev => ({
          attempts: prev.attempts + 1,
          bestTime: Math.min(prev.bestTime, time),
          lastTime: time,
          averageTime: (prev.averageTime * prev.attempts + time) / (prev.attempts + 1),
          errors: prev.errors,
        }));
      } else {
        setLoopStats(prev => {
          const newStreak = prev.currentStreak + 1;
          return {
            totalAttempts: prev.totalAttempts + 1,
            successfulAttempts: prev.successfulAttempts + 1,
            currentStreak: newStreak,
            bestStreak: Math.max(prev.bestStreak, newStreak),
            errors: prev.errors,
          };
        });
      }
      
      setStartTime(null);
      resetSequence();
    }
  }, [handleKeyPress, resetSequence, startTime, isRecording, mode]);

  useKeyDetection(handleKeyEvent);

  const handleStartRecording = useCallback(() => {
    setIsRecording(true);
    resetSequence();
  }, [setIsRecording, resetSequence]);

  const handleSaveCombination = useCallback((keys: string[]) => {
    setCombination(keys);
    setIsRecording(false);
    setSpeedStats({
      attempts: 0,
      bestTime: Infinity,
      lastTime: 0,
      averageTime: 0,
      errors: 0,
    });
    setLoopStats({
      totalAttempts: 0,
      successfulAttempts: 0,
      currentStreak: 0,
      bestStreak: 0,
      errors: 0,
    });
    resetSequence();
  }, [resetSequence]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Key Combination Trainer
          </h1>
          <p className="text-gray-600">
            Practice your keyboard shortcuts and improve your speed
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm space-y-8">
          <TrainingModeSelector mode={mode} onModeChange={setMode} />
          
          <CombinationEditor
            isRecording={isRecording}
            onStartRecording={handleStartRecording}
            onSaveCombination={handleSaveCombination}
            currentSequence={sequence.current}
          />

          {mode === 'kiting' && (
            <KitingArena onKeyPress={(key) => {
              handleKeyEvent({
                key,
                timestamp: Date.now(),
                source: key.toLowerCase().includes('mouse') ? 'mouse' : 'keyboard'
              });
            }} />
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Current Combination
            </h2>
            <KeyDisplay 
              sequence={combination}
              currentIndex={sequence.index}
            />
          </div>

          <TrainingStats 
            mode={mode}
            speedStats={speedStats}
            loopStats={loopStats}
          />
        </div>
      </div>
    </div>
  );
}

export default App;