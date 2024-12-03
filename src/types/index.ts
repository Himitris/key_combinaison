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

export type TrainingMode = 'speed' | 'loop' | 'kiting';

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

export interface Position {
  x: number;
  y: number;
}

export interface Character {
  position: Position;
  targetPosition: Position | null;
  isAttackRangeVisible: boolean;
}

export interface Enemy {
  id: string;
  position: Position;
  health: number;
  isBeingAttacked: boolean;
  deathAnimation: number;
}

export interface Attack {
  id: string;
  position: Position;
  targetPosition: Position;
  progress: number;
}