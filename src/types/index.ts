export interface KeyCombination {
  keys: string[];
  description: string;
}

export interface SpeedModeStats {
  attempts: number;
  bestTime: number;
  lastTime: number;
  averageTime: number;
  errors: number;
}

export interface LoopModeStats {
  totalAttempts: number;
  successfulAttempts: number;
  currentStreak: number;
  bestStreak: number;
  errors: number;
}

export type TrainingMode = 'speed' | 'loop';

export interface KeySequence {
  current: string[];
  target: string[];
  index: number;
}

export interface KeyState {
  key: string;
  timestamp: number;
  source: 'keyboard' | 'mouse' | 'button';
}