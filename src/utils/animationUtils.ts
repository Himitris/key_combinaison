import { Position } from '../types';

export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

export const calculateAttackPosition = (
  start: Position,
  end: Position,
  progress: number
): Position => {
  return {
    x: lerp(start.x, end.x, progress),
    y: lerp(start.y, end.y, progress),
  };
};