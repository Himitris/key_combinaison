import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Character, Position } from '../types';

interface KitingArenaProps {
  onKeyPress: (key: string) => void;
}

const ARENA_WIDTH = 800;
const ARENA_HEIGHT = 400;
const CHARACTER_SIZE = 30;
const ATTACK_RANGE = 100;
const MOVEMENT_SPEED = 200; // pixels per second

export const KitingArena: React.FC<KitingArenaProps> = ({ onKeyPress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [character, setCharacter] = useState<Character>({
    position: { x: ARENA_WIDTH / 2, y: ARENA_HEIGHT / 2 },
    targetPosition: null,
    isAttackRangeVisible: false,
  });

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (e.button === 2) { // Right click
      setCharacter(prev => ({
        ...prev,
        targetPosition: { x, y },
        isAttackRangeVisible: false,
      }));
      onKeyPress('MouseRight');
    } else if (e.button === 0) { // Left click
      setCharacter(prev => ({
        ...prev,
        targetPosition: { x, y },
      }));
      onKeyPress('MouseLeft');
    }
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'q') {
      setCharacter(prev => ({
        ...prev,
        isAttackRangeVisible: true,
      }));
      onKeyPress('q');
    }
  }, [onKeyPress]);

  const updateCharacterPosition = useCallback((ctx: CanvasRenderingContext2D) => {
    setCharacter(prev => {
      if (!prev.targetPosition) return prev;

      const dx = prev.targetPosition.x - prev.position.x;
      const dy = prev.targetPosition.y - prev.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= 1) return prev;

      const speed = MOVEMENT_SPEED / 60; // pixels per frame
      const ratio = speed / distance;
      
      return {
        ...prev,
        position: {
          x: prev.position.x + dx * ratio,
          y: prev.position.y + dy * ratio,
        },
      };
    });
  }, []);

  const drawScene = useCallback((ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // Draw background grid
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    for (let x = 0; x < ARENA_WIDTH; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ARENA_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < ARENA_HEIGHT; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ARENA_WIDTH, y);
      ctx.stroke();
    }

    // Draw attack range if visible
    if (character.isAttackRangeVisible) {
      ctx.beginPath();
      ctx.arc(
        character.position.x,
        character.position.y,
        ATTACK_RANGE,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
      ctx.fill();
    }

    // Draw character
    ctx.beginPath();
    ctx.arc(
      character.position.x,
      character.position.y,
      CHARACTER_SIZE / 2,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = '#4CAF50';
    ctx.fill();
    ctx.strokeStyle = '#388E3C';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [character]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      updateCharacterPosition(ctx);
      drawScene(ctx);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawScene, updateCharacterPosition]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <canvas
      ref={canvasRef}
      width={ARENA_WIDTH}
      height={ARENA_HEIGHT}
      onMouseDown={handleClick}
      onContextMenu={(e) => e.preventDefault()}
      className="border border-gray-300 rounded-lg shadow-md bg-white"
    />
  );
};