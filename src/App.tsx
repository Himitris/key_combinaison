import React, { useState, useCallback } from 'react';
import { KeyDisplay } from './components/KeyDisplay';
import { TrainingStats } from './components/TrainingStats';
import { TrainingModeSelector } from './components/TrainingModeSelector';
import { CombinationEditor } from './components/CombinationEditor';
import { KitingArena } from './components/KitingArena';
import { ImprovedHeader } from './components/ImprovedHeader';
import { useKeySequence } from './hooks/useKeySequence';
import { useKeyDetection } from './hooks/useKeyDetection';
import { Shield, Keyboard } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Improved Header Component */}
      <ImprovedHeader />
      
      <div className="max-w-5xl mx-auto px-4 -mt-6 space-y-10 relative z-10 pb-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="border-b border-gray-100 px-8 py-6">
            <TrainingModeSelector mode={mode} onModeChange={setMode} />
          </div>
          
          <div className="p-8 space-y-10">
            <CombinationEditor
              isRecording={isRecording}
              onStartRecording={handleStartRecording}
              onSaveCombination={handleSaveCombination}
              currentSequence={sequence.current}
            />

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <h2 className="text-xl font-semibold text-indigo-800 mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Current Combination
              </h2>
              <KeyDisplay 
                sequence={combination}
                currentIndex={sequence.index}
              />
            </div>

            {mode === 'kiting' && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Kiting Arena</h2>
                <p className="text-gray-600 mb-4">
                  Use right-click to move, Q to reveal attack range, and left-click to attack enemies within range.
                </p>
                <KitingArena onKeyPress={(key) => {
                  handleKeyEvent({
                    key,
                    timestamp: Date.now(),
                    source: key.toLowerCase().includes('mouse') ? 'mouse' : 'keyboard'
                  });
                }} />
              </div>
            )}

            <TrainingStats 
              mode={mode}
              speedStats={speedStats}
              loopStats={loopStats}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tips & Tricks</h3>
          <ul className="text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <div className="min-w-4 h-4 bg-indigo-500 rounded-full mt-1.5"></div>
              <p>Record custom combinations to practice specific actions for your games</p>
            </li>
            <li className="flex items-start gap-2">
              <div className="min-w-4 h-4 bg-indigo-500 rounded-full mt-1.5"></div>
              <p>Use Kiting Mode to practice movement and attack patterns like in MOBAs</p>
            </li>
            <li className="flex items-start gap-2">
              <div className="min-w-4 h-4 bg-indigo-500 rounded-full mt-1.5"></div>
              <p>Loop Mode helps build muscle memory through repetition</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;