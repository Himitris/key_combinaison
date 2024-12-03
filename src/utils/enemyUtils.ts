import { Position, Enemy } from '../types';

export const generateRandomPosition = (width: number, height: number): Position => ({
  x: Math.random() * width,
  y: Math.random() * height,
});

export const isInRange = (source: Position, target: Position, range: number): boolean => {
  const dx = source.x - target.x;
  const dy = source.y - target.y;
  return Math.sqrt(dx * dx + dy * dy) <= range;
};

export const createEnemy = (position: Position): Enemy => ({
  id: Math.random().toString(36).substr(2, 9),
  position,
  health: 100,
  isBeingAttacked: false,
  deathAnimation: 0,
});